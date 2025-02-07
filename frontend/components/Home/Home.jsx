import { useState, useEffect } from "react";
import { useGetUsersQuery, useDeleteMutation } from "./HomeSlice";
import { useNavigate, Link } from "react-router-dom";

export default function Home() {
  const { data: myData, isSuccess } = useGetUsersQuery();
  const [createDeleteMutation, { isLoading, error }] = useDeleteMutation();
  const [users, setUsers] = useState([]);
  const [id, setId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    console.log(`is this a success ${isSuccess}`);
    if (isSuccess) {
      setUsers(myData.User); //I don't know what myData exactly returns so this might be a problem
      console.log(users);
    }
  }, [myData]);

  //This delete function just may be terrible and is not finished.
  const deleteUser = async (e) => {
    e.preventDefault();
    try {
      const response = await createDeleteMutation({
        id,
      });
    } catch (error) {
      console.error(error);
    }
  };

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
                setId(user.id);
                navigate("/single_user");
              }}
            >
              Update
            </button>
            <button
              onClick={() => {
                //add delete logic here
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
