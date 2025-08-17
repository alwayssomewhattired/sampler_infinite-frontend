import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Home from "../components/Home/Home";
import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Users from "../components/Users/Users";
import SingleUser from "../components/SingleUser/SingleUser";
import AccountChange from "../components/AccountChange/AccountChange";
import Audio from "../components/Audio/Audio";
import SingleAudio from "../components/SingleAudio/SingleAudio";
import AudioCreator from "../components/AudioCreator/AudioCreator";
// import GranularSynthComponent from "../components/GranularSynth/GranularSynth";
import AudioUploader from "../components/AudioUploader/AudioUploader";
import AudiosUploader from "../components/AudiosUploader/AudiosUploader";
import SamplerApp from "../components/GranularInfinite/GranularInfinite";
import AboutAuthor from "../components/AboutAuthor/AboutAuthor";
import Audios from "../components/Audios/Audios";
import GranularInfinite from "../components/GranularInfiniteNew/GranularInfiniteNew";

function App() {
  const [me, setMe] = useState(() => {
    // Retrieve from sessionStorage or default to 0
    const storedMe = sessionStorage.getItem("me");
    return storedMe ? JSON.parse(storedMe) : 0;
  });

  useEffect(() => {
    // Save to sessionStorage
    sessionStorage.setItem("me", JSON.stringify(me));
  }, [me]);

  const [audioId, setAudioId] = useState(() => {
    const saved = sessionStorage.getItem("audioId");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("audioId", JSON.stringify(audioId));
  }, [audioId]);

  const [newAudio, setNewAudio] = useState(() => {
    try {
      const saved = sessionStorage.getItem("newAudio");
      // return saved ? JSON.parse(saved) : [];
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem("newAudio", JSON.stringify(newAudio));
  }, [newAudio]);

  const [sampledinfinite, setSampledinfinite] = useState(() => {
    try {
      const saved = sessionStorage.getItem("sampledinfinite");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    sessionStorage.setItem("sampledinfinite", JSON.stringify(sampledinfinite));
  }, [sampledinfinite]);

  const [profileId, setProfileId] = useState(() => {
    const saved = sessionStorage.getItem("profileId");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("profileId", JSON.stringify(profileId));
  }, [profileId]);

  const [packId, setPackId] = useState(() => {
    const saved = sessionStorage.getItem("packId");
    return saved ? JSON.parse(saved) : "";
  });

  useEffect(() => {
    sessionStorage.setItem("packId", JSON.stringify(packId));
  }, [packId]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home me={me} />} />
          <Route path="/login" element={<Login setMe={setMe} />} />
          <Route path="/register" element={<Registration setMe={setMe} />} />
          <Route
            path="/audio"
            element={
              <Audio
                setAudioId={setAudioId}
                me={me}
                setProfileId={setProfileId}
              />
            }
          />
          <Route
            path="/audios"
            element={
              <Audios
                setAudioId={setAudioId}
                me={me}
                setProfileId={setProfileId}
                setPackId={setPackId}
              />
            }
          />
          <Route
            path="/users"
            element={
              <Users me={me} profileId={profileId} setAudioId={setAudioId} />
            }
          />

          <Route
            path="singleAudio"
            element={
              <SingleAudio
                audioId={audioId}
                me={me}
                setProfileId={setProfileId}
              />
            }
          />
          <Route
            path="/singleUser"
            element={<SingleUser me={me} setAudioId={setAudioId} />}
          />
          <Route
            path="/audioCreator"
            element={
              <AudioCreator
                setNewAudio={setNewAudio}
                newAudio={newAudio}
                sampledinfinite={sampledinfinite}
                setSampledinfinite={setSampledinfinite}
                me={me}
              />
            }
          />
          <Route path="/accountChange" element={<AccountChange me={me} />} />
          {/* <Route
            path="/granularSynth"
            element={<GranularSynthComponent me={me} />}
          /> */}
          <Route
            path="/audioUploader"
            element={
              <AudioUploader
                newAudio={newAudio}
                sampledinfinite={sampledinfinite}
                me={me}
              />
            }
          />
          <Route
            path="audiosUploader"
            element={
              <AudiosUploader
                newAudio={newAudio}
                sampledinfinite={sampledinfinite}
                me={me}
              />
            }
          />
          <Route
            path="/granularInfinite"
            element={<SamplerApp me={me} packId={packId} />}
          />
          <Route
            path="/granularInfiniteNew"
            element={<GranularInfinite me={me} packId={packId} />}
          />
          <Route path="/aboutAuthor" element={<AboutAuthor me={me} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
