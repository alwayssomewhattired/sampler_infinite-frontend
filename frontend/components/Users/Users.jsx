import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAboutHimQuery } from "./UsersSlice";
import Sidebar from "../Layout/Sidebar";
import Account from "../Layout/Account";

import "./../../styles/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import useEnrichedUser from "../../utils/useEnrichedUser";

export default function Users({ profileId, setAudioId, me }) {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const { data: profileData, isSuccess: isProfileData } =
    useAboutHimQuery(profileId);

  useEffect(() => {
    if (isProfileData) {
      setUser(profileData);
    }
  }, [isProfileData, profileData]);

  const handleContentClick = (audioId) => {
    setAudioId(audioId);
    navigate("/singleAudio");
  };

  const enrichedUser = useEnrichedUser(user);
  return (
    <>
      <div className="two-column-layout">
        {<Sidebar />}
        <div className="right" style={{ marginLeft: "8%", marginTop: "6.5%" }}>
          <div className="logo-container">
            <div className="logo">
              <h1 className="logo-text" onClick={() => navigate("/")}>
                SAMPLERINFINITE
              </h1>
            </div>
          </div>
          {user && enrichedUser && (
            <li key={enrichedUser.id}>
              <div style={{ display: "flex", gap: "1em" }}>
                <h1 className="text" style={{ marginBottom: "1em" }}>
                  {enrichedUser.username}'s Account
                </h1>
                <h6 className="text" style={{ alignContent: "center" }}>
                  {enrichedUser.created_at}
                </h6>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginRight: "6.5em",
                }}
              >
                <img
                  style={{ height: "80px" }}
                  src={enrichedUser.photoId}
                  alt="Profile"
                />
              </div>
              <div
                style={{
                  marginTop: "2em",
                  display: "flex",
                  marginLeft: "1em",
                }}
              >
                <h2 className="text">SampledInfinites</h2>
              </div>
              {enrichedUser.items?.map((audio) => (
                <div
                  key={audio.id}
                  style={{ marginBottom: "1em", marginRight: "6.5em" }}
                >
                  <h3
                    className="text"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                    onClick={() => handleContentClick(audio.id)}
                  >
                    {audio.name}
                  </h3>
                  <div style={{ marginRight: "2em" }}>
                    <CustomAudioPlayer
                      src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${audio.id}`}
                    />
                  </div>
                  <div className="row-container">
                    <h1 className="text" style={{ fontSize: "1em" }}>
                      {audio.reactionCounts.like}
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
                      {audio.reactionCounts.dislike}
                    </h1>
                  </div>
                </div>
              ))}
              <div
                style={{
                  marginTop: "2em",
                  display: "flex",
                  marginLeft: "3em",
                }}
              >
                <h2 className="text">Comments</h2>
              </div>
              {enrichedUser.comments?.map((comment) => {
                return (
                  <div
                    key={comment.id}
                    style={{ marginBottom: "1em", marginRight: "6.5em" }}
                  >
                    <h3
                      className="text"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => handleContentClick(comment.itemID)}
                    >
                      On: {comment.item?.name || "Unknown Item"}
                    </h3>
                    <h3
                      className="text"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {comment.commentText}
                    </h3>
                    <div className="row-container">
                      <h1 className="text" style={{ fontSize: "1em" }}>
                        {comment.reactionCounts.like}
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
                        {comment.reactionCounts.dislike}
                      </h1>
                    </div>
                  </div>
                );
              })}
            </li>
          )}
        </div>
        <Account me={me} />
      </div>
    </>
  );
}
