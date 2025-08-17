import { usePostAudiosMutation } from "./AudiosUploaderSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AudiosUploader({ newAudio, sampledinfinite, me }) {
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [createAudiosMutation] = usePostAudiosMutation();
  const [chosenAudio, setChosenAudio] = useState([]);

  const id = newAudio;
  const user = me;
  const navigate = useNavigate();

  // to-do  figure out if i can send arguments of different names as long as they're in order
  const uploadInfo = async (e) => {
    e.preventDefault();
    try {
      if (chosenAudio.length > 1) {
        const response = await createAudiosMutation({
          user,
          chosenAudio,
          name,
          description,
        });
      } else {
        console.error("Need at least 2 sampledinfinites");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // async function uploadTrigger() {
  //   await tagStripper(newAudio);
  //   navigate("/audio");
  // }

  const handleToggle = (audioName) => {
    console.log("chosenAudio: ", chosenAudio);
    console.log(sampledinfinite);
    // const keys = Object.keys(sampledinfinite.audioName)
    setChosenAudio((prev) =>
      prev.includes(audioName)
        ? prev.filter((name) => name !== audioName)
        : [...prev, audioName]
    );
  };

  return (
    <>
      <form onSubmit={uploadInfo}>
        <label className="text">
          Pack name
          <input
            name="Name for file"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="text">
          Description
          <input
            name="Audio description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            // uploadTrigger();
            navigate("/audio");
          }}
        >
          Upload your sampled infinite
        </button>
        {/* {error && <output>Error uploading {error.message}</output>} */}
      </form>
      {Object.entries(sampledinfinite).map(([audioName, audioObj]) => (
        <div key={audioName} style={{ marginBottom: "20px" }}>
          {console.log("audioName: ", audioName)}
          {Object.entries(audioObj).map(([freq, sampleSize]) => (
            <div key={freq}>
              <div
                style={{
                  marginBottom: "4px",
                  fontWeight: "bold",
                  color: "hsl(116, 100%, 50%)",
                  display: "flex",
                  gap: "16px",
                  justifyContent: "center",
                }}
              >
                <h3>sampledinfinite | </h3>
                <h3>{freq + "hz"} | </h3>
                <button
                  onClick={() => handleToggle(audioName)}
                  style={{
                    backgroundColor: chosenAudio.includes(audioName)
                      ? "green"
                      : "grey",
                    color: "white",
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                >
                  {chosenAudio.includes(audioName) ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
