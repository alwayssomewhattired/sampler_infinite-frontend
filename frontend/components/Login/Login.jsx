import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAddLoginMutation } from "./LoginSlice";
import Sidebar from "../Layout/Sidebar";
import Account from "../Layout/Account";

import "./../../styles/styles.css";

export default function Login({ setMe }) {
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");
  const [createLoginMutation, { isLoading, error }] = useAddLoginMutation();
  const navigate = useNavigate();

  const loginInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createLoginMutation({
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
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
      <div className="two-column-layout">
        {<Sidebar />}
        <div
          className="center"
          style={{ marginLeft: "23%", marginTop: "6.5em" }}
        >
          <h1 className="text" style={{ textAlign: "center" }}>
            Login
          </h1>
          <form onSubmit={loginInfo} className="container">
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
                type="password"
                name="Password"
                value={normal_password}
                onChange={(e) => setNormal_Password(e.target.value)}
              />
            </label>
            <button className="button">Login</button>
            {isLoading && <output className="text">Logging in...</output>}
            {error && (
              <output className="error">
                Invalid credentials{error.message}
              </output>
            )}
          </form>
        </div>
        <div style={{ marginLeft: "20%" }}>{<Account />}</div>
      </div>
    </>
  );
}
