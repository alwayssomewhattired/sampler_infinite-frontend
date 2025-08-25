import init from "../../src/rust/pkg/grain.js";
import wasmURL from "../../src/rust/pkg/grain_bg.wasm?url";
import { useGetPackQuery } from "./GranularInfiniteNewSlice.js";
import { useKeyToNote } from "../../hooks/useKeyToNote.js";
import { noteToFreq } from "../../utils/noteToFreq.js";
import { keyToNoteUtils } from "../../utils/keyToNoteUtils.js";
import { fetchArrayBufferFromS3 } from "../../utils/s3Utils.js";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import useThrottledCallback from "../../hooks/useThrottledCallback.js";
import { VisualKeyboard } from "../Layout/VisualKeyboard.jsx";
import "./Keyboard.css";
import "../../styles/styles.css";
const GranularInfinite = ({ me, packId }) => {
  console.log("packId: ", packId);
  const { data, isSuccess, refetch } = useGetPackQuery({ packId });
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setFileName(data.name);
      const regex = /^(?:[^/]+\/){3}(\d+)(?=-)/;

      const newItemIDS = {};
      for (let file of data.itemIDS) {
        const match = file.match(regex);
        console.log("reg file: ", file);
        console.log("match: ", match);
        if (match) {
          const freq = match[1]; // the captured number
          const url = `https://websocket-root-dev-audioprocessorapista-mys3bucket-c2dgmekg2772.s3.us-east-2.amazonaws.com/${file}`;
          newItemIDS[freq] = url;
        }
      }

      setItemIDS(newItemIDS);
      handleFileDrop(null, newItemIDS);
    }
  }, [isSuccess, data]);
  const audioCtxRef = useRef(null);
  const nodeRef = useRef(null);
  const [files, setFiles] = useState({});
  const [keySamples, setKeySamples] = useState({});
  const [itemIDS, setItemIDS] = useState({});

  const [grainSize, setGrainSize] = useState(512);
  const [spawnProb, setSpawnProb] = useState(0.08);
  const [maxGrains, setMaxGrains] = useState(32);
  const [octave, setOctave] = useState(4);

  const keyToNote = useKeyToNote(octave);

  const updateEngineParam = useCallback((key, value) => {
    if (nodeRef.current) {
      nodeRef.current.port.postMessage({ type: "set", key: key, value: value });
    }
  }, []);

  const throttledUpdateParam = useThrottledCallback(updateEngineParam, 50);

  const handleFileDrop = async (key, file) => {
    console.log("key", key);
    console.log("file", file);
    console.log("octavio", octave);
    if (file.length > 1 && key) {
      for (let f of file) {
        const parts = f.path.split("/");
        const note = parts[2].toUpperCase();
        console.log("here it is friend, ", note);

        const producedKey = Object.keys(keyToNoteUtils).find(
          (k) => keyToNoteUtils[k] === note
        );
        console.log("my produced key: ", producedKey);
        setFiles((prev) => ({
          ...prev,
          [producedKey]: f,
        }));
        await handleFile(producedKey, f);
      }
    } else if (file && !key) {
      const newFiles = {};
      for (let f of Object.keys(file)) {
        const closestMatch = Object.entries(noteToFreq)
          .filter(([_, v]) => !Array.isArray(v))
          .reduce((a, c) => {
            const [currNote, currFreq] = c;
            const [bestNote, bestFreq] = a;
            return Math.abs(currFreq - f) < Math.abs(bestFreq - f) ? c : a;
          });
        console.log("closest match: ", closestMatch);
        const refinedKey = Object.keys(keyToNoteUtils).find(
          (key) => keyToNoteUtils[key] === closestMatch[0]
        );
        console.log("refined key: ", refinedKey);
        const arrayBuffer = await fetchArrayBufferFromS3(file[f]);
        newFiles[refinedKey] = new Uint8Array(arrayBuffer);
      }

      setFiles((prev) => ({ ...prev, ...newFiles }));

      for (let key of Object.keys(newFiles)) {
        await handleFile(key, newFiles[key]);
      }
    } else {
      setFiles((prev) => ({
        ...prev,
        [key]: file,
      }));
      await handleFile(key, file);
    }
  };

  const handleFile = useCallback(async (key, file) => {
    let arrayBuffer;
    if (file instanceof Uint8Array) {
      arrayBuffer = file.buffer.slice(
        file.byteOffset,
        file.byteOffset + file.byteLength
      );
      console.log("received buffer converted: ", arrayBuffer);
    } else {
      arrayBuffer = await file.arrayBuffer();
    }

    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();

    const audioBuffer = await audioCtxRef.current.decodeAudioData(arrayBuffer);
    const samples = audioBuffer.getChannelData(0);

    if (!nodeRef.current) {
      await audioCtxRef.current.audioWorklet
        .addModule("/granular-worklet.js", { type: "module" })
        .then(() => console.log("Worklet loaded"))
        .catch((err) => console.error("Worklet failed", err));
      nodeRef.current = new AudioWorkletNode(
        audioCtxRef.current,
        "granular-processor",
        {
          numberOfOutputs: 1,
          outputChannelCount: [2],
          note: keyToNoteUtils[key],
        }
      );
      nodeRef.current.connect(audioCtxRef.current.destination);
      const wasmResponse = await fetch(wasmURL);
      const wasmBytes = await wasmResponse.arrayBuffer();
      await init({ bytes: wasmBytes });
      nodeRef.current.port.postMessage({ type: "wasm", bytes: wasmBytes });
      await new Promise((resolve) => {
        nodeRef.current.port.onmessage = (e) => {
          if (e.data?.type === "wasm-ready") {
            console.log("WASM loaded in worklet");
            resolve();
          }
        };
      });
    }

    const bufferCopy = samples.slice().buffer;

    nodeRef.current.port.postMessage(
      {
        type: "samples",
        key: key,
        note: keyToNoteUtils[key],
        samples: bufferCopy,
      },
      [bufferCopy]
    );
    setKeySamples((prev) => ({ ...prev, [key]: samples }));
    // }

    if (audioCtxRef.current.state === "suspended")
      await audioCtxRef.current.resume();
  }, []);

  const handleOctave = (type) => {
    setOctave((prev) => {
      if (type === "plus" && prev < 8) return prev + 1;
      if (type === "minus" && prev > 0) return prev - 1;
    });
  };

  useEffect(() => {
    const activeKeys = new Set();

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      let octaveKey = key + octave;

      if (!keySamples[octaveKey] || activeKeys.has(octaveKey)) return;
      activeKeys.add(octaveKey);

      nodeRef.current?.port.postMessage({ type: "play", key: octaveKey });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      const octaveKey = key + octave;
      if (!activeKeys.has(octaveKey)) return;
      activeKeys.delete(octaveKey);

      nodeRef.current?.port.postMessage({ type: "stop", key: octaveKey });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keySamples, octave]);

  useEffect(() => {
    console.log("files : ", files);
  }, [files]);

  return (
    <>
      <div className="top-menu">
        <div>
          <Link className="neu" to="/">
            Home
          </Link>
        </div>
        <div>
          <Link className="neu" to="/audio">
            Published Audio
          </Link>
        </div>
        <div>
          <Link className="neu" to="/audioCreator">
            samplerinfinite
          </Link>
        </div>
        <div>
          <Link className="neu" to="/granularSynth">
            Granular Synth
          </Link>
        </div>
        {me ? (
          <li>
            <Link className="neu" to="/singleUser">
              My Account
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link className="neu" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="neu" to="/register">
                Register
              </Link>
            </li>
          </>
        )}
      </div>
      <VisualKeyboard
        keyToNote={keyToNote}
        files={files}
        handleFileDrop={handleFileDrop}
        octave={octave}
        fileName={fileName}
      />
      <h3 className="text">Drag & drop sampledinfinite-packs!</h3>

      <div style={{ marginTop: 400 }}>
        <div>
          <h3 className="text">Octave {octave}</h3>
        </div>
        <div>
          <button
            className="button"
            onClick={() => handleOctave("minus")}
            disabled={octave <= 0}
          >
            octave-
          </button>
          <button
            className="button"
            onClick={() => handleOctave("plus")}
            disabled={octave >= 8}
          >
            octave+
          </button>
        </div>
        <div className="controls">
          <div className="control-group">
            <label>Max Grains:</label>
            <input
              type="range"
              min="10"
              max="32"
              step="1"
              value={maxGrains}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                setMaxGrains(v);
                throttledUpdateParam("max_grains", v);
              }}
            />
            <span>{maxGrains}</span>
          </div>
          <div className="control-group">
            <label>Grain Size:</label>
            <input
              type="range"
              min="1"
              max="512"
              step="1"
              value={grainSize}
              onChange={(e) => setGrainSize(parseInt(e.target.value))}
            />
            <span>{grainSize}</span>
          </div>
          <div className="control-group">
            <label>Spawn Probability:</label>
            <input
              type="range"
              min="0.1"
              max="3"
              step="0.01"
              value={spawnProb}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setSpawnProb(v);
                throttledUpdateParam("spawn_prob", v);
              }}
            />
            <span>{spawnProb.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default GranularInfinite;
