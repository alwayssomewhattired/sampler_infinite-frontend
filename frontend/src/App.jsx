import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Users from "../components/Users/Users";
import SingleUser from "../components/SingleUser/SingleUser";
import Audio from "../components/Audio/Audio";
import SingleAudio from "../components/SingleAudio/SingleAudio";
import AudioCreator from "../components/AudioCreator/AudioCreator";
import SingleReview from "../components/SingleReview/SingleReview";
import GranularSynthComponent from "../components/GranularSynth/GranularSynth";
import AudioUploader from "../components/AudioUploader/AudioUploader";

function App() {
  const [userId, setUserId] = useState();

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

  const [reviewId, setReviewId] = useState(() => {
    const storedReview = sessionStorage.getItem("reviewId");
    return storedReview ? JSON.parse(storedReview) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem("reviewId", JSON.stringify(reviewId));
  }, [reviewId]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setMe={setMe} />} />
          <Route path="/register" element={<Registration setMe={setMe} />} />
          <Route path="/audio" element={<Audio setAudioId={setAudioId} />} />
          <Route
            path="/users"
            element={<Users setUserId={setUserId} me={me} />}
          />
          <Route
            path="singleAudio"
            element={
              <SingleAudio audioId={audioId} setReviewId={setReviewId} />
            }
          />
          <Route path="/singleUser" element={<SingleUser me={me} />} />
          <Route
            path="/audioCreator"
            element={
              <AudioCreator setNewAudio={setNewAudio} newAudio={newAudio} />
            }
          />
          <Route
            path="/singleReview"
            element={<SingleReview audioId={audioId} reviewId={reviewId} />}
          />
          <Route path="/granularSynth" element={<GranularSynthComponent />} />
          <Route path="/audioUploader" element={<AudioUploader />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
