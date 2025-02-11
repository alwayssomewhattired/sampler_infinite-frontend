import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserQuery, useUpdateMutation } from "./SingleUserSlice";

export default function SingleUser(userId) {
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const id = userId.userId;
  console.log(id);
  console.log(userId);

  const { data: myData, isLoading, isSuccess } = useGetUserQuery({ token, id });
  const [createUpdateMutation, error] = useUpdateMutation();

  const [first_name, setFirst_Name] = useState("");
  const [last_name, setLast_Name] = useState("");
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
    }
  }, [myData]);

  const changeInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createUpdateMutation({
        id,
        first_name,
        last_name,
        email,
        normal_password,
      }); //might need to '.unwrap()'
      console.log(response);
      navigate("/home");
    } catch (error) {
      console.error(error);
    }
  };

  let $details;

  if (!token) {
    navigate("/");
  } else if (isLoading) {
    $details = <p>Loading User</p>;
  } else {
    $details = (
      <>
        <div>
          <li key={myData.id}>
            <h4>Old First Name</h4>
            <h3>{myData.first_name}</h3>
            <h4>Old Last Name</h4>
            <h3>{myData.last_name}</h3>
            <h4>Old Email</h4>
            <h3>{myData.email}</h3>
            <h4>Old Password</h4>
            <h3>{myData.password}</h3>
          </li>
        </div>
        <form onSubmit={changeInfo}>
          <label>
            New First Name
            <input
              name="FirstName"
              value={first_name}
              onChange={(e) => setFirst_Name(e.target.value)}
              required
            />
          </label>
          <div></div>
          <label>
            New Last Name
            <input
              name="LastName"
              value={last_name}
              onChange={(e) => setLast_Name(e.target.value)}
              required
            />
          </label>
          <div></div>
          <label>
            New Email
            <input
              name="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <div></div>
          <label>
            New Password
            <input
              name="Password"
              value={normal_password}
              onChange={(e) => setNormal_Password(e.target.value)}
              required
            />
          </label>
          <div></div>
          <button>Register</button>
          {isLoading && <output>Creating user...</output>}
        </form>
      </>
    );
  }

  return (
    <>
      <h1>SingleUser</h1>
      {$details}
    </>
  );
}
