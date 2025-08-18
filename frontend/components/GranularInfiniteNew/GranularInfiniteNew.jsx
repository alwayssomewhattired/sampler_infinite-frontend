import init from "../../src/rust/pkg/grain.js";
import wasmURL from "../../src/rust/pkg/grain_bg.wasm?url";
import { useKeyToNote } from "../../hooks/useKeyToNote.js";
import { keyToNoteUtils } from "../../utils/keyToNoteUtils.js";
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import useThrottledCallback from "../../hooks/useThrottledCallback.js";
import { VisualKeyboard } from "../Layout/VisualKeyboard.jsx";
import "./Keyboard.css";
import "../../styles/styles.css";
const GranularInfinite = ({ me, packId }) => {
  const audioCtxRef = useRef(null);
  const nodeRef = useRef(null);
  const [files, setFiles] = useState({});
  const [keySamples, setKeySamples] = useState({});

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
    if (file.length > 1) {
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
    } else {
      setFiles((prev) => ({
        ...prev,
        [key]: file,
      }));
      await handleFile(key, file);
    }
  };

  const handleFile = useCallback(async (key, file) => {
    // support folder drop /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // for (let f of file) {
    console.log("my file", file);
    const arrayBuffer = await file.arrayBuffer();

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

  return (
    <>
      <VisualKeyboard
        keyToNote={keyToNote}
        files={files}
        handleFileDrop={handleFileDrop}
        octave={octave}
      />

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
