import { useGetSongzQuery } from "./AudioSlice";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";

import "./../../styles/styles.css";
// import "./AudioStyle.css";

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
        <h1 className="logo-text">SAMPLERINFINITE</h1>
      </div>
      <div className="three-column-layout">
        {<Sidebar />}
        <div className="center-content">
          <h1 className="page-header">Sampled Infinites</h1>
          <div>
            {songs.map((song) => (
              <ul key={song.id}>
                <div className="center">
                  <h2 className="text">Name:</h2>
                  <h2 className="text">{song.name}</h2>
                  <CustomAudioPlayer
                    src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${song.id}`}
                  />
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
        {<Account me={me} />}
      </div>
    </>
  );
}
