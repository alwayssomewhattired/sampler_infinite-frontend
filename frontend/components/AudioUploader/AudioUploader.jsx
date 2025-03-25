import { usePostAudioMutation } from "./AudioUploaderSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AudioUploader({ newAudio, me }) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [createAudioMutation, isSuccess, error] = usePostAudioMutation();

  const id = newAudio;
  const user = me;

  const navigate = useNavigate();

  const uploadInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createAudioMutation({
        id,
        user,
        name,
        description,
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <form onSubmit={uploadInfo}>
        <label>
          Title
          <input
            name="Name for file"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description
          <input
            name="Describe the flavor"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button onClick={() => navigate("/audio")}>
          Upload your sampled infinite
        </button>
        {error && <output>Error uploading {error.message}</output>}
      </form>
    </>
  );
}
