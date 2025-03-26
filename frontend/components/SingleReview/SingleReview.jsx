import {
  useGetReviewQuery,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "./SingleReviewSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function SingleReview({ audioId, reviewId }) {
  console.log(audioId);
  console.log(reviewId);
  const navigate = useNavigate();

  const { data: myData, isSuccess } = useGetReviewQuery({ audioId, reviewId });
  const [review, setReview] = useState("");

  const { data: commentData, isSuccess: loaded } =
    useGetCommentsQuery(reviewId);
  const [comments, setComments] = useState([]);

  const [createCommentMutation, isLoading, error] = usePostCommentMutation();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      setReview(myData);
      console.log(review);
    }
  }, [myData]);

  useEffect(() => {
    console.log(`is this loaded ${loaded}`);
    if (loaded) {
      console.log(commentData);
      setComments(commentData);
      console.log(comments);
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
      console.log(response.data);
      navigate("/singleReview");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div>
        <Link className="text" to="/audio">
          Published Audio
        </Link>
      </div>
      <div>
        <Link className="text" to="/singleUser">
          Your Account
        </Link>
      </div>
      <div>
        <Link className="text" to="/granularSynth">
          Granular Synth
        </Link>
      </div>
      <div>
        <Link className="text" to="/audioCreator">
          SamplerInfinite
        </Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
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
