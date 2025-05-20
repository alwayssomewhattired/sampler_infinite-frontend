import { Link } from "react-router-dom";
import Account from "../Layout/Account";
import Sidebar from "../Layout/Sidebar";

import "./../../styles/styles.css";
// import "./HomeStyle.css";

export default function Home({ me }) {
  return (
    <>
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text">SAMPLERINFINITE</h1>
        </div>
      </div>
      <div className="three-column-layout">
        {<Sidebar me={me} />}

        <div className="center-content">
          <main>
            <ul>
              <div className="center">
                <h3 className="text">A frequency-based sample generator</h3>
              </div>
              <li style={{ marginRight: "2em" }}>
                <Link to="/audioCreator" className="neu card">
                  sampler infinite
                </Link>
              </li>
              <div className="center">
                <h3 className="text">
                  A granular keyboard with multi-sample processing
                </h3>
              </div>
              <li style={{ marginRight: "2em" }}>
                <Link to="/granularInfinite" className="neu card">
                  granularinfinite
                </Link>
              </li>
              <div className="center">
                <h3 className="text">
                  Browse published audio from samplerinfinite
                </h3>
              </div>
              <li style={{ marginRight: "2em" }}>
                <Link to="/audio" className="neu card">
                  Published Audio
                </Link>
              </li>
              <div className="center">
                <h3 className="text">A standalone granular synth</h3>
              </div>
              <li style={{ marginRight: "2em" }}>
                <Link to="/granularSynth" className="neu card">
                  Granular Synth
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
        {<Account me={me} />}
      </div>
    </>
  );
}
