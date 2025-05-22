import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useGetSelfToSingleUserQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useCreatePhotoMutation,
  useCreatePhotoDBMutation,
} from "./SingleUserSlice";
import ProfilePhoto from "./ProfilePhoto";
import CustomAudioPlayer from "../Layout/CustomAudioPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import useEnrichedUser from "../../utils/useEnrichedUser";
import Sidebar from "../Layout/Sidebar";
import "./../../styles/styles.css";

export default function SingleUser({ me, setAudioId }) {
  const navigate = useNavigate();

  const [user, setUser] = useState();
  const {
    data: selfData,
    isSuccess: isSelf,
    refetch,
  } = useGetSelfToSingleUserQuery();
  useEffect(() => {
    if (isSelf) {
      setUser(selfData);
    }
  }, [isSelf, selfData]);

  const [commentText, setCommentText] = useState("");

  const [createDeleteCommentMutation] = useDeleteCommentMutation();

  const [createUpdateCommentMutation] = useUpdateCommentMutation();

  const [createPhotoMutation] = useCreatePhotoMutation();
  const [createPhotoDBMutation] = useCreatePhotoDBMutation();

  const deleteComment = async (commentId) => {
    try {
      const response = await createDeleteCommentMutation(commentId);
      await refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const commentInfo = async (e, commentId) => {
    e.preventDefault();
    try {
      const response = await createUpdateCommentMutation({
        commentId,
        commentText,
      });
      await refetch();
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

  const handleContentClick = (audioId) => {
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

  const enrichedUser = useEnrichedUser(user);

  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
      <div className="two-column-layout">
        {<Sidebar />}
        <div
          className="right"
          style={{ marginRight: "12.5%", marginTop: "6.5%" }}
        >
          <h1 className="text">Your Account</h1>
          <ProfilePhoto />
          {enrichedUser && user && (
            <>
              <h2 className="text">{enrichedUser.username}</h2>
              <h2 className="text">{enrichedUser.email}</h2>
              <h6 className="text">{enrichedUser.created_at}</h6>
            </>
          )}
          {profileUploader()}
          <button
            className="button"
            style={{ marginTop: "1em" }}
            onClick={() => navigate("/accountChange")}
          >
            Change Information
          </button>
          <div>
            <h2 className="text">sampledinfinites</h2>
          </div>
          {enrichedUser?.items?.map((audio) => (
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
                <FontAwesomeIcon icon={faThumbsUp} style={{ color: "white" }} />
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
          <h2 className="text">Comments</h2>
          {enrichedUser?.comments?.map((comment) => {
            return (
              <div
                key={comment.id}
                style={{ marginBottom: "1em", marginRight: "0em" }}
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: "5em",
                  }}
                >
                  {!updateMap[comment.id] && (
                    <button
                      className="button"
                      onClick={() => toggleUpdate(comment.id)}
                    >
                      Update
                    </button>
                  )}
                  <button
                    className="button"
                    onClick={() => deleteComment(comment.id)}
                  >
                    Delete
                  </button>
                  {updateMap[comment.id] && (
                    <form onSubmit={(e) => commentInfo(e, comment.id)}>
                      <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                      />
                      <button className="button">Submit Update</button>
                    </form>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
