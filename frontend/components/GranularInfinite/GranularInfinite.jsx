// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [sampleMap, setSampleMap] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());

//   useEffect(() => {
//     setGrainPlayers({});
//   }, []);

//   //   const loadSample = (key, file) => {
//   //     const url = URL.createObjectURL(file);
//   //     const grainPlayer = new Tone.GrainPlayer(url, {
//   //       grainSize: 0.05,
//   //       overlap: 0.1,
//   //       speed: 1,
//   //       loop: true,
//   //     }).toDestination();

//   //     // Store the grainPlayer and sample details
//   //     setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//   //     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   //   };

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert(
//         "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
//       );
//       return;
//     }

//     const url = URL.createObjectURL(file);
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05,
//       overlap: 0.1,
//       speed: 1,
//       loop: true,
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key]) {
//       const grainPlayer = grainPlayers[key];

//       // Calculate a random start position within the sample's duration
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;

//       // Start the sample from the random position
//       grainPlayer.start(randomStartPosition);
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//         setActiveKeys((prev) => new Set(prev).add(key));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//       setActiveKeys((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(key);
//         return newSet;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, sampleMap, activeKeys]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>
//         Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with
//         granular synthesis.
//       </p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard
//         activeKeys={activeKeys}
//         sampleMap={sampleMap}
//         playSample={playSample}
//       />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*",
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       style={{
//         border: "2px dashed #ccc",
//         padding: 20,
//         textAlign: "center",
//         marginBottom: 20,
//       }}
//     >
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div className="key-name">{sampleMap[key]?.name}</div>
//           <div
//             className={classNames("key", {
//               active: activeKeys.has(key),
//               assigned: sampleMap[key],
//             })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

/*



maybe note
*/

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [sampleMap, setSampleMap] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());

//   useEffect(() => {
//     setGrainPlayers({});
//   }, []);

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert("Invalid file type. Please upload a valid audio file (MP3, WAV, OGG).");
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Try to load the file into GrainPlayer and handle errors
//     try {
//       const grainPlayer = new Tone.GrainPlayer(url, {
//         grainSize: 0.05,
//         overlap: 0.1,
//         speed: 1,
//         loop: true,
//       }).toDestination();

//       // Store the grainPlayer and sample details
//       setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//       setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//     } catch (error) {
//       console.error("Error loading sample:", error);
//       alert("There was an error loading the audio sample. Please try again.");
//     }
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key]) {
//       const grainPlayer = grainPlayers[key];

//       // Calculate a random start position within the sample's duration
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;

//       // Start the sample from the random position
//       grainPlayer.start(randomStartPosition);
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//         setActiveKeys((prev) => new Set(prev).add(key));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//       setActiveKeys((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(key);
//         return newSet;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, sampleMap, activeKeys]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with granular synthesis.</p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard activeKeys={activeKeys} sampleMap={sampleMap} playSample={playSample} />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center", marginBottom: 20 }}>
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div className="key-name">{sampleMap[key]?.name}</div>
//           <div
//             className={classNames("key", { active: activeKeys.has(key), assigned: sampleMap[key] })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

//
//
//
//oh boy

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [sampleMap, setSampleMap] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());

//   useEffect(() => {
//     setGrainPlayers({});
//   }, []);

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert("Invalid file type. Please upload a valid audio file (MP3, WAV, OGG).");
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Create a new GrainPlayer for the sample
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05,   // Grain size in seconds
//       overlap: 0.1,      // Overlap between grains
//       speed: 1,          // Speed of the grain playback
//       loop: true,        // Loop the grains
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key]) {
//       const grainPlayer = grainPlayers[key];

//       // Calculate a random start position within the sample's duration
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;

//       // Calculate a random grain size (between 0.05 and 0.2 seconds for example)
//       const randomGrainSize = 0.05 + Math.random() * 0.15;

//       // Start the grain at the random position with a random grain size
//       grainPlayer.start(randomStartPosition, 0, randomGrainSize);
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//         setActiveKeys((prev) => new Set(prev).add(key));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//       setActiveKeys((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(key);
//         return newSet;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, sampleMap, activeKeys]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with granular synthesis.</p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard activeKeys={activeKeys} sampleMap={sampleMap} playSample={playSample} />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center", marginBottom: 20 }}>
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div className="key-name">{sampleMap[key]?.name}</div>
//           <div
//             className={classNames("key", { active: activeKeys.has(key), assigned: sampleMap[key] })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;
////
//
//
//
//not good

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [sampleMap, setSampleMap] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());

