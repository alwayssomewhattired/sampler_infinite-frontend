import { useState, useEffect } from "react";
import {
  useGetUsersQuery,
  useAboutMeQuery,
  useDeleteMutation,
} from "./HomeSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Home({ setUserId }) {
  const { data: myData, isSuccess } = useGetUsersQuery();
  const { data: myOwnData, isSuccess: done } = useAboutMeQuery();
  const [createDeleteMutation, { isLoading, error }] = useDeleteMutation();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      console.log(myData);
      setUsers(myData);
      console.log(users);
    }
  }, [myData]);

  useEffect(() => {
    console.log(`is this done ${done}`);
    if (done) {
      console.log(myOwnData.email);
    }
  }, [myOwnData]);

  function deleteUser(id) {
    try {
      console.log(token);
      console.log(id);
      createDeleteMutation({ token, id });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <h1>Home</h1>
      <div>
        {users.map((user) => (
          <li key={user.id}>
            <h3>
              {user.first_name} {user.last_name}
            </h3>
            <h3>{user.email}</h3>
            <button
              onClick={() => {
                setUserId(user.id);
                navigate("/singleUser");
              }}
            >
              Update
            </button>
            <button
              onClick={() => {
                user.email != myOwnData.email ? (
                  deleteUser(user.id)
                ) : (
                  <h3>Cannot Delete Self</h3>
                );
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </div>
    </>
  );
}
