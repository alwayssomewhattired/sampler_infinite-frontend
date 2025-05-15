import { useGetSongzQuery } from "./AudioSlice";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";

import "./../../styles/styles.css";

export default function Audio({ setAudioId, me }) {
  const { data: myData, isSuccess } = useGetSongzQuery();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setSongs(myData);
      console.log(myData);
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
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <h2 className="text">{song.name}</h2>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      fontStyle: "italic",
                    }}
                  >
                    <img
                      style={{
                        display: "flex",
                        maxWidth: "2em",
                        maxHeight: "2em",
                        marginRight: "0.5em",
                      }}
                      src={song.User.photoId}
                      alt="Profile"
                    />
                    <h2 className="text">{song.User.username}</h2>
                  </div>
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
