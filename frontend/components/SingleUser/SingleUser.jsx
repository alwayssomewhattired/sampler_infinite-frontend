import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetMyCommentsQuery,
  useGetSongsQuery,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "./SingleUserSlice";

import "./../../styles/styles.css";

export default function SingleUser({ me }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = me;

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [songs, setSongs] = useState([]);
  const [email, setEmail] = useState("");

  let [itemIds, setItemIds] = useState([]);

  const [createDeleteCommentMutation, isLoading] = useDeleteCommentMutation(
    comments.id
  );
  const [createUpdateCommentMutation, error] = useUpdateCommentMutation();

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
