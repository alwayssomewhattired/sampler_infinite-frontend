import { Link } from "react-router-dom";
import "./../../styles/styles.css";



export default function Sidebar() {
  return (
    <div className="sidebar menu-l neu">
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
  );
}
