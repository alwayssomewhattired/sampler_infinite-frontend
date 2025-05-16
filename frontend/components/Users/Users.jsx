import { useEffect, useState } from "react";
import { useAboutHimQuery } from "./UsersSlice";
import Sidebar from "../Layout/Sidebar";
import "./../../styles/styles.css";

export default function Users({ profileId }) {
  console.log(profileId);
  const [user, setUser] = useState([]);
  const { data: profileData, isSuccess: isProfileData } =
    useAboutHimQuery(profileId);

  useEffect(() => {
    if (isProfileData) {
      setUser(profileData);
      console.log(profileData);
    }
  }, [isProfileData, profileData]);

  return (
    <>
      <div className="two-column-layout">
        {<Sidebar />}
        <div className="right">
          {user &&
            user.map((profile, index) => (
              <li key={index}>
                <h1 className="text">prof</h1>
              </li>
            ))}
        </div>
      </div>
    </>
  );
}
