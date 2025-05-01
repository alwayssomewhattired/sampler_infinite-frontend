import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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

// import { ListObjectsV2Command } from "@aws-sdk/client-s3";

import "./../../styles/styles.css";

export default function SingleUser({ me }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = me;

  const { data: userInfo, isSuccess: userInfoReady } = useGetUserQuery();

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [songs, setSongs] = useState([]);

  let [itemIds, setItemIds] = useState([]);

  const [createDeleteCommentMutation, isLoading] = useDeleteCommentMutation(
    comments.id
  );

  const [createUpdateCommentMutation, error] = useUpdateCommentMutation();

  const [createPhotoMutation] = useCreatePhotoMutation();
  const [createPhotoDBMutation] = useCreatePhotoDBMutation();

  // const getRandomDefaultPhoto = async () => {
  //   const listParams = {
  //     Bucket: "samplerinfinite-default-photos",
  //     Prefix: "default",
  //   };

  //   const data = await s3.send(new ListObjectsV2Command(listParams));
  //   const files = data.Contents;

  //   if (!files || files.length === 0) {
  //     throw new error("No default picture found");
  //   }

  //   const randomFile = files[Math.floor(Math.random() * files.length)].Key;

  //   console.log(randomFile);
  // };

  useEffect(() => {
    if (userInfoReady) {
      console.log(userInfo);
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
      const matchingSong = songs.find((song) => song.id === comment.itemID);

      if (matchingSong) {
        arr.push({ song: matchingSong, comment });
      }
    }
  }

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
        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const response = await createPhotoMutation(formData);
        console.log("profile Photo: ", response.data.imageUrl);
        const photoId = response.data.imageUrl;
        const response2 = await createPhotoDBMutation({ photoId });
        console.log(response2);
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <div style={{ padding: "20px" }}>
        <label htmlFor="file-upload" className="custom-file-button">
          Choose Photo
        </label>
        <input
          className="sample-name"
          id="file-upload"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        {selectedFile && (
          <p className="text">Selected file: {selectedFile.name}</p>
        )}
        <button
          className="custom-file-button"
          style={{ translate: "20px" }}
          onClick={handleUpload}
        >
          Upload your Profile Picture
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="top-bar" style={{ transform: "translateY(+385px)" }}>
        <div className="menu-l neu">
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
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 className="text">Your Account</h1>
        <ProfilePhoto />
        <h3 className="text">{userName}</h3>
        <h3 className="text">{email}</h3>
        {profileUploader()}
        <button className="button" onClick={() => navigate("/accountChange")}>
          Change Information
        </button>
        <div>
          <h2 className="text">Comments</h2>
        </div>
        {arr.map((arr, index) => (
          <ul key={index}>
            <h3 className="text">{`On: ${arr.song.name}`}</h3>
            <h3 className="text">{`Comment: ${arr.comment.commentText}`}</h3>
            <button
              className="button"
              onClick={() => deleteComment(arr.comment.id)}
            >
              Delete
            </button>
            {!updateMap[arr.comment.id] && (
              <button
                className="button"
                onClick={() => toggleUpdate(arr.comment.id)}
              >
                Update
              </button>
            )}
            {updateMap[arr.comment.id] && (
              <form onSubmit={(e) => commentInfo(e, arr.comment.id)}>
                <input
                  className="border"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button className="button">Submit Update</button>
              </form>
            )}
          </ul>
        ))}
      </div>
    </>
  );
}

//////////////////////////////////////////////////////////        R E V I E W  S H I T     ///////////////////////////////////////////////////////////////////////

// useEffect(() => {
//   if (isFinished) {
//     setReviews(reviewData);
//   }
// }, [reviewData]);

// const { data: reviewData, isSuccess: isFinished } = useGetMyReviewsQuery();
// const [reviews, setReviews] = useState([]);

/* <div>{$details}</div> */
/* <div>
          <h2 className="text">Reviews</h2>
        </div> */
/* {reviews.map((review) => (
          <ul key={review.id}>
            <h3 className="text">{review.reviewText}</h3>
          </ul>
        ))} */
