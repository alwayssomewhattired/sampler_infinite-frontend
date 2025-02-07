import { Provider } from "react-redux";
import { store } from "./store/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Registration from "./components/Registration/Registration";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import SingleUser from "./components/SingleUser/SingleUser";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/home" element={<Home />} />
          <Route path="/singleUser" element={<SingleUser />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
