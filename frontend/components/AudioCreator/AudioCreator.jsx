import { triggerBackend } from "./AudioCreatorApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AudioCreator({ setNewAudio, newAudio }) {
  // const [newAudio, setNewAudio] = useState(null);
  // State for managing WebSocket connection and messages
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);
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
        <button onClick={navigate("/audioUploader")}>
          Upload to your account
        </button>
      </>
    );
  }

  return (
    <>
      <div>
        <Link to="/audio">Published Audio</Link>
      </div>
      <div>
        <Link to="/singleUser">Your Account</Link>
      </div>
      <div>
        <Link to="/granularSynth">Granular Synth</Link>
      </div>
      <div style={{ textAlign: "center", padding: "20px" }}>
        <h1>Sampler Infinite</h1>
        <button
          onClick={() => {
            triggerBackend();
            setNewAudio(null);
          }}
        >
          Start
        </button>
        <div>
          {newAudio ? (
            <a
              href={`https://firstdemoby.s3.us-east-2.amazonaws.com/${newAudio}`}
              download
            >
              Your sampled infinite!
            </a>
          ) : (
            <p>Processing...</p>
          )}
        </div>
      </div>
    </>
  );
}
