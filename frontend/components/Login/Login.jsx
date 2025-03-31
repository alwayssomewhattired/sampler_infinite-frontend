import { Link } from "react-router-dom";
import { useState } from "react";
import { useAddLoginMutation } from "./LoginSlice";
import { useNavigate } from "react-router-dom";

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
      });
      console.log(response.data.token);
      setMe(response.data.me);
      sessionStorage.setItem("token", response.data.token);
      navigate("/audioCreator");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1 className="text">Login</h1>
      <Link className="text" to="/register">
        Register
      </Link>
      <div className="container">
        <div className="item">
          <form onSubmit={loginInfo}>
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
                  type="password"
                  name="Password"
                  value={normal_password}
                  onChange={(e) => setNormal_Password(e.target.value)}
                />
              </label>
            </div>
            <button className="button">Login</button>
            {isLoading && <output className="text">Logging in...</output>}
            {error && (
              <output className="text">
                Invalid credentials{error.message}
              </output>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
