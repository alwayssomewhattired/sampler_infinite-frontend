import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAboutHimQuery } from "./UsersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Layout/Sidebar";
import "./../../styles/styles.css";

export default function Users({ profileId, setAudioId }) {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const { data: profileData, isSuccess: isProfileData } =
    useAboutHimQuery(profileId);

  useEffect(() => {
    if (isProfileData) {
      setUser(profileData);
      console.log("profileData", profileData);
    }
  }, [isProfileData, profileData]);

  const handleCommentClick = (audioId) => {
    console.log("audio id", audioId);
    setAudioId(audioId);
    navigate("/singleAudio");
  };

  const commentsAndReact = useMemo(() => {
    const likes = user.reactions?.filter(
      (r) => [r].reactionType === "like"
    ).length;
    const dislikes = user.reactions?.filter(
      (r) => [r].reactionType === "dislike"
    ).length;

    return {
      ...user,
      likes,
      dislikes,
    };
  }, [user]);

  useEffect(() => {
    if (commentsAndReact) {
      console.log(commentsAndReact);
    }
  }, [commentsAndReact]);

  return (
    <>
      <div className="two-column-layout">
        {<Sidebar />}
        <div className="right" style={{ marginLeft: "5em" }}>
          {user && commentsAndReact && (
            <li key={commentsAndReact.id}>
              <div style={{ display: "flex", gap: "1em" }}>
                <h1 className="text" style={{ marginBottom: "1em" }}>
                  {commentsAndReact.username}'s Account
                </h1>
                <h6 className="text" style={{ alignContent: "center" }}>
                  {commentsAndReact.created_at}
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
                  src={commentsAndReact.photoId}
                  alt="Profile"
                />
              </div>
              <div
                style={{
                  marginTop: "2em",
                  display: "flex",
                  marginLeft: "3em",
                }}
              >
                <h2 className="text">Comments</h2>
              </div>
              {commentsAndReact.comments?.map((comment) => {
                const item = commentsAndReact.items.find(
                  (item) => item.id === comment.itemID
                );

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
                      }}
                      onClick={() => handleCommentClick(comment.itemID)}
                    >
                      On: {item?.name || "Unknown Item"}
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
                  </div>
                );
              })}
              <div className="row-container" style={{ marginRight: "6.5em" }}>
                <h1 className="text" style={{ fontSize: "1em" }}>
                  {commentsAndReact.likes}
                </h1>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: "white" }} />
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  style={{ color: "white" }}
                />
                <h1 className="error" style={{ fontSize: "1em" }}>
                  {commentsAndReact.dislikes}
                </h1>
              </div>
            </li>
          )}
        </div>
      </div>
    </>
  );
}
