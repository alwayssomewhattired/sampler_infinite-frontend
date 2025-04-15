import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetUserQuery,
  useUpdateMutation,
  useGetMyReviewsQuery,
  useGetMyCommentsQuery,
} from "./SingleUserSlice";

import "./../../styles/styles.css";

export default function SingleUser({ me }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = me;

  const { data: myData, isLoading, isSuccess } = useGetUserQuery({ token, id });
  const [createUpdateMutation, error] = useUpdateMutation();

  const { data: reviewData, isSuccess: isFinished } = useGetMyReviewsQuery();

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  useEffect(() => {
    if (isSuccess) {
      setReviews(reviewData);
    }
  }, [reviewData]);

  useEffect(() => {
    if (isReady) {
      setComments(commentData);
    }
  }, [commentData]);

  const changeInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createUpdateMutation({
        id,
        email,
        normal_password,
      });
      navigate("/singleUser");
    } catch (error) {
      console.error(error);
    }
  };

  let $details;

  if (!token) {
    navigate("/");
  } else if (isLoading) {
    $details = <p className="text">Loading User</p>;
  } else {
    $details = (
      <>
        <div>
          <ul key={myData.id}>
            <h4 className="text">Old Email</h4>
            <h3 className="text">{myData.email}</h3>
            <h4 className="text">Old Password</h4>
            <h3 className="text">{myData.password}</h3>
          </ul>
        </div>
        <form onSubmit={changeInfo}>
          <div></div>
          <label className="text">
            New Email
            <input
              className="border"
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div></div>
          <label className="text">
            New Password
            <input
              className="border"
              name="Password"
              value={normal_password}
              onChange={(e) => setNormal_Password(e.target.value)}
              required
            />
          </label>
          <div></div>
          <button className="button">Register</button>
          {isLoading && <output className="text">Creating user...</output>}
        </form>
      </>
    );
  }

  return (
    <>
      <div>
        <Link className="text" to="/">
          Home
        </Link>
      </div>
      <div>
        <Link className="text" to="/audioCreator">
          samplerinfinite
        </Link>
      </div>
      <div>
        <Link className="text" to="/audio">
          Published Audio
        </Link>
      </div>
      <div>
        <Link className="text" to="/granularSynth">
          Granular Synth
        </Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 className="text">Your Account</h1>
        <div>{$details}</div>
        <div>
          <h2 className="text">Reviews</h2>
        </div>
        {reviews.map((review) => (
          <ul key={review.id}>
            <h3 className="text">{review.reviewText}</h3>
          </ul>
        ))}
        <div>
          <h2 className="text">Comments</h2>
        </div>
        {comments.map((comment) => (
          <ul key={comment.id}>
            <h3 className="text">{comment.commentText}</h3>
          </ul>
        ))}
      </div>
    </>
  );
}
