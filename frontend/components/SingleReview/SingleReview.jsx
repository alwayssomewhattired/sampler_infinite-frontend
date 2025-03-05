import { useGetReviewQuery } from "./SingleReviewSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SingleReview({ audioId, reviewId }) {
  console.log(audioId);
  console.log(reviewId);

  const { data: myData, isSuccess } = useGetReviewQuery({ audioId, reviewId });
  const [review, setReview] = useState("");

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      setReview(myData);
      console.log(review);
    }
  }, [myData]);

  return (
    <>
      <h1>Review</h1>
      <ul key={review.id}>
        <h4>{review.userID}</h4>
        <h3>{review.reviewText}</h3>
      </ul>
    </>
  );
}
