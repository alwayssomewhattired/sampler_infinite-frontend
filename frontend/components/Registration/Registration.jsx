import { useState } from "react";
import { useAddUserMutation } from "./RegistrationSlice";
import { useNavigate, Link } from "react-router-dom";

import "./../../styles/styles.css";

export default function Registration({ setMe }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");
  const [createRegisterMutation, { isLoading, error }] = useAddUserMutation();
  const navigate = useNavigate();

  const registerInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createRegisterMutation({
        username,
        email,
        normal_password,
      });
      setMe(response.data.me);
      sessionStorage.setItem("token", response.data.token);
      navigate("/audioCreator");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="text">Registration</h1>;
      <Link className="text" to="/">
        Back to login
      </Link>
      <div className="container">
        <div className="item">
          <form onSubmit={registerInfo}>
            <div className="item">
              <label className="text">
                Username
                <input
                  className="border"
                  name="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </label>
            </div>
            <div className="item">
              <label className="text">
                Email
                <input
                  className="border"
                  name="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>
            <div className="item">
              <label className="text">
                Password
                <input
                  className="border"
                  name="Password"
                  value={normal_password}
                  onChange={(e) => setNormal_Password(e.target.value)}
                />
              </label>
            </div>
            <button className="button">Register</button>
            {isLoading && <output className="text">Creating user...</output>}
            {error && (
              <output className="text">
                Error creating user {error.message}
              </output>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
