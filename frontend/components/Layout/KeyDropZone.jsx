import { useDropzone } from "react-dropzone";

export const KeyDropZone = ({ keyName, file, onFileDrop }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0]);
      }
    },
  });

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
      <input {...getInputProps()} />
      <div>{keyName.toUpperCase()}</div>
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
