import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";
import { noteToFreq } from "../../utils/noteToFreq";
import "./../../styles/styles.css";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useDefaultUser } from "../../hooks/useDefaultUser";
import Select from "react-select";

const apiUrl = import.meta.env.VITE_SERVERLESS_WEBSOCKET_API;
const bucket = import.meta.env.VITE_BUCKET;

export default function AudioCreator({
  setNewAudio,
  newAudio,
  sampledinfinite,
  setSampledinfinite,
  me,
}) {
  const defaultUserHook = useDefaultUser();
  const defaultUser = me || defaultUserHook;
  const loggedIn = !defaultUser.startsWith("default");

  const [messages, setMessages] = useState([]);
  const [connected, setConnected] = useState(false);

  const [audioFile, setAudioFile] = useState([]);
  const audioFileRef = useRef(null);

  const [selectNote, setSelectNote] = useState([]);
  const [controlSource, setControlSource] = useState("");
  const [whileLoading, setWhileLoading] = useState(false);
  const navigate = useNavigate();

  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  const options = Object.entries(noteToFreq).map(([note, freq]) => ({
    value: freq,
    label: note,
  }));

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

  const PackUpload = () => {
    return (
      <>
        {sampledinfinite && loggedIn && (
          <button
            onClick={() => navigate("/audiosUploader")}
            style={{
              backgroundColor: "green",
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
            Upload as pack
          </button>
        )}
        {!loggedIn && (
          <button
            style={{
              backgroundColor: "grey",
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
            login to upload
          </button>
        )}
      </>
    );
  };

  const { socket, connected: connectedState } = useWebSocket(apiUrl, {
    onOpen: () => setConnected(true),
    onMessage: async (rawMessage) => {
      console.log("Raw message from socket:", rawMessage);
      let message;
      if (typeof rawMessage === "string") {
        try {
          message = JSON.parse(rawMessage);
          console.log("Received message parsed as JSON");
        } catch (error) {
          console.error("Failed to parse JSON:", error);
        }
      } else {
        message = rawMessage;
        console.log("Received message is already an object");
      }

      try {
        if (message.sampledInfiniteId) {
          const audioName = message.sampledInfiniteId;
          let sampleSizes = rawMessage.sample_sizes || {};
          console.log("sampleSizes: ", sampleSizes);
          console.log("audio name: ", audioName);

          let match = audioName.match(/\/(\d+)-[^/]+$/);

          console.log("frequency from sampledinfinite match: ", match[1]);
          if (match) {
            let freq = match[1];
            setSampledinfinite((prev) => ({
              ...prev,
              [audioName]: { [freq]: sampleSizes[freq] },
            }));
            console.log("sampledinfinite state: ", sampledinfinite);
          } else {
            console.error("Regex did not match frequency to audioName");
          }

          setMessages((prev) => [...prev, message.sampledInfiniteId]);
        } else if (message.source_ready) {
          const presignedUrl = message.upload_url;
          const s3Key = message.s3_key;

          await s3Upload(presignedUrl, audioFileRef.current);

          console.log("Audio Uploaded to S3!");
          console.log("s3_key: ", s3Key);

          const jsonMessage = JSON.stringify({
            action: "audioSend",
            body: "user_upload",
            s3_key: s3Key,
            user_id: defaultUser,
          });
          if (!socketRef.current || !connectedRef.current) {
            console.warn("Socket not ready");
            return;
          }
          socketRef.current.send(jsonMessage);
          console.log("user_upload sent");
        } else if (
          message.user_id_request_dev &&
          defaultUser &&
          selectNote &&
          controlSource
        ) {
          const jsonMessage = JSON.stringify({
            action: "audioSend",
            body: "user_id",
            user_id: defaultUser,
          });
          const jsonMessage2 = JSON.stringify({
            action: "audioSend",
            body: "processor_trigger",
            user_id: defaultUser,
            note: selectNote,
            source: controlSource,
          });
          if (!socketRef.current || !connectedRef.current) {
            console.warn("Socket not ready");
            return;
          }
          socketRef.current.send(jsonMessage);
          console.log("user_id sent");
          socketRef.current.send(jsonMessage2);
          console.log("processor_trigger sent");
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

  useEffect(() => {
    socketRef.current = socket;
  }, [socket]);

  useEffect(() => {
    connectedRef.current = connected;
  }, [connected]);

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions.flatMap((opt) =>
      Array.isArray(opt.value) ? opt.value : [opt.value]
    );
    setSelectNote(selectedValues);
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
    if (!socketRef.current || !connectedRef.current) {
      console.warn("Socket not ready");
      return;
    } else if (import.meta.env.VITE_STAGE == "dev") {
      console.log("Development mode. No processor trigger");
    }
    const jsonMessage = JSON.stringify({
      action: "audioSend",
      body: "processor_trigger",
      user_id: defaultUser,
      note: selectNote,
      source: controlSource,
    });
    socketRef.current.send(jsonMessage);
  };

  function Sample({ name }, navigate) {
    return (
      <>
        <div style={{ display: "flex", gap: "16px" }}>
          <button
            style={{ backgroundColor: "green" }}
            onClick={() =>
              window.open(
                `https://${bucket}.s3.us-east-2.amazonaws.com/${name}`,
                "_blank"
              )
            }
          >
            {" "}
            Download
          </button>
          {sampledinfinite && loggedIn && (
            <button
              onClick={() => navigate("/audioUploader")}
              style={{
                backgroundColor: "green",
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
              Upload as single
            </button>
          )}
          {!loggedIn && (
            <button
              style={{
                backgroundColor: "grey",
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
              login to upload
            </button>
          )}
        </div>
        ;
      </>
    );
  }
  console.log("sampledinfinite state: ", sampledinfinite);
  function SampleLoading() {
    return (
      <>
        {Object.entries(sampledinfinite).map(([audioName, audioObj]) => (
          <div key={audioName} style={{ marginBottom: "20px" }}>
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
                  <h3>
                    {typeof sampleSize === "object"
                      ? JSON.stringify(sampleSize)
                      : sampleSize ?? 0}
                    %
                  </h3>
                </div>

                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#ffffffff",
                    borderRadius: "8px",
                    overflow: "hidden",
                    height: "20px",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      width: `${
                        typeof sampleSize === "object"
                          ? JSON.stringify(sampleSize)
                          : sampleSize ?? 0
                      }%`,
                      backgroundColor: "#2da931ff",
                      height: "100%",
                      transition: "width 0.3s ease-in-out",
                    }}
                  ></div>
                </div>

                <Sample name={audioName} navigate={navigate} />
              </div>
            ))}
          </div>
        ))}
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
    if (defaultUser && selectNote && controlSource) {
      setWhileLoading(true);
      sendTriggerMessage();
    } else {
      console.error("Failure to Start");
      return;
    }
  }

  return (
    <>
      <div className="three-column-layout">
        {<Sidebar />}
        <div className="center-content">
          <div className="logo-container">
            <div className="logo">
              <h1 className="logo-text" onClick={() => navigate("/")}>
                SAMPLERINFINITE
              </h1>
            </div>
          </div>
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
          {controlSource == "user_source" && (
            <input
              style={{
                margin: "0 auto",
                marginBottom: "10px",
                width: "70%",
                color: "green",
              }}
              type="file"
              accept="audio/*"
              onChange={handleSourceUpload}
            />
          )}
          <Select
            options={options}
            isMulti
            value={options.filter((opt) => selectNote.includes(opt.value))}
            onChange={handleChange}
            placeholder="-- Select frequencies --"
            style={{
              container: (base) => ({
                ...base,
                width: "50%",
                margin: "0 auto 1em",
              }),
            }}
          />
          <button
            style={{
              width: "10%",
              margin: "0 auto",
              marginBottom: "1em",
              marginTop: "2%",
            }}
            className="button"
            onClick={() => {
              start();
            }}
          >
            Start
          </button>
          <div>
            {whileLoading ? (
              <output className="text">Processing...</output>
            ) : null}
          </div>
          {<PackUpload />}
          {<SampleLoading />}
        </div>
        {<Account me={me} />}
      </div>
    </>
  );
}
