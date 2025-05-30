import { useGetSongzQuery, useReactionItemToAudioMutation } from "./AudioSlice";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

import "./../../styles/styles.css";

export default function Audio({ setAudioId, me, setProfileId }) {
  const { data: myData, isSuccess, refetch } = useGetSongzQuery();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();
  const [createItemReactionToAudioMutation] = useReactionItemToAudioMutation();

  useEffect(() => {
    if (isSuccess) {
      setSongs(myData);
    }
  }, [myData]);

  const songsAndReact = useMemo(() => {
    return songs.map((item) => {
      const likes = item.reactions.filter(
        (r) => r.reactionType === "like"
      ).length;
      const dislikes = item.reactions.filter(
        (r) => r.reactionType === "dislike"
      ).length;

      return {
        ...item,
        likes,
        dislikes,
      };
    });
  }, [songs]);

  const onLike = async (id) => {
    try {
      const itemID = id;
      const response = await createItemReactionToAudioMutation({
        itemID,
        reaction: "like",
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const onDislike = async (itemID) => {
    try {
      const response = await createItemReactionToAudioMutation({
        itemID,
        reaction: "dislike",
      }).unwrap();
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const profileHandle = (profileId) => {
    try {
      setProfileId(profileId);
      navigate("/users");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
      <div className="three-column-layout">
        {<Sidebar />}
        <div className="center-content">
          <h1 className="page-header">Sampled Infinites</h1>
          <div>
            {songsAndReact.map((song) => (
              <ul key={song.id}>
                <div className="center">
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      position: "relative",
                      width: "100%",
                      padding: "0 1em",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    >
                      <h2 className="text">{song.name}</h2>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        fontStyle: "italic",
                        marginLeft: "20em",
                      }}
                    >
                      <img
                        style={{
                          maxWidth: "2em",
                          maxHeight: "2em",
                          marginRight: "0.5em",
                          cursor: "pointer",
                        }}
                        onClick={() => profileHandle(song.user)}
                        src={song.User.photoId}
                        alt="Profile"
                      />
                      <h2
                        className="text"
                        style={{ cursor: "pointer" }}
                        onClick={() => profileHandle(song.user)}
                      >
                        {song.User.username}
                      </h2>
                    </div>
                  </div>

                  <CustomAudioPlayer
                    src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${song.id}`}
                  />

                  <div className="comment-actions">
                    <div
                      className="row-container"
                      style={{ marginTop: "-1.5em" }}
                    >
                      <h1 className="text" style={{ fontSize: "1em" }}>
                        {song.likes}
                      </h1>
                      <FontAwesomeIcon
                        icon={faThumbsUp}
                        style={{ color: "white" }}
                      />
                      <FontAwesomeIcon
                        icon={faThumbsDown}
                        style={{ color: "white" }}
                      />
                      <h1 className="error" style={{ fontSize: "1em" }}>
                        {song.dislikes}
                      </h1>
                      <div style={{ marginLeft: "4em" }}>
                        <button
                          className="button"
                          onClick={() => {
                            setAudioId(song.id);
                            navigate("/singleAudio");
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    className="row-container"
                    style={{
                      justifyContent: "flex-start",
                      marginTop: "-2.5em",
                    }}
                  >
                    <button className="button" onClick={() => onLike(song.id)}>
                      Like
                    </button>
                    <button
                      className="button"
                      onClick={() => onDislike(song.id)}
                    >
                      Dislike
                    </button>
                    <div style={{ marginLeft: "10em" }}>
                      <h3 className="text">Description:</h3>
                      <h3 className="text">{song.description}</h3>
                    </div>
                  </div>
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
