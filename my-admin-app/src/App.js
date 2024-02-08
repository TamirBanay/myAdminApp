import React, { useEffect } from "react";
import "./App.css";
import { _modules, _logs, _userIsLoggedIn } from "./services/atom";
import { useRecoilState } from "recoil";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Logs from "./pages/Logs/Logs";
import Tests from "./pages/Tests/Tests";
import Navbar from "./components/Navbar/Navbar";
import SignIn from "./pages/SignIn/SignIn";

function App() {
  const [modules, setModules] = useRecoilState(_modules);
  const [logs, setLogs] = useRecoilState(_logs);
  const [userIsLogIn, setUserIsLogIn] = useRecoilState(_userIsLoggedIn);
  const userLogIn = localStorage.getItem("isLoggedIn");
  console.log(userIsLogIn);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          "https://logs-foem.onrender.com/api/modules"
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setModules(data);
        } else if (typeof data === "object") {
          setModules(Object.values(data));
        } else {
          console.error(
            "Received data is neither an array nor an object:",
            data
          );
        }
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchModules();
  }, []);

  return (
    <div>
      {userLogIn ? <Navbar /> : ""}

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="test" element={<Tests />} />
          <Route path="logs" element={<Logs />} />
          <Route path="signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
