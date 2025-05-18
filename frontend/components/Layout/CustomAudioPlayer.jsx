import { useRef, useState, useEffect } from "react";

export default function CustomAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio) {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    }
  };

  const handleProgressClick = (e) => {
    const width = e.currentTarget.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener("ended", () => setIsPlaying(false));
    }
  }, []);

  return (
    <div className="custom-audio-player">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button className="button" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <a className="download-button" href={src} download>
          Download
        </a>
      </div>
      <div onClick={handleProgressClick} className="progress-bar">
        <div
          className="progress-bar-filled"
          style={{ width: `${progress}%` }}
        />
      </div>
      <audio ref={audioRef} onTimeUpdate={handleTimeUpdate}>
        <source src={src} type="audio/wav" />
        Your browser does not support the audio element
      </audio>
    </div>
  );
}
