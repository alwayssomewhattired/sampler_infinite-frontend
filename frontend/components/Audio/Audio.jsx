import { useGetSongzQuery } from "./AudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";
import "./AudioStyle.css";

export default function Audio({ setAudioId, me }) {
  const { data: myData, isSuccess } = useGetSongzQuery();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setSongs(myData);
    }
  }, [myData]);

  return (
    <>
      <div className="logo">
        <h1 className="text">SAMPLERINFINITE</h1>
      </div>
      <div className="audio-three-column-layout">
        {/* Left: Menu */}
        <div className="audio-sidebar menu-l neu">
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
        <div className="audio-center-content">
          <h1 className="text">Sampled Infinites</h1>
          <div>
            {songs.map((song) => (
              <ul key={song.id}>
                <div style={{ padding: "20px" }}>
                  <h2 className="text">Name:</h2>
                  <h2 className="text">{song.name}</h2>
                  <audio controls>
                    <source
                      src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${song.id}`}
                      type="audio/wav"
                    />
                    Your browser does not support the audio element
                  </audio>
                  <button
                    className="button"
                    onClick={() => {
                      setAudioId(song.id);
                      navigate("/singleAudio");
                    }}
                  >
                    View
                  </button>
                  <h3 className="text">Description:</h3>
                  <h3 className="text">{song.description}</h3>
                </div>
              </ul>
            ))}
          </div>
        </div>
        {/* Right: Account */}
        <div className="audio-sidebar menu neu">
          <h2 className="li-header">Account</h2>
          <ul>
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
          </ul>
        </div>
      </div>
    </>
  );
}
