import { Link } from "react-router-dom";
import { useState } from "react";
import { useAddLoginMutation } from "./LoginSlice";
import { useNavigate } from "react-router-dom";

export default function Login(setMe) {
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
      }); //might need to add '.unwrap()' here
      console.log(response.data.token);
      sessionStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <h1>Login</h1>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <form onSubmit={loginInfo}>
        <label>
          Email
          <input
            name="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            name="Password"
            value={normal_password}
            onChange={(e) => setNormal_Password(e.target.value)}
          />
        </label>
        <button>Login</button>
        {isLoading && <output>Logging in...</output>}
        {error && <output>Invalid credentials{error.message}</output>}
      </form>
    </>
  );
}
