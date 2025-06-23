import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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

  const [selectNote, setSelectNote] = useState("");
// litrally nothin
  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  const { socket: socket1, connected: connected1 } = useWebSocket(apiUrl, {
    onOpen: () => setConnected(true),
    onMessage: (message) => {
      console.log("Raw message from socket:", message);
      try {
        if (message.sampledInfiniteId) {
          const audioName = message.sampledInfiniteId.slice(1, -1);
          setNewAudio(audioName);
          setMessages((prev) => [...prev, message.sampledInfiniteId]);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    },
    onClose: () => setConnected(false),
  });

  const handleChange = (event) => {
    setSelectNote(event.target.value);
  };

  const sendTriggerMessage = () => {
    if (socket1 && connected1) {
      const jsonMessage = JSON.stringify({
        action: "audioSend",
        body: "processor_trigger",
        user_id: defaultUser,
        note: selectNote,
      });
      socket1.send(jsonMessage);
    } else {
      console.error("Websocket is not connected. Cannot send message");
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

          <ul>
            <h2 className="text">Press Start button to begin processor</h2>
            <h2 className="text">May take up to 5 minutes</h2>
            <button
              className="button"
              onClick={() => {
                start();
              }}
            >
              Start
            </button>
            <select id="dropdown" value={selectNote} onChange={handleChange}>
              <option value="">-- Select a frequency range --</option>
              {Object.entries(noteToFreq).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
            <div>{newAudio ? sample() : null}</div>
            <div>
              {whileLoading ? (
                <output className="text">
                  Sorry. This option is unavailable. Visit
                  www.samplerinfinite.com to use this functionality
                </output>
              ) : null}
            </div>
          </ul>
        </div>
        {<Account me={me} />}
      </div>
    </>
  );
}
