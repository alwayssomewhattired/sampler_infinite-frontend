import init from "../../src/rust/pkg/grain.js";
import wasmURL from "../../src/rust/pkg/grain_bg.wasm?url";
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

  const keyToNote = useMemo(() => {
    return {
      a: "C" + octave,
      w: "C#" + octave,
      s: "D" + octave,
      e: "D#" + octave,
      d: "E" + octave,
      f: "F" + octave,
      t: "F#" + octave,
      g: "G" + octave,
      y: "G#" + octave,
      h: "A" + octave,
      u: "A#" + octave,
      j: "B" + octave,
      k: "C" + (octave + 1),
      o: "C#" + (octave + 1),
      l: "D" + (octave + 1),
      p: "D#" + (octave + 1),
      ";": "E" + (octave + 1),
      "'": "F" + (octave + 1),
    };
  }, [octave]);

  const updateEngineParam = useCallback((key, value) => {
    if (nodeRef.current) {
      nodeRef.current.port.postMessage({ type: "set", key: key, value: value });
    }
  }, []);

  const throttledUpdateParam = useThrottledCallback(updateEngineParam, 50);

  const handleFileDrop = async (key, file) => {
    setFiles((prev) => ({
      ...prev,
      [key]: file,
    }));

    await handleFile(key, file);
  };

  // for playing audio

  const handleFile = useCallback(async (key, file) => {
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
        }
      );
      nodeRef.current.connect(audioCtxRef.current.destination);
      // try calling init in here
      const wasmResponse = await fetch(wasmURL);
      console.log(wasmResponse);
      const wasmBytes = await wasmResponse.arrayBuffer();
      console.log(wasmBytes);
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

    //   nodeRef.current.port.onmessage = (e) => {
    //     if (e.data?.type === "ready")
    //       console.log("Grain engine ready in worklet");
    //   };
    // }
    const bufferCopy = samples.slice().buffer;
    nodeRef.current.port.postMessage(
      { type: "samples", key, samples: bufferCopy },
      [bufferCopy]
    );

    setKeySamples((prev) => ({ ...prev, [key]: samples }));

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
      if (!keySamples[key] || activeKeys.has(key)) return;
      activeKeys.add(key);

      nodeRef.current?.port.postMessage({ type: "play", key: key });
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (!activeKeys.has(key)) return;
      activeKeys.delete(key);

      nodeRef.current?.port.postMessage({ type: "stop", key: key });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keySamples]);

  return (
    <>
      <VisualKeyboard
        keyToNote={keyToNote}
        files={files}
        handleFileDrop={handleFileDrop}
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
