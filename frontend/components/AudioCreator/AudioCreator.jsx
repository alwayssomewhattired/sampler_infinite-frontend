import { triggerBackend, startInstance, stopInstance } from "./AudioCreatorApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import { noteToFreq } from "../../utils/noteToFreq";
import "./../../styles/styles.css";
import { useWebSocket } from "../../hooks/useWebSocket";

export default function AudioCreator({ setNewAudio, newAudio, me }) {
  // const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  // const [socket2, setSocket2] = useState(null);
  const [message2, setMessage2] = useState("control_change");
  // const [connected2, setConnected2] = useState(false);

  const [selectNote, setSelectNote] = useState("");

  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  const { socket: socket1, connected: connected1 } = useWebSocket(
    "wss://plrgozahy9.execute-api.us-east-2.amazonaws.com/dev/",
    {
      onOpen: () => setConnected(true),
      onMessage: (event) => {
        const audioName = event.data.slice(1, -1);
        setNewAudio(audioName);
        setMessages((prev) => [...prev, event.data]);
      },
      onClose: () => setConnected(false),
    }
  );

  const { socket: socket2, connected: connected2 } = useWebSocket(
    "wss://0wl8ctuh90.execute-api.us-east-2.amazonaws.com/production/",
    {
      onOpen: () => console.log("socket2 connected"),
      onMessage: (event) => {
        console.log("Message from socket2:", event);
      },
      onClose: () => console.log("socket2 disconnected"),
    }
  );

  const handleChange = (event) => {
    setSelectNote(event.target.value);
  };

  const sendMessage2 = () => {
    if (socket2 && connected2) {
      const jsonMessage = JSON.stringify({
        action: "sendMessage",
        body: message2,
        note: selectNote,
      });
      socket2.send(jsonMessage); // Send message to websocket server
    } else {
      console.error("Websocket is not connected. Cannot send message");
    }
  };

  // Function to display sampled infinite
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
      stopInstance();
      console.log("Instance stopped.");
    }
  }, [newAudio, setWhileLoading]);

  async function start() {
    setNewAudio(null);
    setWhileLoading(true);
    await startInstance();
    console.log("After startInstance");
    // triggerBackend();
    // console.log("After triggerBackend");
    sendMessage2();
    console.log("After sendMessage2");
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
            <button
              className="button"
              onClick={() => {
                sendMessage2();
              }}
            >
              Control Test
            </button>
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
