import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// import "./../../styles/styles.css";
import "./HomeStyle.css";

export default function Home({ me }) {
  return (
    <>
      <div className="logo">
        <h1 className="text">SAMPLERINFINITE</h1>
      </div>
      <div className="home-three-column-layout">
        {/* Left: Menu */}
        <div className="home-sidebar menu-l neu">
          <h2 className="li-header">Menu</h2>
          <ul>
            <li>
              <Link className="neu" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audioCreator">
                samplerinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/audio">
                Published Audio
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularInfinite">
                granularinfinite
              </Link>
            </li>
            <li>
              <Link className="neu" to="/granularSynth">
                Granular Synth
              </Link>
            </li>
          </ul>
        </div>

        <div className="home-center-content">
          <main>
            <ul>
              <li>
                <h3 className="text">A frequency-based sample generator</h3>
              </li>
              <li>
                <Link to="/audioCreator" className="neu card">
                  sampler infinite
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
                  Published Audio
                </Link>
              </li>
              <li>
                <h3 className="text">A standalone granular synth</h3>
              </li>
              <li>
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
        {/* Right: Account */}
        <div className="home-sidebar menu neu">
          <h2 className="li-header">Account</h2>
          <ul>
            {me ? (
              <li>
                <Link className="neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            ) : (
              <>
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
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}
