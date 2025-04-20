import {
  useGetReviewQuery,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "./SingleReviewSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function SingleReview({ audioId, reviewId, me }) {
  const navigate = useNavigate();

  const { data: myData, isSuccess } = useGetReviewQuery({ audioId, reviewId });
  const [review, setReview] = useState("");

  const { data: commentData, isSuccess: loaded } =
    useGetCommentsQuery(reviewId);
  const [comments, setComments] = useState([]);

  const [createCommentMutation, isLoading, error] = usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setReview(myData);
    }
  }, [myData]);

  useEffect(() => {
    console.log(`is this loaded ${loaded}`);
    if (loaded) {
      setComments(commentData);
    }
  }, [commentData]);

  const commentInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createCommentMutation({
        audioId,
        reviewId,
        commentText,
      });
      navigate("/singleReview");
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
        <h1 className="text">Review</h1>
        <ul key={review.id}>
          <h4 className="text">{review.userID}</h4>
          <h3 className="text">{review.reviewText}</h3>
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
              Error creating review {error.message}
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
    </>
  );
}

//shhh
/*
<>
<div>
  <Link to="/audio">Published Audio</Link>
</div>
<div>
  <Link to="/audioCreator">Sampler Infinite</Link>
</div>
<div>
  <Link to="/singleUser">Your Account</Link>
</div>
*/
