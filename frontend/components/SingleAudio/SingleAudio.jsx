import { useGetSingleAudioQuery, useGetReviewsQuery } from "./SingleAudioSlice";
import { useState, useEffect } from "react";

export default function SingleItem({ audioId }) {
  const { data: myData, isSuccess } = useGetSingleAudioQuery(audioId);
  const { data: reviewData, isSuccess: finished } = useGetReviewsQuery(audioId);
  const [song, setSong] = useState("");
  const [reviews, setReviews] = useState([]);

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
  }, [myData]);

  return (
    <>
      <h1>File</h1>
      <div>
        <li key={song.id}>
          <h3>{song.name}</h3>
        </li>
      </div>
    </>
  );
}
