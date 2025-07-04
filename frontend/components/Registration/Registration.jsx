import { useState } from "react";
import { useAddUserMutation } from "./RegistrationSlice";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Layout/Sidebar";
import Account from "../Layout/Account";

import "./../../styles/styles.css";

export default function Registration({ setMe }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [normal_password, setNormal_Password] = useState("");
  const [createRegisterMutation, { isLoading, error }] = useAddUserMutation();
  const navigate = useNavigate();

  const defaultPhotos = [
    "defaultALBRECHTDURERFINAL.png",
    "defaultBEDRIDDENCOLLAGE.png",
    "defaultBRAINSHAPEFINAL.png",
    "defaultCAMELGUYfinal.png",
    "defaultCLEANCUTLERYFINAL.png",
    "defaultCONSTANTENERGYFINAL.png",
    "defaultDOUBLECHECKCOLLAGE.png",
    "defaultDYSTOPIA.png",
    "defaultEMPTYOURSELVES.png",
    "defaultERUTAnCOLLAGE.png",
    "defaultEXAMINATION.png",
    "defaultGLAZYFINAL.png",
    "defaultLVZFINAL.png",
    "defaultnost final.png",
    "defaultnost.png",
    "defaultOLDWIZARDCOLLAGEFINAL.png",
    "defaultPAINALITYFINAL.png",
    "defaultPLEASECONNECTFINAL.png",
    "defaultPOKERRFINAL.png",
    "defaultQUIETWALKFINAL.png",
    "defaultSEMINAL4.png",
    "defaultSOLARCORONAFINAL.png",
    "defaultTHANKYOUFINAL.png",
    "defaultUNAMED.png",
    "defaultUNKNOWNFEELING.png",
  ];

  const defaultUrl =
    "https://samplerinfinite-default-photos.s3.us-east-2.amazonaws.com";

  const randomPhoto =
    defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];

  const photoId = `${defaultUrl}/${randomPhoto}`;

  const registerInfo = async (e) => {
    e.preventDefault();
    try {
      const response = await createRegisterMutation({
        username,
        email,
        normal_password,
        photoId,
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
      <div className="three-column-layout">
        {<Sidebar />}
        <div
          className="center-content"
        >
      <div className="logo-container">
        <div className="logo">
          <h1 className="logo-text" onClick={() => navigate("/")}>
            SAMPLERINFINITE
          </h1>
        </div>
      </div>
          <h1
            className="text"
            style={{ textAlign: "center", marginBottom: "1em" }}
          >
            Registration
          </h1>
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
        <div>{<Account />}</div>
      </div>
    </>
  );
}
