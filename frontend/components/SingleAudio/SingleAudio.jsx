import {
  useGetSingleAudioQuery,
  useGetReviewsQuery,
  useCreateReviewMutation,
} from "./SingleAudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function SingleItem({ audioId, setReviewId }) {
  const { data: myData, isSuccess } = useGetSingleAudioQuery(audioId);
  const { data: reviewData, isSuccess: finished } = useGetReviewsQuery(audioId);
  const [createReviewMutation, isLoading, error] = useCreateReviewMutation();
  const [song, setSong] = useState("");
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const itemId = audioId;
  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      setSong(myData);
    }
  }, [myData]);

  useEffect(() => {
    if (finished) {
      setReviews(reviewData);
    }
  }, [reviewData]);

  const reviewInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createReviewMutation({ itemId, reviewText });
      navigate("/singleAudio");
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
        <Link className="text" to="/audioCreator">
          SamplerInfinite
        </Link>
      </div>
      <div>
        <Link className="text" to="/granularSynth">
          Granular Synth
        </Link>
      </div>
      <div>
        <Link className="text" to="/singleUser">
          Your Account
        </Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 className="text">Single Audio</h1>
        <div>
          <ul key={song.id}>
            <h2 className="text">{song.name}</h2>
          </ul>
          <form onSubmit={reviewInfo}>
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
          </form>
          {reviews.map((review) => (
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
          ))}
        </div>
      </div>
    </>
  );
}
