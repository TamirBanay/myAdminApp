import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { _modules, _logs } from "../../services/atom";
import "./Test.css";
import Loading from "../../components/loading/Loading";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CloseIcon from "@mui/icons-material/Close";
function Tests() {
  const [modules, setModules] = useRecoilState(_modules);
  const [pingResults, setPingResults] = useState({});
  const [loadingMacAddress, setLoadingMacAddress] = useState(null);
  const [error, setError] = useState("");
  const [testType, setTestType] = useState("");

  const pingModulesWithMacAddress = async (macAddress, testType) => {
    setLoadingMacAddress(macAddress); // Show loading indicator
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ macAddress, testType }),
    };

    try {
      const response = await fetch(
        "https://logs-foem.onrender.com/api/pingModule",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      console.log("Ping response:", data);
      setTimeout(() => {
        fetchPongMessage();
        setLoadingMacAddress(null);
      }, 5000);
    } catch (error) {
      console.error("Error during test:", error);
      setLoadingMacAddress(null);
    }
  };

  const fetchPongMessage = async () => {
    try {
      const response = await fetch(
        "https://logs-foem.onrender.com/api/pongReceivedFromModule"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();

      if (data.message.includes("sucsses")) {
        setPingResults(data);
      } else {
        setError("No pong message or not the expected content, Try agine");
      }
    } catch (error) {
      console.error("Error fetching pong message:", error);
    }
  };

  return (
    <div>
      <div>
        {modules.map((module, index) => (
          <div className="Test-module" key={index}>
            <div className="Test-module-details">
              <strong>Module Name: {module.moduleName}</strong>
              <br />
              <strong>Ip Address: {module.ipAddress || "Not Available"}</strong>
              <br />
              <strong>
                Mac Address: {module.macAddress || "Not Available"}
              </strong>
            </div>
            <div className="button-and-loading">
              <button
                className="button"
                disabled={loadingMacAddress === module.macAddress}
                onClick={() => {
                  setTestType("PingTest");
                  pingModulesWithMacAddress(module.macAddress, "PingTest");
                }}
              >
                Send Ping
              </button>
              <button
                className="button"
                disabled={loadingMacAddress === module.macAddress}
                onClick={() => {
                  setTestType("LedTest");
                  pingModulesWithMacAddress(module.macAddress, "LedTest");
                }}
              >
                Test LEDs
              </button>
              <button
                className="button"
                disabled={loadingMacAddress === module.macAddress}
                onClick={() => {
                  setTestType("LedTest");
                  pingModulesWithMacAddress(module.macAddress, "Reset");
                }}
              >
                Reset Module
              </button>
              {loadingMacAddress === module.macAddress ? (
                <div className="pingMassage">
                  <Loading />
                </div> // Show loading indicator for the current module
              ) : pingResults.macAddress === module.macAddress ? (
                <div className="pingMassage">
                  <DoneOutlineIcon color="success" fontSize="large" />
                </div>
              ) : (
                <div className="pingMassage">
                  <CloseIcon color="warning" fontSize="large" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tests;