//   // Create a Tone.js Audio Context when the component mounts
//   useEffect(() => {
//     Tone.start().then(() => {
//       console.log("Audio context started");
//     });
//   }, []);

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert(
//         "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
//       );
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Create a new GrainPlayer for the sample
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05, // Grain size in seconds
//       overlap: 0.1, // Overlap between grains
//       speed: 1, // Speed of the grain playback
//       loop: true, // Loop the grains
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key]) {
//       const grainPlayer = grainPlayers[key];

//       // Calculate a random start position within the sample's duration
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;

//       // Calculate a random grain size (between 0.05 and 0.2 seconds for example)
//       const randomGrainSize = 0.05 + Math.random() * 0.15;

//       // Start the grain at the random position with a random grain size
//       grainPlayer.start(randomStartPosition, 0, randomGrainSize);
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//         setActiveKeys((prev) => new Set(prev).add(key));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//       setActiveKeys((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(key);
//         return newSet;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, sampleMap, activeKeys]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>
//         Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with
//         granular synthesis.
//       </p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard
//         activeKeys={activeKeys}
//         sampleMap={sampleMap}
//         playSample={playSample}
//       />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       style={{
//         border: "2px dashed #ccc",
//         padding: 20,
//         textAlign: "center",
//         marginBottom: 20,
//       }}
//     >
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div className="key-name">{sampleMap[key]?.name}</div>
//           <div
//             className={classNames("key", {
//               active: activeKeys.has(key),
//               assigned: sampleMap[key],
//             })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

//
//
//
//eh

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [sampleMap, setSampleMap] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());
//   const [audioContextStarted, setAudioContextStarted] = useState(false);

//   // Create a Tone.js Audio Context when the component mounts
//   useEffect(() => {
//     Tone.start().then(() => {
//       setAudioContextStarted(true);
//       console.log("Audio context started");
//     });
//   }, []);

//   const loadSample = (key, file) => {
//     console.log("Loading sample for key:", key, file);

//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert("Invalid file type. Please upload a valid audio file (MP3, WAV, OGG).");
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Create a new GrainPlayer for the sample
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05,   // Grain size in seconds
//       overlap: 0.1,      // Overlap between grains
//       speed: 1,          // Speed of the grain playback
//       loop: true,        // Loop the grains
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setSampleMap((prev) => ({ ...prev, [key]: { url, name: file.name } }));
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (!audioContextStarted) {
//       console.log("Audio context not started yet.");
//       return;
//     }

//     if (grainPlayers[key]) {
//       const grainPlayer = grainPlayers[key];

//       // Calculate a random start position within the sample's duration
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;

//       // Calculate a random grain size (between 0.05 and 0.2 seconds for example)
//       const randomGrainSize = 0.05 + Math.random() * 0.15;

//       console.log("Playing sample from position", randomStartPosition, "with grain size", randomGrainSize);

//       // Start the grain at the random position with a random grain size
//       grainPlayer.start(randomStartPosition, 0, randomGrainSize);
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop();
//     }
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//         setActiveKeys((prev) => new Set(prev).add(key));
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//       setActiveKeys((prev) => {
//         const newSet = new Set(prev);
//         newSet.delete(key);
//         return newSet;
//       });
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, sampleMap, activeKeys]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with granular synthesis.</p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard activeKeys={activeKeys} sampleMap={sampleMap} playSample={playSample} />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center", marginBottom: 20 }}>
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div className="key-name">{sampleMap[key]?.name}</div>
//           <div
//             className={classNames("key", { active: activeKeys.has(key), assigned: sampleMap[key] })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

