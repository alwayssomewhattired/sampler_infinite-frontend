import { triggerBackend } from "./AudioCreatorApi";
import { Link } from "react-router-dom";

export default function AudioCreator() {
  return (
    <>
      <button onClick={triggerBackend}>Start</button>
      <Link to="/audio">Published Audio</Link>
    </>
  );
}
