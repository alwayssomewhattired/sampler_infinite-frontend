import { useState } from "react";
import { KeyDropZone } from "./KeyDropZone";
import { keyToNoteUtils } from "../../utils/keyToNoteUtils";

export const VisualKeyboard = ({
  keyToNote,
  files,
  handleFileDrop,
  octave,
  fileName
}) => {
  return (
    <div className="keyboard">
      {Object.keys(keyToNote).map((key) => (
        <KeyDropZone
          key={key}
          keyName={key}
          file={files[key]} // file for this key
          files={files}
          onFileDrop={(file) => handleFileDrop(key, file)} // update parent state
          octave={octave}
          fileName={fileName}
        />
      ))}
    </div>
  );
};
