import React, { useEffect } from "react";
import "./App.css";
import { _modules, _logs, _userIsLoggedIn } from "./services/atom";
import { useRecoilState } from "recoil";
import {
  HashRouter,
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Logs from "./pages/Logs/Logs";
import Tests from "./pages/Tests/Tests";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./pages/SignIn/SignIn";

function App() {
  const [logs, setLogs] = useRecoilState(_logs);


  return (
    <div>

      <HashRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test" element={<Tests />} />
          <Route path="/logs" element={<Logs />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
