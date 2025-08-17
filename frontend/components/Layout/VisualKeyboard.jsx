import { useState } from "react";
import { KeyDropZone } from "./KeyDropZone";

// function KeyDropZone({ keyName, noteName, fileName, onFileDrop }) {
//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop: (acceptedFiles) => {
//       if (acceptedFiles.length > 0) {
//         onFileDrop(noteName, acceptedFiles[0].name);
//       }
//     },
//   });

//   return (
//     <div
//       {...getRootProps()}
//       className="key"
//       style={{
//         border: isDragActive ? "2px dashed green" : "2px solid #ccc",
//         padding: 20,
//         textAlign: "center",
//         cursor: "pointer",
//       }}
//     >
//       <input {...getInputProps()} />
//       <div>{keyName.toUpperCase()}</div>
//       {fileName && (
//         <div
//           style={{
//             marginTop: 5,
//             fontSize: "0.9em",
//             color: "#555",
//             whiteSpace: "nowrap",
//             overflow: "hidden",
//           }}
//         >
//           {fileName}
//         </div>
//       )}
//     </div>
//   );
// }

export const VisualKeyboard = ({
  keyToNote,
  files,
  handleFileDrop,

}) => {
  return (
    <div className="keyboard">
      {Object.keys(keyToNote).map((key) => (
        <KeyDropZone
          key={key}
          keyName={key}
          file={files[key]} // file for this key
          onFileDrop={(file) => handleFileDrop(key, file)} // update parent state
        />
      ))}
    </div>
  );
};
