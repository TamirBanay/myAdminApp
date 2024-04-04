import React, { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { _modules, _logs } from "../../services/atom";
import "./Test.css";
import Loading from "../../components/loading/Loading";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import CloseIcon from "@mui/icons-material/Close";
import Badge from "@mui/material/Badge";

function Tests() {
  const [pingResults, setPingResults] = useState({});
  const [loadingMacAddress, setLoadingMacAddress] = useState(null);
  const [error, setError] = useState("");
  const [testType, setTestType] = useState("");
  const [lastVersion, setLastVersion] = useState("");

  const [connectionStatus, setConnectionStatus] = useState({}); // New state for connection status
  const modulesLocalStorage = localStorage.getItem("modules");
  const modules = modulesLocalStorage ? JSON.parse(modulesLocalStorage) : [];

  const pingModulesWithMacAddress = async (macAddress, testType) => {
    setLoadingMacAddress(macAddress);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ macAddress, testType }),
    };

    try {
      const response = await fetch(
        "https://alerm-api-9ededfd9b760.herokuapp.com/api/pingModule",
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
        "https://alerm-api-9ededfd9b760.herokuapp.com/api/pongReceivedFromModule"
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

  useEffect(() => {
    const fetchConnectionStatus = async () => {
      modules.forEach(async (module) => {
        try {
          const response = await fetch(
            `https://alerm-api-9ededfd9b760.herokuapp.com/api/moduleIsConnectIndicator/${module.macAddress}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setConnectionStatus((prevStatus) => ({
            ...prevStatus,
            [module.macAddress]: data.isConnected,
          }));
        } catch (error) {
          console.error(
            `Error fetching connection status for ${module.macAddress}:`,
            error
          );
        }
      });
    };

    fetchConnectionStatus();

    const intervalId = setInterval(fetchConnectionStatus, 60000);

    return () => clearInterval(intervalId);
  }, []);

  const fetchLastVersion = async () => {
    try {
      const response = await fetch(
        "https://alerm-api-9ededfd9b760.herokuapp.com/api/getLastVersion"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setLastVersion(data.lastVersion);
    } catch (error) {
      console.error("Could not fetch last version:", error);
    }
  };
  fetchLastVersion();
  return (
    <div>
      <div>
        {modules.map((module, index) => (
          <div className="Test-module" key={index}>
            <div className="Test-module-details">
              <strong className="ModuleName-test">
                Module Name: {module.moduleName}
                <div className="badge-div">
                  <Badge
                    badgeContent={""}
                    color={
                      connectionStatus[module.macAddress] ? "success" : "error"
                    }
                    variant="dot"
                  />
                </div>
              </strong>
              <strong>Ip Address: {module.ipAddress || "Not Available"}</strong>
              <strong>
                Mac Address: {module.macAddress || "Not Available"}
              </strong>
              <strong>Version: {module.version || "Not Available"} </strong>
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
                disabled={
                  loadingMacAddress === module.macAddress ||
                  lastVersion === module.version // Assuming lastVersion should be compared with module.version
                }
                onClick={() => {
                  setTestType("Update");
                  pingModulesWithMacAddress(module.macAddress, "Update");
                }}
              >
                Update Firmware
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
                </div>
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
