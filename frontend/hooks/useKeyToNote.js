import { useMemo } from "react";

export function useKeyToNote(octave) {
  return useMemo(() => {
    return {
      ["a" + octave]: "C" + octave,
      ["w" + octave]: "C#" + octave,
      ["s" + octave]: "D" + octave,
      ["e" + octave]: "D#" + octave,
      ["d" + octave]: "E" + octave,
      ["f" + octave]: "F" + octave,
      ["t" + octave]: "F#" + octave,
      ["g" + octave]: "G" + octave,
      ["y" + octave]: "G#" + octave,
      ["h" + octave]: "A" + octave,
      ["u" + octave]: "A#" + octave,
      ["j" + octave]: "B" + octave,
      ["k" + octave]: "C" + (octave + 1),
      ["o" + octave]: "C#" + (octave + 1),
      ["l" + octave]: "D" + (octave + 1),
      ["p" + octave]: "D#" + (octave + 1),
      [";" + octave]: "E" + (octave + 1),
      ["'" + octave]: "F" + (octave + 1),
    };
  }, [octave]);
}
