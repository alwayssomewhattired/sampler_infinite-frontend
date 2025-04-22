import {
  useGetSingleAudioQuery,
  useGetCommentsQuery,
  usePostCommentMutation,
  // useGetReviewsQuery,
  // useCreateReviewMutation,
} from "./SingleAudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function SingleItem({ audioId, me }) {
  const { data: myData, isSuccess } = useGetSingleAudioQuery(audioId);

  const { data: commentData, isSuccess: loaded } = useGetCommentsQuery(audioId);
  const [comments, setComments] = useState([]);

  const [createCommentMutation, isLoading, error] = usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  const [song, setSong] = useState("");

  const userID = me;
  const itemId = audioId;

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setSong(myData);
    }
  }, [myData]);

  useEffect(() => {
    if (loaded) {
      setComments(commentData);
    }
  }, [commentData]);

  const commentInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createCommentMutation({
        userID,
        itemId,
        // reviewId,
        commentText,
      });
      navigate("/singleAudio");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="top-bar">
        {me ? (
          <div
            className="menu neu"
            style={{ transform: "translateX(+1040%)", marginBottom: "110px" }}
          >
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="menu neu">
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/login">
                  Login
                </Link>
              </li>
              <li>
                <Link className="neu" to="/register">
                  Register
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
      <div className="top-bar">
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
      <div
        style={{ textAlign: "center", padding: "20px", marginTop: "-350px" }}
      >
        <h1 className="text">Single Audio</h1>
        <div>
          <ul key={song.id}>
            <h2 className="text">{song.name}</h2>
          </ul>
          <form onSubmit={commentInfo}>
            <label className="text">
              Create comment
              <input
                className="border"
                name="Your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
            </label>
            <button className="button">Submit your comment</button>
            {isLoading ? (
              <output className="text">Creating comment</output>
            ) : (
              <output className="text">something else</output>
            )}
            {error && (
              <output className="text">
                Error creating comment {error.message}
              </output>
            )}
          </form>
          {comments.map((comment) => (
            <ul key={comment.id}>
              <h6 className="text">{comment.userID}</h6>
              <h5 className="text">{comment.commentText}</h5>
            </ul>
          ))}
        </div>
      </div>
    </>
  );
}

//////////////////////////////////////////////////////////        R E V I E W  S H I T     ///////////////////////////////////////////////////////////////////////

// const { data: reviewData, isSuccess: finished } = useGetReviewsQuery(audioId);
// const [createReviewMutation, isLoading, error] = useCreateReviewMutation();
// const [reviews, setReviews] = useState([]);
// const [reviewText, setReviewText] = useState("");

// useEffect(() => {
//   if (finished) {
//     setReviews(reviewData);
//   }
// }, [reviewData]);

// const reviewInfo = async (e) => {
//   e.preventDefault();
//   try {
//     const response = await createReviewMutation({ itemId, reviewText });
//     navigate("/singleAudio");
//   } catch (error) {
//     console.error(error);
//   }
// };

/* <form onSubmit={reviewInfo}>
            <label className="text">
              Create review
              <input
                className="border"
                name="Your review"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </label>
            <button className="button">Submit your review</button>
            {error && (
              <output className="text">
                Error creating review {error.message}
              </output>
            )}
          </form> */

/* {reviews.map((review) => (
            <ul key={review.id}>
              <h4 className="text">{review.userID}</h4>
              <h3 className="text">{review.reviewText}</h3>
              <button
                className="button"
                onClick={() => {
                  setReviewId(review.id), navigate("/singleReview");
                }}
              >
                View review
              </button>
            </ul>
          ))} */
