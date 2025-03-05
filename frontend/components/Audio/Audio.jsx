import { useGetSongsQuery } from "./AudioSlice";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Audio({ setAudioId }) {
  const { data: myData, isSuccess } = useGetSongsQuery();
  const [songs, setSongs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      setSongs(myData);
      console.log(songs);
    }
  }, [myData]);

  return (
    <>
      <h1>Sampled Infinites</h1>
      <div>
        {songs.map((song) => (
          <li key={song.id}>
            <h3>{song.name}</h3>
            <button
              onClick={() => {
                setAudioId(song.id);
                navigate("/singleAudio");
              }}
            >
              View
            </button>
          </li>
        ))}
        <Link to="/audioCreator">Create Audio</Link>
      </div>
    </>
  );
}
