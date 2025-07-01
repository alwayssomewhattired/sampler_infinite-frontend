import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import { noteToFreq } from "../../utils/noteToFreq";
import "./../../styles/styles.css";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useDefaultUser } from "../../hooks/useDefaultUser";

const apiUrl = import.meta.env.VITE_SERVERLESS_WEBSOCKET_API;

export default function AudioCreator({ setNewAudio, newAudio, me }) {
  const defaultUser = useDefaultUser();

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const [audioFile, setAudioFile] = useState(null);
  const audioFileRef = useRef(null);

  const [selectNote, setSelectNote] = useState("");
  const [controlSource, setControlSource] = useState("");
  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  const s3Upload = async (presignedUrl, audioBlob) => {
    try {
      const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": "audio/mp3" },
        body: audioBlob,
      });

      const text = await response.text();
      console.log("Upload response: ", response.status, text);

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);
    } catch (error) {
      console.error("Failed to send user audio: ", error);
    }
  };

  const { socket: socket1, connected: connected1 } = useWebSocket(apiUrl, {
    onOpen: () => setConnected(true),
    onMessage: (message) => {
      console.log("Raw message from socket:", message);
      try {
        if (message.sampledInfiniteId) {
          const audioName = message.sampledInfiniteId.slice(1, -1);
          setNewAudio(audioName);
          setMessages((prev) => [...prev, message.sampledInfiniteId]);
        } else if (message.source_ready) {
          const presignedUrl = message.upload_url;
          const s3Key = message.s3_key;

          s3Upload(presignedUrl, audioFileRef.current);

          console.log("Audio Uploaded to S3!");
          console.log("s3_key: ", s3Key);
          console.log("user_id: ", defaultUser);

          const jsonMessage = JSON.stringify({
            action: "audioSend",
            body: "user_upload",
            s3_key: s3Key,
            user_id: defaultUser,
          });
          if (socket1 && connected1) {
            socket1.send(jsonMessage);
          } else {
            console.warn("WebSocket not ready to send message");
          }
        }
      } catch (error) {
        console.error(
          "Failed to parse WebSocket message or upload audio:",
          error
        );
      }
    },
    onClose: () => setConnected(false),
  });

  const handleChange = (event) => {
    setSelectNote(event.target.value);
  };

  const handleControlSource = (event) => {
    setControlSource(event.target.value);
    console.log("event", event.target.value);
  };

  const handleSourceUpload = async (e) => {
    const file = e.target.files[0];
    console.log("File: ", file);
    if (file) {
      setAudioFile(file);
      audioFileRef.current = file;
      console.log("Audio File Received!");
    } else {
      console.log("No audio file found from user upload.");
    }
  };

  const sendTriggerMessage = () => {
    if (socket1 && connected1) {
      const jsonMessage = JSON.stringify({
        action: "audioSend",
        body: "processor_trigger",
        user_id: defaultUser,
        note: selectNote,
        source: controlSource,
      });
      socket1.send(jsonMessage);
    } else {
      console.error(
        "Websocket is not connected. Cannot send message. Audio Processing has stopped."
      );
    }
  };

  function sample() {
    return (
      <>
        <a
          href={`https://firstdemoby.s3.us-east-2.amazonaws.com/${newAudio}`}
          download
        >
          Your sampled infinite!
        </a>
        <button onClick={() => navigate("/audioUploader")}>
          Upload to your account
        </button>
      </>
    );
  }

  useEffect(() => {
    if (newAudio) {
      setWhileLoading(false);
      console.log("Instance stopped.");
    }
  }, [newAudio, setWhileLoading]);

  async function start() {
    setNewAudio(null);
    setWhileLoading(true);
    sendTriggerMessage();
  }

  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
      <div className="three-column-layout">
        {<Sidebar />}
        <div className="center-content">
          <h1 className="page-header">Sampler Infinite</h1>

          <h2 className="text">Press Start button to begin processor</h2>
          <h2 className="text">May take up to 5 minutes</h2>
          <h2 className="text">Only mp3 uploads at this time</h2>
          <select
            id="dropdown"
            value={controlSource}
            onChange={handleControlSource}
            style={{ width: "50%", margin: "0 auto", marginBottom: "1em" }}
          >
            <option value="">-- Select a source --</option>
            <option value="user_source">Upload</option>
            <option value="random_source">Random</option>
          </select>
          <input type="file" accept="audio/*" onChange={handleSourceUpload} />
          <select
            id="dropdown"
            value={selectNote}
            onChange={handleChange}
            style={{ width: "50%", margin: "0 auto", marginBottom: "1em" }}
          >
            <option value="">-- Select a frequency range --</option>
            {Object.entries(noteToFreq).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
          <button
            style={{ width: "10%", margin: "0 auto", marginBottom: "1em" }}
            className="button"
            onClick={() => {
              start();
            }}
          >
            Start
          </button>
          <div>{newAudio ? sample() : null}</div>
          <div>
            {whileLoading ? (
              <output className="text">
                Sorry. This option is unavailable. Visit www.samplerinfinite.com
                to use this functionality
              </output>
            ) : null}
          </div>
        </div>
        {<Account me={me} />}
      </div>
    </>
  );
}
