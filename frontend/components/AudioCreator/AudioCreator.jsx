///////////////////////////////////   TO-DO ////////////////////////////////////
// send note chosen from dropdown to c++ for change.
// turn fft bin into their corresponding note value
/*
octave 0
bin 3 = c to f
bin 4 = f to g#
bin 5 = a to octave1 c
octave 1
bin 6 = c to d
bin 7 = d to f
bin 8 = f to g
bin 9 = g to g#
bin 10 = g# to a#
bin 11 = a# to octave2 c
octave 2
bin 12 = c to c#
bin 13 = c# to d
bin 14 = d to e
bin 15 = e to f
bin 16 = f to f#
bin 17 = f# to g
bin 18 = g to g#
bin 19 = g # to g#
bin 20 = a to a
bin 21 = a # to a#
bin 22 = a# to b
bin 23 = b to octave3 c
octave 3
bin 24 = c to c
bin 25 = c# to c#
bin 26 = c# to d
bin 27 = d to d
bin 28 = d# to d#
*/

import { triggerBackend, startInstance, stopInstance } from "./AudioCreatorApi";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import "./../../styles/styles.css";

export default function AudioCreator({ setNewAudio, newAudio }) {
  // const [newAudio, setNewAudio] = useState(null);
  // State for managing WebSocket connection and messages
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const [socket2, setSocket2] = useState(null);
  const [message2, setMessage2] = useState("control_change");
  const [connected2, setConnected2] = useState(false);

  const [selectNote, setSelectNote] = useState("");

  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  const octave0 = [3, 4, 5];
  const octave1 = [6, 7, 8, 9, 10, 11];
  const octave2 = [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  const frequencies = {
    "5.3833hz to 10.7665hz": 1,
    "10.7666hz to 16.1498": 2,
    "16.1499hz to 21.5331hz": 3,
    "21.5332hz to 26.9164hz": 4,
    "26.9165hz to 32.2997hz": 5,
    "32.2998hz to 37.6830hz": 6,
    "37.6831hz to 43.0663hz": 7,
    "43.0664hz to 48.4496hz": 8,
    "48.4497hz to 53.832hz": 9,
    "53.833hz to 59.2162hz": 10,
    "59.2163hz to 64.5995hz": 11,
    "64.5996hz to 69.9828hz": 12,
    "69.9829hz to 75.3661hz": 13,
    "75.3662hz to 80.7494hz": 14,
    "80.7495hz to 86.1327hz": 15,
    "86.1328hz to 91.5160hz": 16,
    "91.5161hz to 96.8993hz": 17,
    "96.8994hz to 102.282hz": 18,
    "102.283hz to 107.665hz": 19,
    "107.666hz to 113.048hz": 20,
    "113.049hz to 118.432hz": 21,
    "118.433hz to 123.815hz": 22,
    "123.816hz to 129.198hz": 23,
    "129.199hz to 134.582hz": 24,
    "134.583hz to 139.965hz": 25,
    "139.966hz to 145.348hz": 26,
    "145.349hz to 150.731hz": 27,
    "150.732hz to 156.115hz": 28,
    "156.116hz to 161.498hz": 29,
    "161.499hz to 166.881hz": 30,
    "166.882hz to 172.265hz": 31,
    "172.266hz to 177.648hz": 32,
    "177.649hz to 183.031hz": 33,
    "183.032hz to 188.415hz": 34,
    "188.416hz to 193.798hz": 35,
    "193.799hz to 199.181hz": 36,
    "199.182hz to 204.564hz": 37,
    "204.565hz to 209.948": 38,
    "209.949hz to 215.331": 39,
    "215.332hz to 220.714hz": 40,
    "220.715hz to 226.098hz": 41,
    "226.099hz to 231.481hz": 42,
    "231.482hz to 236.864hz": 43,
    "236.865hz to 242.248hz": 44,
    "242.249hz to 247.631hz": 45,
    "247.632hz to 253.014hz": 46,
    "253.015hz to 258.397hz": 47,
    "258.398hz to 263.781": 48,
    "263.782hz to 269.164hz": 49,
    "269.165hz to 274.548hz": 50,
  };

  // i have two websocket connections. turn both into one in the future
  useEffect(() => {
    // Create WebSocket connection
    const socket = new WebSocket(
      "wss://plrgozahy9.execute-api.us-east-2.amazonaws.com/dev/"
    ); // Replace with your WebSocket URL

    // Set up WebSocket event listeners
    socket.onopen = () => {
      setConnected(true);
    };

    socket.onmessage = (event) => {
      // Receive and display messages from the WebSocket server
      const audioName = event.data.slice(1, -1);
      setNewAudio(audioName);
      setMessages((prevMessages) => [...prevMessages, event.data]);
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      setConnected(false);
    };

    // Set the WebSocket object in the state
    setSocket(socket);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []); // Empty dependency array to run the effect only once (on mount)

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
            start();
          }}
        >
          Start
        </button>
        <select id="dropdown" value={selectNote} onChange={handleChange}>
          <option value="">-- Select a frequency range --</option>
          {Object.entries(frequencies).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
          {/* <option value="">A</option>
          <option value="C">C</option> */}
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
              Sorry. This option is unavailable. Visit www.samplerinfinite.com
              to use this functionality
            </output>
          ) : null}
        </div>
      </div>
    </>
  );
}
