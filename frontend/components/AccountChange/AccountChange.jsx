import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  useGetUserQuery,
  useUpdateEmailMutation,
  useUpdateUsernameMutation,
  useUpdatePasswordMutation,
} from "./AccountChangeSlice";
import Sidebar from "../Layout/Sidebar";
import Account from "../Layout/Account";

let emailSuccess = false;
let usernameSuccess = false;
let passwordSuccess = false;

export default function AccountChange({ me }) {
  const token = sessionStorage.getItem("token");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  const id = me;

  const [changeEmail, setChangeEmail] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);
  const [changePassword, setChangePassword] = useState(false);

  const { data: myData } = useGetUserQuery({ token, id });
  const [createUpdateEmailMutation] = useUpdateEmailMutation();
  const [createUpdateUsernameMutation] = useUpdateUsernameMutation();
  const [createUpdatePasswordMutation] = useUpdatePasswordMutation();

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
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
      <div className="two-column-layout">
        {<Sidebar />}
        <div className="right" style={{ marginTop: "10em", marginLeft: "3%" }}>
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
        {<Account me={me} />}
      </div>
    </>
  );
}
