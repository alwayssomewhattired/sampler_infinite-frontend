import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import "./Keyboard.css";

const keyToNote = {
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4",
  k: "C5",
};

const SamplerApp = () => {
  const [grainPlayers, setGrainPlayers] = useState({});
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [grainInterval, setGrainInterval] = useState({});

  // Granular synth parameters
  const [grainSize, setGrainSize] = useState(0.05); // Grain size in seconds
  const [overlap, setOverlap] = useState(0.1); // Overlap between grains
  const [speed, setSpeed] = useState(1); // Speed of grain playback

  // Initialize Tone.js Audio Context when the component mounts
  useEffect(() => {
    Tone.start().then(() => {
      console.log("Audio context started");
    });
  }, []);

  const loadSample = (key, file) => {
    // Check if the file is a valid audio file
    const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
    if (!validExtensions.includes(file.type)) {
      alert(
        "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
      );
      return;
    }

    const url = URL.createObjectURL(file);

    // Create a new GrainPlayer for the sample
    const grainPlayer = new Tone.GrainPlayer(url, {
      grainSize: grainSize, // Use the state value for grain size
      overlap: overlap, // Use the state value for overlap
      speed: speed, // Use the state value for speed
      loop: true, // Loop the grains
    }).toDestination();

    // Store the grainPlayer and sample details
    setGrainPlayers((prev) => {
      const updatedGrainPlayers = { ...prev };
      updatedGrainPlayers[key] = updatedGrainPlayers[key] || [];
      updatedGrainPlayers[key].push({ player: grainPlayer, name: file.name });
      return updatedGrainPlayers;
    });
  };

  //
  //
  //
  //
  //bad
  // does not stop when key is unpressed

  const grainIntervalIds = {}; // Store interval IDs for each key

  const playSample = (key) => {
    if (grainPlayers[key] && !activeKeys.has(key)) {
      grainPlayers[key].forEach(({ player }) => {
        // Slightly stagger the start time for each player by adding an offset based on the index
        const startTime = Tone.now() + 0.1; // Start immediately for the first grain

        // Trigger the first grain at a random position
        const randomStartPosition = Math.random() * player.buffer.duration;
        player.start(startTime, randomStartPosition);

        // Schedule random grains continuously
        const grainInterval = Math.random() * 0.2 + 0.05; // Random grain interval between 0.05s to 0.25s

        // Keep track of when the next grain should be scheduled
        let nextGrainTime = startTime + grainInterval;

        // Function to trigger grains continuously at random intervals
        const triggerGrain = () => {
          const randomStartPosition = Math.random() * player.buffer.duration;
          player.start(nextGrainTime, randomStartPosition);

          // Update the next grain time with a random interval
          nextGrainTime += Math.random() * 0.2 + 0.05; // Add a random interval for the next grain
        };

        // Start the grain triggering loop
        const repeatGrain = () => {
          triggerGrain();
          grainIntervalIds[key] = setTimeout(
            repeatGrain,
            (nextGrainTime - Tone.now()) * 1000
          ); // Schedule the next grain
        };

        // Start the grain triggering loop
        repeatGrain();
      });

      setActiveKeys((prev) => new Set(prev).add(key));
    }
  };

  const stopSample = (key) => {
    if (grainPlayers[key]) {
      // Stop all grain players associated with the key
      grainPlayers[key].forEach(({ player }) => {
        player.stop(); // Stop each grain player
      });

      // Stop all grain triggering intervals
      if (grainIntervalIds[key]) {
        clearTimeout(grainIntervalIds[key]); // Stop the grain triggering loop
        grainIntervalIds[key] = null; // Clear the timeout ID for this key
      }
    }

    // Remove the key from the active keys set
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  // Handle key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keyToNote && !activeKeys.has(key)) {
        playSample(key);
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      stopSample(key); // Stop the sample when the key is released
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [grainPlayers, activeKeys]);

  return (
    <div>
      <h2>Granular Keyboard Sampler</h2>
      <p>
        Press <strong>A, S, D, F, G, H, J, K</strong> to play multiple samples
        with granular synthesis.
      </p>
      <DropZone onFileDrop={loadSample} />
      <VisualKeyboard
        activeKeys={activeKeys}
        sampleMap={grainPlayers}
        playSample={playSample}
      />

      {/* Granular Synth Controls */}
      <div className="controls">
        <div className="control-group">
          <label>Grain Size (s):</label>
          <input
            type="range"
            min="0.01"
            max="0.2"
            step="0.01"
            value={grainSize}
            onChange={(e) => setGrainSize(parseFloat(e.target.value))}
          />
          <span>{grainSize.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Overlap:</label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={overlap}
            onChange={(e) => setOverlap(parseFloat(e.target.value))}
          />
          <span>{overlap.toFixed(2)}</span>
        </div>
        <div className="control-group">
          <label>Speed:</label>
          <input
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
          />
          <span>{speed.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

const DropZone = ({ onFileDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*", // Ensure it accepts audio files only
    onDrop: (files) => {
      const key = prompt("Press the key you want to assign this sample to:");
      if (key) onFileDrop(key.toLowerCase(), files[0]);
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        padding: 20,
        textAlign: "center",
        marginBottom: 20,
      }}
    >
      <input {...getInputProps()} />
      <p>Drag & Drop an Audio File or Click to Upload</p>
    </div>
  );
};

const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
  return (
    <div className="keyboard">
      {Object.keys(keyToNote).map((key) => (
        <div key={key} className="key-container">
          <div
            className={classNames("key", {
              active: activeKeys.has(key),
              assigned: sampleMap[key],
            })}
            onClick={() => playSample(key)}
          >
            {key.toUpperCase()}
            {sampleMap[key] &&
              sampleMap[key].map((sample, idx) => (
                <div key={idx} className="sample-name">
                  {sample.name}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SamplerApp;
