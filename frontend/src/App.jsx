import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Registration from "../components/Registration/Registration";
import Login from "../components/Login/Login";
import Home from "../components/Home/Home";
import SingleUser from "../components/SingleUser/SingleUser";

function App() {
  const [userId, setUserId] = useState();
  const [me, setMe] = useState();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login setMe={setMe} />} />
          <Route path="/register" element={<Registration setMe={setMe} />} />
          <Route
            path="/home"
            element={<Home setUserId={setUserId} me={me} />}
          />
          <Route path="/singleUser" element={<SingleUser userId={userId} />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
