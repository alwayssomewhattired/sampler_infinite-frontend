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
import GranularSynthComponent from "../components/GranularSynth/GranularSynth";
import AudioUploader from "../components/AudioUploader/AudioUploader";
import SamplerApp from "../components/GranularInfinite/GranularInfinite";

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
    const saved = sessionStorage.getItem("newAudio");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("newAudio", JSON.stringify(newAudio));
  }, [newAudio]);

  const [profileId, setProfileId] = useState(() => {
    const saved = sessionStorage.getItem("profileId");
    return saved ? JSON.parse(saved) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("profileId", JSON.stringify(profileId));
  }, [profileId]);

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
            path="/users"
            element={
              <Users me={me} profileId={profileId} setAudioId={setAudioId} />
            }
          />

          <Route
            path="singleAudio"
            element={<SingleAudio audioId={audioId} me={me} />}
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
                me={me}
              />
            }
          />
          <Route path="/accountChange" element={<AccountChange me={me} />} />
          <Route
            path="/granularSynth"
            element={<GranularSynthComponent me={me} />}
          />
          <Route
            path="/audioUploader"
            element={<AudioUploader newAudio={newAudio} me={me} />}
          />
          <Route path="/granularInfinite" element={<SamplerApp me={me} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
