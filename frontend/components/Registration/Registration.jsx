import { useState } from "react";
import { useAddUserMutation } from "./RegistrationSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Registration() {
  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");
  //might need to destructure 'isLoading, error'
  const [createRegisterMutation, isLoading, error] = useAddUserMutation();
  const navigate = useNavigate();

  const registerInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createRegisterMutation({
        first_name,
        last_name,
        email,
        normal_password,
      }); //might need to '.unwrap()'
      console.log(response.token);
      sessionStorage.setItem("token", response.token);
      navigate("/home");
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
          First Name
          <input
            name="FirstName"
            value={first_name}
            onChange={(e) => setFirst_Name(e.target.value)}
          />
        </label>
        <label>
          Last Name
          <input
            name="LastName"
            value={last_name}
            onChange={(e) => setLast_Name(e.target.value)}
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
