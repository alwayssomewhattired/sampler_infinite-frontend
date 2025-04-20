import { useState, useRef } from "react";
import { GranularSynth } from "./GranularSynthClass";
import { Link } from "react-router-dom";

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
      <div className="top-bar">
        {me ? (
          <div
            className="menu neu"
            style={{ transform: "translateX(+1040%)", marginBottom: "110px" }}
          >
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="menu neu">
            <h2 className="li-header">Account</h2>
            <ul>
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
            </ul>
          </div>
        )}
      </div>
      <div className="top-bar">
        <div className="menu-l neu">
          <h2 className="li-header">Menu</h2>
          <ul>
            <li>
              <Link className="neu" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audioCreator">
                samplerinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audio">
                Published Audio
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularInfinite">
                granularinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularSynth">
                Granular Synth
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        style={{ textAlign: "center", padding: "20px", marginTop: "-350px" }}
      >
        <h1 className="text">Granular Synth</h1>
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
    </>
  );
};

export default GranularSynthComponent;
