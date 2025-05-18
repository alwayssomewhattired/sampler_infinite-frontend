import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAboutHimQuery } from "./UsersSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../Layout/Sidebar";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
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
    const allReactions = user.comments?.flatMap((comment) => comment.reactions);
    const everything = allReactions?.reduce((element, reaction) => {
      const { commentID, reactionType } = reaction;

      if (!element[commentID]) {
        element[commentID] = { like: 0, dislike: 0 };
      }
      if (reactionType in element[commentID]) {
        element[commentID][reactionType]++;
      } else {
        element[commentID][reactionType] = 1;
      }
      return element;
    }, {});

    const commentsWithExtras = user.comments?.map((comment) => {
      const reactionCounts = everything?.[comment.id] ?? {
        like: 0,
        dislike: 0,
      };
      const matchingItem = user.items?.find(
        (item) => item.id === comment.itemID
      );

      return {
        ...comment,
        reactionCounts,
        item: matchingItem || null,
      };
    });
    console.log(commentsWithExtras);

    return {
      ...user,
      comments: commentsWithExtras,
      everything,
    };
  }, [user]);

  useEffect(() => {
    if (commentsAndReact) {
      console.log(commentsAndReact);
    }
  });

  return (
    <>
      <div className="two-column-layout">
        {<Sidebar />}{" "}
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
                  marginLeft: "1em",
                }}
              >
                <h2 className="text">SampledInfinites</h2>
              </div>
              {commentsAndReact.comments?.map((audio) => {
                return (
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
                      onClick={() => handleCommentClick(audio.item.id)}
                    >
                      {audio.item.name}
                    </h3>
                    <div style={{ marginRight: "2em" }}>
                      <CustomAudioPlayer
                        src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${audio.item.id}`}
                      />
                    </div>
                  </div>
                );
              })}
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
                      onClick={() => handleCommentClick(comment.itemID)}
                    >
                      On: {comment.item.name || "Unknown Item"}
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
      </div>
    </>
  );
}
