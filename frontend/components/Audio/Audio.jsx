import { useGetSongsQuery } from "./AudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function Audio({ setAudioId }) {
  const { data: myData, isSuccess } = useGetSongsQuery();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  // const [items, setItems] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // useEffect(() => {
  //   fetch("https://s1w15x1qoc.execute-api.us-east-2.amazonaws.com/test/items")
  //     .then((response) => {
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch data");
  //       }
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log(data);
  //       const body = JSON.parse(data.body);
  //       setItems(body);
  //       console.log(items);
  //       setLoading(false);
  //     })
  //     .catch((error) => {
  //       setError(error.message);
  //       setLoading(false);
  //     });
  // }, []);

  // moving on to better things...
  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      console.log(myData.id);
      setSongs(myData);
      console.log(songs);
    }
  }, [myData]);

  // // Handle loading state
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // // Handle error state
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  // if (items.length != 0) {
  //   console.log(items);
  // }

  return (
    <>
      <div>
        <Link className="text" to="/audioCreator">SamplerInfinite</Link>
      </div>
      <div>
        <Link className="text" to="/granularSynth">Granular Synth</Link>
      </div>
      <div>
        <Link className="text" to="/singleUser">My Account</Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="text">Sampled Infinites</h1>
      <div>
        {songs.map((song) => (
          <ul key={song.id}>
            <h2 className="text">{song.name}</h2>
            <audio controls>
              <source
                src={`https://firstdemoby.s3.us-east-2.amazonaws.com/${song.id}`}
                type="audio/wav"
              />
              Your browser does not support the audio element
            </audio>
            <button
            className="button"
              onClick={() => {
                setAudioId(song.id);
                navigate("/singleAudio");
              }}
            >
              View
            </button>
            <h3 className="text">{song.description}</h3>
          </ul>
        ))}
      </div>
      <div></div>
      </div>
    </>
  );
}
