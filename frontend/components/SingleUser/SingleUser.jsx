import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetMyCommentsQuery,
  useGetSongsQuery,
  useGetUserQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useCreatePhotoMutation,
  useCreatePhotoDBMutation,
} from "./SingleUserSlice";
import ProfilePhoto from "./ProfilePhoto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";

import Sidebar from "../Layout/Sidebar";
import "./../../styles/styles.css";

export default function SingleUser({ me, setAudioId }) {
  const navigate = useNavigate();

  const { data: userInfo, isSuccess: userInfoReady } = useGetUserQuery();

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [songs, setSongs] = useState([]);

  let [itemIds, setItemIds] = useState([]);

  const [createDeleteCommentMutation] = useDeleteCommentMutation(comments.id);

  const [createUpdateCommentMutation] = useUpdateCommentMutation();

  const [createPhotoMutation] = useCreatePhotoMutation();
  const [createPhotoDBMutation] = useCreatePhotoDBMutation();

  useEffect(() => {
    if (userInfoReady) {
      setUserName(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfoReady, userInfo]);

  // Wait until commentData is ready
  useEffect(() => {
    if (isReady && commentData.length > 0) {
      setComments(commentData);

      const ids = commentData.map((a) => a.itemID);
      setItemIds(ids); // <- update state
    }
  }, [isReady, commentData]);

  // Now call useGetSongsQuery only after itemId is set
  const { data: songData, isSuccess: songSuccess } = useGetSongsQuery(itemIds, {
    skip: !itemIds || itemIds.length === 0,
  });

  useEffect(() => {
    if (songSuccess) {
      setSongs(songData);
    }
  }, [songSuccess, songData]);

  const deleteComment = async (commentId) => {
    try {
      window.location.reload();
      const response = await createDeleteCommentMutation(commentId);
      navigate("/singleUser");
    } catch (error) {
      console.error(error);
    }
  };

  const commentInfo = async (e, commentId) => {
    e.preventDefault();
    try {
      window.location.reload();
      const response = await createUpdateCommentMutation({
        commentId,
        commentText,
      });
      navigate("/singleUser");
    } catch (error) {
      console.error(error);
    }
  };

  const [updateMap, setUpdateMap] = useState({});

  const toggleUpdate = (id) => {
    setUpdateMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  let arr = [];

  if (songs.length !== 0 && comments.length !== 0) {
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const likes = comments[i].reactions.filter(
        (e) => e.reactionType == "like"
      ).length;
      const dislikes = comments[i].reactions.filter(
        (e) => e.reactionType == "dislike"
      ).length;
      const matchingSong = songs.find((song) => song.id === comment.itemID);

      if (matchingSong) {
        arr.push({ song: matchingSong, comment, likes, dislikes });
      }
    }
  }

  const handleCommentClick = (audioId) => {
    setAudioId(audioId);
    navigate("/singleAudio");
  };

  const profileUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
      try {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("profilePicture", selectedFile);

        const response = await createPhotoMutation(formData);
        const photoId = response.data.imageUrl;
        const response2 = await createPhotoDBMutation({ photoId });
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <>
        <div style={{ padding: "1em" }}>
          <label
            htmlFor="file-upload"
            className="rect-button"
            style={{
              padding: "0.05rem 0.5em",
              margin: "1em",
              marginRight: "0.5em",
              display: "inline-block",
            }}
          >
            Choose Photo
          </label>
          <input
            className="text"
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          {selectedFile && (
            <p className="text">Selected file: {selectedFile.name}</p>
          )}
          <button className="rect-button" onClick={handleUpload}>
            Upload your Profile Picture
          </button>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="two-column-layout">
        {<Sidebar />}
        <div className="right">
          <h1 className="text">Your Account</h1>
          <ProfilePhoto />
          <h3 className="text">{userName}</h3>
          <h3 className="text">{email}</h3>
          {profileUploader()}
          <button
            className="button"
            style={{ marginTop: "1em" }}
            onClick={() => navigate("/accountChange")}
          >
            Change Information
          </button>
          <div>
            <h2 className="text">Comments</h2>
          </div>
          {arr.map((item, index) => (
            <li key={index}>
              <h3
                className="text"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  textDecoration: "underline",
                }}
                onClick={() => handleCommentClick(item.song.id)}
              >{`On: ${item.song.name}`}</h3>
              <h3
                className="text"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {item.comment.commentText}
              </h3>
              <div className="row-container">
                <h1 className="text" style={{ fontSize: "1em" }}>
                  {item.likes}
                </h1>
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: "white" }} />
                <FontAwesomeIcon
                  icon={faThumbsDown}
                  style={{ color: "white" }}
                />
                <h1 className="error" style={{ fontSize: "1em" }}>
                  {item.dislikes}
                </h1>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "5em",
                }}
              >
                {!updateMap[item.comment.id] && (
                  <button
                    className="button"
                    onClick={() => toggleUpdate(item.comment.id)}
                  >
                    Update
                  </button>
                )}
                <button
                  className="button"
                  onClick={() => deleteComment(item.comment.id)}
                >
                  Delete
                </button>
                {updateMap[item.comment.id] && (
                  <form onSubmit={(e) => commentInfo(e, item.comment.id)}>
                    <input
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <button className="button">Submit Update</button>
                  </form>
                )}
              </div>
            </li>
          ))}
        </div>
      </div>
    </>
  );
}
