import { useEffect, useState } from "react";
import { useGetUserQuery } from "./SingleUserSlice";

const ProfilePhoto = () => {
  const { data: user, isLoading: isUser } = useGetUserQuery();

  const [userPhotoId, setUserPhotoId] = useState("default");

  useEffect(() => {
    if (!isUser && user) {
      setUserPhotoId(user.photoId);
    }
  }, [user, isUser]);

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

  const defaultPhotoUrl = `${defaultUrl}/${randomPhoto}`;
  const photoUrl = `${userPhotoId}`;

  return (
    <div>
      {userPhotoId == "default" || undefined ? (
        <img style={{ height: "80px" }} src={defaultPhotoUrl} alt="Profile" />
      ) : (
        <img style={{ height: "80px" }} src={photoUrl} alt="Profile" />
      )}
    </div>
  );
};

export default ProfilePhoto;
