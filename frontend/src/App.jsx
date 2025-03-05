import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Users from "../components/Users/Users";
import SingleUser from "../components/SingleUser/SingleUser";
import Audio from "../components/Audio/Audio";
import SingleAudio from "../components/SingleAudio/SingleAudio";
import AudioCreator from "../components/AudioCreator/AudioCreator";
import SingleReview from "../components/SingleReview/SingleReview";
//
function App() {
  const [userId, setUserId] = useState();
  const [me, setMe] = useState();
  const [audioId, setAudioId] = useState();
  const [reviewId, setReviewId] = useState();

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
          <Route path="/singleUser" element={<SingleUser userId={userId} />} />
          <Route path="/audioCreator" element={<AudioCreator />} />
          <Route
            path="/singleReview"
            element={<SingleReview audioId={audioId} reviewId={reviewId} />}
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
