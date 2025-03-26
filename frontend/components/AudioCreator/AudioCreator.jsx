import { triggerBackend } from "./AudioCreatorApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./../../styles/styles.css";

export default function AudioCreator({ setNewAudio, newAudio }) {
  // const [newAudio, setNewAudio] = useState(null);
  // State for managing WebSocket connection and messages
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(
      "wss://plrgozahy9.execute-api.us-east-2.amazonaws.com/dev/"
    ); // Replace with your WebSocket URL

    // Set up WebSocket event listeners
    socket.onopen = () => {
      console.log("WebSocket connected");
      setConnected(true);
    };

    socket.onmessage = (event) => {
      // Receive and display messages from the WebSocket server
      console.log("Received message:", event.data);
      const audioName = event.data.slice(1, -1);
      setNewAudio(audioName);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      setConnected(false);
    };

    // Set the WebSocket object in the state
    setSocket(socket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array to run the effect only once (on mount)

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
    }
  }, [newAudio, setWhileLoading]);

  return (
    <>
      <div>
        <Link className="text" to="/audio">
          Published Audio
        </Link>
      </div>
      <div>
        <Link className="text" to="/granularSynth">
          Granular Synth
        </Link>
      </div>
      <div>
        <Link className="text" to="/singleUser">
          Your Account
        </Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1 className="text">Sampler Infinite</h1>
        <h2 className="text">Press Start button to begin processor</h2>
        <h2 className="text">May take up to 5 minutes</h2>
        <button
        className="button"
          onClick={() => {
            triggerBackend();
            setNewAudio(null);
            setWhileLoading(true);
          }}
        >
          Start
        </button>
        <div>{newAudio ? sample() : null}</div>
        <div>
          {whileLoading ? (
            <output className="text">Processing...</output>
          ) : null}
        </div>
      </div>
    </>
  );
}
