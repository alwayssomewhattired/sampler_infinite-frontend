import { useGetSongzQuery } from "./AudioSlice";
import CustomAudioPlayer from "../../styles/CustomAudioPlayer";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

// import "./../../styles/styles.css";
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
      <div className="audio-logo">
        <h1 className="audio-logo-text">SAMPLERINFINITE</h1>
      </div>
      <div className="audio-three-column-layout">
        {/* Left: Menu */}
        <div className="audio-sidebar audio-menu-l audio-neu">
          <h2 className="audio-li-header">Menu</h2>
          <ul>
            <li>
              <Link className="audio-neu" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="audio-neu" to="/audioCreator">
                samplerinfinite
              </Link>
            </li>
            <li>
              <Link className="audio-neu" to="/audio">
                Published Audio
              </Link>
            </li>
            <li>
              <Link className="audio-neu" to="/granularInfinite">
                granularinfinite
              </Link>
            </li>
            <li>
              <Link className="audio-neu" to="/granularSynth">
                Granular Synth
              </Link>
            </li>
          </ul>
        </div>
        <div className="audio-center-content">
          <h1 className="audioHeader">Sampled Infinites</h1>
          <div>
            {songs.map((song) => (
              <ul key={song.id}>
                <div className="audio-center">
                  <h2 className="audio-text">Name:</h2>
                  <h2 className="audio-text">{song.name}</h2>
                  <CustomAudioPlayer
                    src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${song.id}`}
                  />
                  <button
                    className="audio-button"
                    onClick={() => {
                      setAudioId(song.id);
                      navigate("/singleAudio");
                    }}
                  >
                    View
                  </button>
                  <h3 className="audio-text">Description:</h3>
                  <h3 className="audio-text">{song.description}</h3>
                </div>
              </ul>
            ))}
          </div>
        </div>
        {/* Right: Account */}
        <div className="audio-account menu neu">
          <h2 className="audio-li-header">Account</h2>
          <ul>
            {me ? (
              <li>
                <Link className="audio-neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link className="audio-neu" to="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="audio-neu" to="/register">
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
