import { useState } from "react";
import { useAddUserMutation } from "./RegistrationSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Registration({ setMe }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");
  //might need to destructure 'isLoading, error'
  const [createRegisterMutation, isLoading, error] = useAddUserMutation();
  const navigate = useNavigate();

  const registerInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createRegisterMutation({
        username,
        email,
        normal_password,
      }); //might need to '.unwrap()'

      console.log(response.data);
      console.log(response.data.token);
      setMe(response.data.id);
      sessionStorage.setItem("token", response.data.token);
      navigate("/audioCreator");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <h1>Registration</h1>;
      <div>
        <Link to="/">Back to login</Link>
      </div>
      <form onSubmit={registerInfo}>
        <label>
          Username
          <input
            name="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
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
        <button>Register</button>
        {isLoading && <output>Creating user...</output>}
        {error && <output>Error creating user {error.message}</output>}
      </form>
    </>
  );
}
