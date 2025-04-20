import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGetMyReviewsQuery, useGetMyCommentsQuery } from "./SingleUserSlice";

import "./../../styles/styles.css";

export default function SingleUser({ me }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = me;

  const { data: reviewData, isSuccess: isFinished } = useGetMyReviewsQuery();

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  useEffect(() => {
    if (isFinished) {
      setReviews(reviewData);
    }
  }, [reviewData]);

  useEffect(() => {
    if (isReady) {
      setComments(commentData);
    }
  }, [commentData]);

  // const changeInfo = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await createUpdateMutation({
  //       id,
  //       email,
  //       normal_password,
  //     });
  //     navigate("/singleUser");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  // let $details;

  // if (!token) {
  //   navigate("/");
  // } else if (isReady) {
  //   $details = <p className="text">Loading User</p>;
  // } else {
  //   $details = (
  //     <>
  {
    /* <div>
          <ul key={myData.id}>
            <h4 className="text">Old Email</h4>
            <h3 className="text">{myData.email}</h3>
            <h4 className="text">Old Password</h4>
            <h3 className="text">{myData.password}</h3>
          </ul>
        </div> */
  }
  {
    /* <form onSubmit={changeInfo}>
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
        </form> */
  }
  //     </>
  //   );
  // }

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
        {/* <div>{$details}</div> */}
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
