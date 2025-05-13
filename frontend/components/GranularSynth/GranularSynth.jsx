import { useState, useRef } from "react";
import { GranularSynth } from "./GranularSynthClass";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import "./../../styles/styles.css";

const GranularSynthComponent = ({ me }) => {
  const audioContextRef = useRef(
    new (window.AudioContext || window.webkitAudioContext)()
  );
  const synthRef = useRef(new GranularSynth(audioContextRef.current));

  const [isPlaying, setIsPlaying] = useState(false);
  const [grainSize, setGrainSize] = useState(0.1);
  const [overlap, setOverlap] = useState(0.05);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [loop, setLoop] = useState(false); // Loop state

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
      synthRef.current.setLoop(loop); // Apply looping state
      synthRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <div className="logo">
        <h1 className="logo-text">SAMPLERINFINITE</h1>
      </div>
      <div className="three-column-layout">
        {<Sidebar />}

        <div
          style={{
            textAlign: "center",
            padding: "10%",
          }}
        >
          <h2 className="text">
            play your sampled infinites or any other audio file!
          </h2>

          <input
            className="text"
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
          />

          <div>
            <label className="text">Grain Size: {grainSize.toFixed(2)}s</label>
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
            <label className="text">Overlap: {overlap.toFixed(2)}s</label>
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
            <label className="text">
              Playback Rate: {playbackRate.toFixed(2)}x
            </label>
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
            <label className="text">Loop: </label>
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
            className="button"
            onClick={togglePlayback}
            style={{ marginTop: "20px", padding: "10px", fontSize: "16px" }}
          >
            {isPlaying ? "Stop" : "Play"}
          </button>
        </div>
        {<Account me={me} />}
      </div>
    </>
  );
};

export default GranularSynthComponent;
