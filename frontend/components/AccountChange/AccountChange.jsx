import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  useGetUserQuery,
  useUpdateEmailMutation,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
} from "./AccountChangeSlice";

let emailSuccess = false;
let usernameSuccess = false;
let passwordSuccess = false;

export default function AccountChange({ me }) {
  const token = sessionStorage.getItem("token");

  const navigate = useNavigate();

  const [cred, setCred] = useState([]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  const id = me;

  const [changeEmail, setChangeEmail] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { data: myData, isLoading, isSuccess } = useGetUserQuery({ token, id });
  const [createUpdateEmailMutation] = useUpdateEmailMutation();
  const [createUpdateUsernameMutation] = useUpdateUsernameMutation();
  const [createUpdatePasswordMutation] = useUpdatePasswordMutation();

  useEffect(() => {
    if (isSuccess) {
      setCred(myData);
    }
  }, [isSuccess]);

  const changeEmailInfo = async (emailEvent) => {
    emailEvent.preventDefault();

    try {
      const response = await createUpdateEmailMutation({
        id,
        email,
      });
      if (response) emailSuccess = true;
    } catch (error) {
      console.error(error);
    }
  };

  const changeUsernameInfo = async (usernameEvent) => {
    usernameEvent.preventDefault();

    try {
      const response = await createUpdateUsernameMutation({
        id,
        username,
      });
      if (response) usernameSuccess = true;
    } catch (error) {
      console.error(error);
    }
  };

  const changePasswordInfo = async (passwordEvent) => {
    passwordEvent.preventDefault();

    try {
      const response = await createUpdatePasswordMutation({
        id,
        normal_password,
      });
      if (response) passwordSuccess = true;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="top-bar">
        {me ? (
          <div
            className="menu neu"
            style={{ transform: "translateX(+1040%)", marginBottom: "110px" }}
          >
            <h2 className="li-header">Account</h2>
            <ul>
              <li>
                <Link className="neu" to="/singleUser">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="menu neu">
            <h2 className="li-header">Account</h2>
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
        )}
      </div>
      <div className="top-bar">
        <div className="menu-l neu">
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
      </div>
      <div style={{ textAlign: "center", marginTop: "-300px" }}>
        {myData && (
          <>
            <h3 className="text">Email</h3>
            <h3 className="text">{myData.email}</h3>
            {!changeEmail ? (
              <button className="button" onClick={() => setChangeEmail(true)}>
                Change Email
              </button>
            ) : (
              <>
                <form onSubmit={changeEmailInfo}>
                  <div></div>
                  <label className="text">
                    New Email
                    <input
                      className="border"
                      name="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </label>
                  <button className="button">Submit</button>
                </form>
                {emailSuccess && (
                  <h2 className="text">Email Changed Successfully</h2>
                )}
              </>
            )}
            <h3 className="text">Username</h3>
            <h3 className="text">{myData.username}</h3>
            {!changeUsername ? (
              <button
                className="button"
                onClick={() => setChangeUsername(true)}
              >
                Change Username
              </button>
            ) : (
              <>
                <form onSubmit={changeUsernameInfo}>
                  <div></div>
                  <label className="text">
                    New Username
                    <input
                      className="border"
                      name="Username"
                      value={username}
                      onChange={(usernameEvent) =>
                        setUsername(usernameEvent.target.value)
                      }
                      required
                    />
                  </label>
                  <button className="button">Submit</button>
                </form>
                {usernameSuccess && (
                  <h2 className="text">Username Changed Successfully</h2>
                )}
              </>
            )}
            <div style={{ padding: "20px" }}>
              {!changePassword ? (
                <button
                  className="button"
                  onClick={() => setChangePassword(true)}
                >
                  Change Password
                </button>
              ) : (
                <>
                  <form onSubmit={changePasswordInfo}>
                    <div></div>
                    <label className="text">
                      New Password
                      <input
                        className="border"
                        name="Password"
                        value={normal_password}
                        onChange={(e) => setNormal_Password(e.target.value)}
                        required
                      />
                    </label>
                    <div>
                      <button className="button">Submit</button>
                    </div>
                  </form>
                  {passwordSuccess && (
                    <h2 className="text">Password Changed Successfully</h2>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
