import { Link } from "react-router-dom";
import "./../../styles/styles.css";

export default function Account({ me }) {
  return (
    <div className="account menu neu">
      <h2 className="li-header">Account</h2>
      <ul style={{ paddingInlineStart: "0em" }}>
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
  );
}
