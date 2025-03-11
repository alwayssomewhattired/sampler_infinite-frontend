import { triggerBackend } from "./AudioCreatorApi";
import { Link } from "react-router-dom";

export default function AudioCreator() {
  return (
    <>
      <button onClick={triggerBackend}>Start</button>
      <div>
      <Link to="/audio">Published Audio</Link>
      </div>
      <div>
      <Link to="/singleUser">Your Account</Link>
      </div>
    </>
  );
}
