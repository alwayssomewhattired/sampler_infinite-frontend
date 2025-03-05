import {
  useGetSingleAudioQuery,
  useGetReviewsQuery,
  useGetCommentsQuery,
  useCreateReviewMutation,
} from "./SingleAudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SingleItem({ audioId, setReviewId }) {
  const { data: myData, isSuccess } = useGetSingleAudioQuery(audioId);
  const { data: reviewData, isSuccess: finished } = useGetReviewsQuery(audioId);
  const [createReviewMutation, isLoading, error] = useCreateReviewMutation();
  const { data: commentData, isSuccess: loaded } = useGetCommentsQuery(audioId);
  const [song, setSong] = useState("");
  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const itemId = audioId;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      setSong(myData);
      console.log(song);
    }
  }, [myData]);

  useEffect(() => {
    console.log(`is this finished ${finished}`);
    if (finished) {
      console.log(reviewData);
      setReviews(reviewData);
      console.log(song);
    }
  }, [reviewData]);

  useEffect(() => {
    console.log(`is this loaded ${loaded}`);
    if (loaded) {
      console.log(commentData);
      setComments(commentData);
      console.log(comments);
    }
  }, [commentData]);

  const reviewInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createReviewMutation({ itemId, reviewText });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <>
      <h1>File</h1>
      <div>
        <ul key={song.id}>
          <h2>{song.name}</h2>
        </ul>
        <form onSubmit={reviewInfo}>
          <label>
            Create review
            <input
              name="Your review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </label>
          <button>Submit your review</button>
          {error && <output>Error creating review {error.message}</output>}
        </form>
        {reviews.map((review) => (
          <ul key={review.id}>
            <h4>{review.userID}</h4>
            <h3>{review.reviewText}</h3>
            <button
              onClick={() => {
                setReviewId(review.id), navigate("/singleReview");;
              }}
            >
              View review
            </button>
          </ul>
        ))}
        {comments.map((comment) => (
          <ul key={comment.id}>
            <h6>{comment.commentID}</h6>
            <h5>{comment.commentText}</h5>
          </ul>
        ))}
      </div>
    </>
  );
}