//
// not good
//
//
//
// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());
//   const [grainInterval, setGrainInterval] = useState({});

//   // Initialize Tone.js Audio Context when the component mounts
//   useEffect(() => {
//     Tone.start().then(() => {
//       console.log("Audio context started");
//     });
//   }, []);

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert(
//         "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
//       );
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Create a new GrainPlayer for the sample
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05, // Grain size in seconds
//       overlap: 0.1, // Overlap between grains
//       speed: 1, // Speed of the grain playback
//       loop: true, // Loop the grains
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key] && !activeKeys.has(key)) {
//       const grainPlayer = grainPlayers[key];

//       // Start the grain player if it hasn't been started yet
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
//       grainPlayer.start(randomStartPosition);

//       // Set up a loop to continuously play grains while the key is pressed
//       const interval = setInterval(() => {
//         const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
//         const randomGrainSize = 0.05 + Math.random() * 0.15; // Random grain size between 0.05s and 0.2s
//         grainPlayer.start(randomStartPosition, 0, randomGrainSize);
//       }, 100); // Trigger new grains every 100ms

//       // Store the interval to clear it when the key is released
//       setGrainInterval((prev) => ({ ...prev, [key]: interval }));

//       setActiveKeys((prev) => new Set(prev).add(key));
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop(); // Stop the grain player
//     }
//     if (grainInterval[key]) {
//       clearInterval(grainInterval[key]); // Clear the interval to stop continuous grain playback
//       setGrainInterval((prev) => {
//         const newInterval = { ...prev };
//         delete newInterval[key]; // Remove the interval for the released key
//         return newInterval;
//       });
//     }
//     setActiveKeys((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(key);
//       return newSet;
//     });
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, activeKeys, grainInterval]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>
//         Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with
//         granular synthesis.
//       </p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard
//         activeKeys={activeKeys}
//         sampleMap={grainPlayers}
//         playSample={playSample}
//       />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       style={{
//         border: "2px dashed #ccc",
//         padding: 20,
//         textAlign: "center",
//         marginBottom: 20,
//       }}
//     >
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div
//             className={classNames("key", {
//               active: activeKeys.has(key),
//               assigned: sampleMap[key],
//             })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

// much better
//
//
//
//

// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import { useDropzone } from "react-dropzone";
// import classNames from "classnames";
// import "./Keyboard.css";

// const keyToNote = {
//   a: "C4",
//   s: "D4",
//   d: "E4",
//   f: "F4",
//   g: "G4",
//   h: "A4",
//   j: "B4",
//   k: "C5",
// };

// const SamplerApp = () => {
//   const [grainPlayers, setGrainPlayers] = useState({});
//   const [activeKeys, setActiveKeys] = useState(new Set());
//   const [grainInterval, setGrainInterval] = useState({});

//   // Initialize Tone.js Audio Context when the component mounts
//   useEffect(() => {
//     Tone.start().then(() => {
//       console.log("Audio context started");
//     });
//   }, []);

//   const loadSample = (key, file) => {
//     // Check if the file is a valid audio file
//     const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
//     if (!validExtensions.includes(file.type)) {
//       alert(
//         "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
//       );
//       return;
//     }

//     const url = URL.createObjectURL(file);

//     // Create a new GrainPlayer for the sample
//     const grainPlayer = new Tone.GrainPlayer(url, {
//       grainSize: 0.05, // Grain size in seconds
//       overlap: 0.1, // Overlap between grains
//       speed: 1, // Speed of the grain playback
//       loop: true, // Loop the grains
//     }).toDestination();

//     // Store the grainPlayer and sample details
//     setGrainPlayers((prev) => ({ ...prev, [key]: grainPlayer }));
//   };

