import { triggerBackend, startInstance, stopInstance } from "./AudioCreatorApi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import { noteToFreq } from "../../utils/noteToFreq";
import "./../../styles/styles.css";

export default function AudioCreator({ setNewAudio, newAudio, me }) {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const [socket2, setSocket2] = useState(null);
  const [message2, setMessage2] = useState("control_change");
  const [connected2, setConnected2] = useState(false);

  const [selectNote, setSelectNote] = useState("");

  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  // // i have two websocket connections. turn both into one in the future
  // useEffect(() => {
  //   // Create WebSocket connection
  //   const socket = new WebSocket(
  //     "wss://plrgozahy9.execute-api.us-east-2.amazonaws.com/dev/"
  //   ); // Replace with your WebSocket URL

  //   // Set up WebSocket event listeners
  //   socket.onopen = () => {
  //     setConnected(true);
  //   };

  //   socket.onmessage = (event) => {
  //     // Receive and display messages from the WebSocket server
  //     const audioName = event.data.slice(1, -1);
  //     setNewAudio(audioName);
  //     setMessages((prevMessages) => [...prevMessages, event.data]);
  //   };

  //   socket.onerror = (error) => {
  //     console.error("WebSocket error:", error);
  //   };

  //   socket.onclose = () => {
  //     setConnected(false);
  //   };

  //   // Set the WebSocket object in the state
  //   setSocket(socket);

  //   // Clean up the WebSocket connection when the component unmounts
  //   return () => {
  //     socket.close();
  //   };
  // }, []); // Empty dependency array to run the effect only once (on mount)

  // Second connection
  useEffect(() => {
    // Create WebSocket connection
    const socket2 = new WebSocket(
      "wss://0wl8ctuh90.execute-api.us-east-2.amazonaws.com/production/"
    ); // Replace with your WebSocket URL

    // Set up WebSocket event listeners
    socket2.onopen = () => {
      setConnected2(true);
    };

    socket2.onmessage = (event) => {
      // Receive and display messages from the WebSocket server
      console.log(event);
    };

    socket2.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket2.onclose = () => {
      setConnected2(false);
    };

    // Set the WebSocket object in the state
    setSocket2(socket2);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket2.close();
    };
  }, []); // Empty dependency array to run the effect only once (on mount)

  const sendMessage2 = () => {
    if (socket2 && connected2) {
      const jsonMessage = JSON.stringify({
        action: "sendMessage",
        body: message2,
        note: selectNote,
      });
      socket2.send(jsonMessage); // Send message to websocket server
    } else {
      console.error("Websocket is not connected");
    }
  };

  const handleChange = (event) => {
    setSelectNote(event.target.value);
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
    }
  }, [newAudio, setWhileLoading]);

  async function start() {
    setNewAudio(null);
    setWhileLoading(true);
    await startInstance();
    triggerBackend();
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
