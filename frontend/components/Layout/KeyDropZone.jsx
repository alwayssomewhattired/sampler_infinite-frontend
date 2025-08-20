import { useDropzone } from "react-dropzone";

export const KeyDropZone = ({
  keyName,
  file,
  files,
  onFileDrop,
  octave,
  fileName,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles);
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
          {fileName}
        </div>
      )}
    </div>
  );
};
