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
          <Link className="neu" to="/audios">
            sampledinfinite-packs
          </Link>
        </li>
        <li>
          <Link className="neu" to="/audio">
            sampledinfinites
          </Link>
        </li>
        <li>
          <Link className="neu" to="/granularInfinite">
            granularinfinite
          </Link>
        </li>
        <li>
          <Link className="neu" to="/granularInfiniteNew">
            granularinfinite-NEW
          </Link>
        </li>
        <li>
          <Link to="/aboutAuthor" className="neu">
            About The Author
          </Link>
        </li>
      </ul>
    </div>
  );
}
