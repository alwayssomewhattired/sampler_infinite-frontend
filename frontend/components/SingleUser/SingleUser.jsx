import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  useGetUserQuery,
  useUpdateMutation,
  useGetMyReviewsQuery,
  useGetMyCommentsQuery,
} from "./SingleUserSlice";

export default function SingleUser({ me }) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = me;
  console.log(me);

  const { data: myData, isLoading, isSuccess } = useGetUserQuery({ token, id });
  const [createUpdateMutation, error] = useUpdateMutation();

  const { data: reviewData, isSuccess: isFinished } = useGetMyReviewsQuery();

  const { data: commentData, isSuccess: isReady } = useGetMyCommentsQuery();

  const [reviews, setReviews] = useState([]);
  const [comments, setComments] = useState([]);
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
    }
  }, [myData]);

  useEffect(() => {
    console.log(`is this finished ${isFinished}`);
    if (isSuccess) {
      setReviews(reviewData);
      console.log(reviews);
    }
  }, [reviewData]);

  useEffect(() => {
    console.log(`is this read ${isReady}`);
    if (isReady) {
      setComments(commentData);
      console.log(commentData);
    }
  }, [commentData]);

  const changeInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createUpdateMutation({
        id,
        email,
        normal_password,
      }); //might need to '.unwrap()'
      console.log(response);
      navigate("/singleUser");
    } catch (error) {
      console.error(error);
    }
  };

  let $details;

  if (!token) {
    navigate("/");
  } else if (isLoading) {
    $details = <p>Loading User</p>;
  } else {
    $details = (
      <>
        <div>
          <ul key={myData.id}>
            <h4>Old Email</h4>
            <h3>{myData.email}</h3>
            <h4>Old Password</h4>
            <h3>{myData.password}</h3>
          </ul>
        </div>
        <form onSubmit={changeInfo}>
          <div></div>
          <label>
            New Email
            <input
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div></div>
          <label>
            New Password
            <input
              name="Password"
              value={normal_password}
              onChange={(e) => setNormal_Password(e.target.value)}
              required
            />
          </label>
          <div></div>
          <button>Register</button>
          {isLoading && <output>Creating user...</output>}
        </form>
      </>
    );
  }

  return (
    <>
      <h1>SingleUser</h1>
      <div>
        <Link to="/audio">Published Audio</Link>
      </div>
      <div>
        <Link to="/audioCreator">SamplerInfinite</Link>
      </div>
      <div>{$details}</div>
      <div>
        <h2>Reviews</h2>
      </div>
      {reviews.map((review) => (
        <ul key={review.id}>
          <h3>{review.reviewText}</h3>
        </ul>
      ))}
      <div>
        <h2>Comments</h2>
      </div>
      {comments.map((comment) => (
        <ul key={comment.id}>
          <h3>{comment.commentText}</h3>
        </ul>
      ))}
    </>
  );
}