//   const playSample = (key) => {
//     if (grainPlayers[key] && !activeKeys.has(key)) {
//       const grainPlayer = grainPlayers[key];

//       // Start the grain player if it hasn't been started yet
//       const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
//       grainPlayer.start(Tone.now() + 0.1, randomStartPosition);

//       // Set up a loop to continuously play grains while the key is pressed
//       const interval = setInterval(() => {
//         const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
//         const randomGrainSize = 0.05 + Math.random() * 0.15; // Random grain size between 0.05s and 0.2s
//         grainPlayer.start(
//           Tone.now() + 0.1,
//           randomStartPosition,
//           randomGrainSize
//         );
//       }, 100); // Trigger new grains every 100ms

//       // Store the interval to clear it when the key is released
//       setGrainInterval((prev) => ({ ...prev, [key]: interval }));

//       setActiveKeys((prev) => new Set(prev).add(key));
//     }
//   };

//   const stopSample = (key) => {
//     if (grainPlayers[key]) {
//       grainPlayers[key].stop(); // Stop the grain player
//     }
//     if (grainInterval[key]) {
//       clearInterval(grainInterval[key]); // Clear the interval to stop continuous grain playback
//       setGrainInterval((prev) => {
//         const newInterval = { ...prev };
//         delete newInterval[key]; // Remove the interval for the released key
//         return newInterval;
//       });
//     }
//     setActiveKeys((prev) => {
//       const newSet = new Set(prev);
//       newSet.delete(key);
//       return newSet;
//     });
//   };

//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       const key = event.key.toLowerCase();
//       if (key in keyToNote && !activeKeys.has(key)) {
//         playSample(key);
//       }
//     };

//     const handleKeyUp = (event) => {
//       const key = event.key.toLowerCase();
//       stopSample(key);
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     };
//   }, [grainPlayers, activeKeys, grainInterval]);

//   return (
//     <div>
//       <h2>Granular Keyboard Sampler</h2>
//       <p>
//         Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with
//         granular synthesis.
//       </p>
//       <DropZone onFileDrop={loadSample} />
//       <VisualKeyboard
//         activeKeys={activeKeys}
//         sampleMap={grainPlayers}
//         playSample={playSample}
//       />
//     </div>
//   );
// };

// const DropZone = ({ onFileDrop }) => {
//   const { getRootProps, getInputProps } = useDropzone({
//     accept: "audio/*", // Ensure it accepts audio files only
//     onDrop: (files) => {
//       const key = prompt("Press the key you want to assign this sample to:");
//       if (key) onFileDrop(key.toLowerCase(), files[0]);
//     },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       style={{
//         border: "2px dashed #ccc",
//         padding: 20,
//         textAlign: "center",
//         marginBottom: 20,
//       }}
//     >
//       <input {...getInputProps()} />
//       <p>Drag & Drop an Audio File or Click to Upload</p>
//     </div>
//   );
// };

// const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
//   return (
//     <div className="keyboard">
//       {Object.keys(keyToNote).map((key) => (
//         <div key={key} className="key-container">
//           <div
//             className={classNames("key", {
//               active: activeKeys.has(key),
//               assigned: sampleMap[key],
//             })}
//             onClick={() => playSample(key)}
//           >
//             {key.toUpperCase()}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default SamplerApp;

import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import { useDropzone } from "react-dropzone";
import classNames from "classnames";
import "./Keyboard.css";

const keyToNote = {
  a: "C4",
  s: "D4",
  d: "E4",
  f: "F4",
  g: "G4",
  h: "A4",
  j: "B4",
  k: "C5",
};

