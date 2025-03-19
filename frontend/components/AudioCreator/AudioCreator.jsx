import { triggerBackend } from "./AudioCreatorApi";
import { triggerUUID } from "./AudioUUIDApi";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AudioCreator() {
  const [newAudio, setNewAudio] = useState(null);
  // State for managing WebSocket connection and messages
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

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

  return (
    <>
      <button onClick={triggerBackend}>Start</button>
      <button onClick={triggerUUID}>UUID</button>
      <div>
        <Link to="/audio">Published Audio</Link>
      </div>
      <div>
        <Link to="/singleUser">Your Account</Link>
      </div>
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
    </>
  );
}
