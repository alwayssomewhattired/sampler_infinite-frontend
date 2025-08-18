import { useDropzone } from "react-dropzone";

export const KeyDropZone = ({ keyName, file, files, onFileDrop, octave }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      console.log("acceptedFiles: ", acceptedFiles);
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles);
      }
    },
  });
  console.log("the files: ", files);
  console.log("dis da file: ", file);

  return (
    <div
      {...getRootProps()}
      className="key"
      style={{
        border: isDragActive ? "2px dashed green" : "2px solid #ccc",
        padding: 20,
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      <input
        {...getInputProps({
          webkitdirectory: "true",
        })}
      />
      <div>{keyName.slice(0, 1).toUpperCase()}</div>
      {file && (
        <div
          style={{
            marginTop: 5,
            fontSize: "0.9em",
            color: "#555",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {file.name}
        </div>
      )}
    </div>
  );
};