const SamplerApp = () => {
  const [grainPlayers, setGrainPlayers] = useState({});
  const [activeKeys, setActiveKeys] = useState(new Set());
  const [grainInterval, setGrainInterval] = useState({});

  // Initialize Tone.js Audio Context when the component mounts
  useEffect(() => {
    Tone.start().then(() => {
      console.log("Audio context started");
    });
  }, []);

  const loadSample = (key, file) => {
    // Check if the file is a valid audio file
    const validExtensions = ["audio/mpeg", "audio/wav", "audio/ogg"];
    if (!validExtensions.includes(file.type)) {
      alert(
        "Invalid file type. Please upload a valid audio file (MP3, WAV, OGG)."
      );
      return;
    }

    const url = URL.createObjectURL(file);

    // Create a new GrainPlayer for the sample
    const grainPlayer = new Tone.GrainPlayer(url, {
      grainSize: 0.05, // Grain size in seconds
      overlap: 0.1, // Overlap between grains
      speed: 1, // Speed of the grain playback
      loop: true, // Loop the grains
    }).toDestination();

    // Store the grainPlayer and sample details
    setGrainPlayers((prev) => ({
      ...prev,
      [key]: { player: grainPlayer, name: file.name },
    }));
  };

  const playSample = (key) => {
    if (grainPlayers[key] && !activeKeys.has(key)) {
      const grainPlayer = grainPlayers[key].player;

      // Start the grain player if it hasn't been started yet
      const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
      grainPlayer.start(Tone.now() + 0.1, randomStartPosition);

      // Set up a loop to continuously play grains while the key is pressed
      const interval = setInterval(() => {
        const randomStartPosition = Math.random() * grainPlayer.buffer.duration;
        const randomGrainSize = 0.05 + Math.random() * 0.15; // Random grain size between 0.05s and 0.2s
        grainPlayer.start(
          Tone.now() + 0.1,
          randomStartPosition,
          randomGrainSize
        );
      }, 100); // Trigger new grains every 100ms

      // Store the interval to clear it when the key is released
      setGrainInterval((prev) => ({ ...prev, [key]: interval }));

      setActiveKeys((prev) => new Set(prev).add(key));
    }
  };

  const stopSample = (key) => {
    if (grainPlayers[key]) {
      grainPlayers[key].player.stop(); // Stop the grain player
    }
    if (grainInterval[key]) {
      clearInterval(grainInterval[key]); // Clear the interval to stop continuous grain playback
      setGrainInterval((prev) => {
        const newInterval = { ...prev };
        delete newInterval[key]; // Remove the interval for the released key
        return newInterval;
      });
    }
    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(key);
      return newSet;
    });
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      if (key in keyToNote && !activeKeys.has(key)) {
        playSample(key);
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key.toLowerCase();
      stopSample(key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [grainPlayers, activeKeys, grainInterval]);

  return (
    <div>
      <h2>Granular Keyboard Sampler</h2>
      <p>
        Press <strong>A, S, D, F, G, H, J, K</strong> to play samples with
        granular synthesis.
      </p>
      <DropZone onFileDrop={loadSample} />
      <VisualKeyboard
        activeKeys={activeKeys}
        sampleMap={grainPlayers}
        playSample={playSample}
      />
    </div>
  );
};

const DropZone = ({ onFileDrop }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: "audio/*", // Ensure it accepts audio files only
    onDrop: (files) => {
      const key = prompt("Press the key you want to assign this sample to:");
      if (key) onFileDrop(key.toLowerCase(), files[0]);
    },
  });

  return (
    <div
      {...getRootProps()}
      style={{
        border: "2px dashed #ccc",
        padding: 20,
        textAlign: "center",
        marginBottom: 20,
      }}
    >
      <input {...getInputProps()} />
      <p>Drag & Drop an Audio File or Click to Upload</p>
    </div>
  );
};

const VisualKeyboard = ({ activeKeys, sampleMap, playSample }) => {
  return (
    <div className="keyboard">
      {Object.keys(keyToNote).map((key) => (
        <div key={key} className="key-container">
          <div
            className={classNames("key", {
              active: activeKeys.has(key),
              assigned: sampleMap[key],
            })}
            onClick={() => playSample(key)}
          >
            {key.toUpperCase()}
            {sampleMap[key] && (
              <div className="sample-name">{sampleMap[key].name}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SamplerApp;
