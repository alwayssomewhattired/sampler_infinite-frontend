import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import "./../../styles/styles.css";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <div className="top-bar">
        <div className="menu neu">
          <h2 className="li-header">Menu</h2>
          <ul>
            <li>
              <Link className="neu" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="neu" to="/register">
                Register
              </Link>
            </li>
          </ul>
        </div>
        <div className="logo">
          <h1>SAMPLERINFINITE</h1>
        </div>
      </div>

      <div className="dashboard">
        <main>
          <ul>
            <li>
              <h3 className="text-centered">
                A frequency-based sample generator
              </h3>
            </li>
            <li>
              <Link to="/audioCreator" className="neu card">
                samplerinfinite
              </Link>
            </li>
            <li>
              <h3 className="text">
                A granular keyboard with multi-sample processing
              </h3>
            </li>
            <li>
              <Link to="/granularInfinite" className="neu card">
                granularinfinite
              </Link>
            </li>
            <li>
              <h3 className="text">
                Browse published audio from samplerinfinite
              </h3>
            </li>
            <li>
              <Link to="/audio" className="neu card">
                published audio
              </Link>
            </li>
            <li>
              <h3 className="text">A standalone granular synth</h3>
            </li>
            <li>
              <Link to="/granularSynth" className="neu card">
                granular synth
              </Link>
            </li>
          </ul>

          <div className="neu main">
            <h2>Recent Activity</h2>
            <p>Some recent actions, events, or updates.</p>
            <p>Coming Soon...</p>
          </div>
        </main>
      </div>
    </>
  );
}
