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
      }).unwrap();
      setMe(response.me);
      sessionStorage.setItem("token", response.token);
      navigate("/audioCreator");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="top-menu">
        <Link className="neu" to="/">
          Home
        </Link>
        <Link className="neu" to="/login">
          Login
        </Link>
      </div>
      <h1 className="text" style={{ textAlign: "center" }}>
        Registration
      </h1>
      ;
      <div className="container">
        <form onSubmit={registerInfo} className="container">
          <label className="text">
            Username
            <input
              style={{ margin: "2em" }}
              name="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="text">
            Email
            <input
              style={{ margin: "2em" }}
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="text">
            Password
            <input
              style={{ margin: "2em" }}
              name="Password"
              value={normal_password}
              onChange={(e) => setNormal_Password(e.target.value)}
            />
          </label>
          <button className="button">Register</button>
          {isLoading && <output className="text">Creating user...</output>}
          {error && (
            <output className="error">
              Error creating user {error.message}
            </output>
          )}
        </form>
      </div>
    </>
  );
}
