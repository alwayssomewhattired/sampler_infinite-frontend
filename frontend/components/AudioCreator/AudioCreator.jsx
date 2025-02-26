import { triggerBackend } from "./AudioCreatorApi";

export default function AudioCreator() {
  return (
    <>
      <button onClick={triggerBackend}>Start</button>
    </>
  );
}
