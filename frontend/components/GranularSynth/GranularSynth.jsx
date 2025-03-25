import { useState, useRef } from "react";
import { GranularSynth } from "./GranularSynthClass";
import { Link } from "react-router-dom";

const GranularSynthComponent = () => {
  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const synthRef = useRef(new GranularSynth(audioContextRef.current));

  const [isPlaying, setIsPlaying] = useState(false);
  const [grainSize, setGrainSize] = useState(0.1);
  const [overlap, setOverlap] = useState(0.05);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false); // ✅ Loop state

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      await synthRef.current.loadSample(file);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      synthRef.current.stop();
    } else {
      synthRef.current.grainSize = grainSize;
      synthRef.current.overlap = overlap;
      synthRef.current.playbackRate = playbackRate;
      synthRef.current.setLoop(loop); // ✅ Apply looping state
      synthRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div>
        <Link to="/audio">Published Audio</Link>
      </div>
      <div>
        <Link to="/audioCreator">Sampler Infinite</Link>
      </div>
      <div>
        <Link to="/singleUser">Your Account</Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>🎛️ Granular Synth</h1>
        <h2>play your sampled infinites or any other audio file!</h2>

        <input type="file" accept="audio/*" onChange={handleFileUpload} />

        <div>
          <label>Grain Size: {grainSize.toFixed(2)}s</label>
          <input
            type="range"
            min="0.01"
            max="0.5"
            step="0.01"
            value={grainSize}
            onChange={(e) => setGrainSize(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Overlap: {overlap.toFixed(2)}s</label>
          <input
            type="range"
            min="0"
            max="0.2"
            step="0.01"
            value={overlap}
            onChange={(e) => setOverlap(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Playback Rate: {playbackRate.toFixed(2)}x</label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={playbackRate}
            onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
          />
        </div>

        <div>
          <label>Loop: </label>
          <input
            type="checkbox"
            checked={loop}
            onChange={() => {
              const newLoopState = !loop;
              setLoop(newLoopState);
              synthRef.current.setLoop(newLoopState);
            }}
          />
        </div>

        <button
          onClick={togglePlayback}
          style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
        >
          {isPlaying ? "Stop" : "Play"}
        </button>
      </div>
    </>
  );
};

export default GranularSynthComponent;
