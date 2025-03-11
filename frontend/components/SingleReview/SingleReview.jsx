import {
  useGetReviewQuery,
  useGetCommentsQuery,
  usePostCommentMutation,
} from "./SingleReviewSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SingleReview({ audioId, reviewId }) {
  console.log(audioId);
  console.log(reviewId);
  const navigate = useNavigate();

  const { data: myData, isSuccess } = useGetReviewQuery({ audioId, reviewId });
  const [review, setReview] = useState("");

  const { data: commentData, isSuccess: loaded } = useGetCommentsQuery(audioId);
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
      <h1>Review</h1>
      <ul key={review.id}>
        <h4>{review.userID}</h4>
        <h3>{review.reviewText}</h3>
      </ul>
      <form onSubmit={commentInfo}>
        <label>
          Create comment
          <input
            name="Your comment"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
        </label>
        <button>Submit your comment</button>
        {isLoading ? (
          <output>Creating comment</output>
        ) : (
          <output>something else</output>
        )}
        {error && <output>Error creating review {error.message}</output>}
      </form>
      {comments.map((comment) => (
        <ul key={comment.id}>
          <h6>{comment.userID}</h6>
          <h5>{comment.commentText}</h5>
        </ul>
      ))}
    </>
  );
}
