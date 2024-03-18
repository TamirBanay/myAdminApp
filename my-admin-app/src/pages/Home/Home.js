import React, { useEffect, useState } from "react";
import "./Home.css";
import { useRecoilState } from "recoil";
import { _modules } from "../../services/atom";

function Home() {
  const [modules, setModules] = useRecoilState(_modules);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await fetch(
          "https://logs-foem.onrender.com/api/getModuels"
        );
        if (!response.ok) {
          console.error("Response: ", response);
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
  }, [setModules]); // Add setModules to the dependency array if it can change over time

  return (
    <div>
      <h1>Connected Modules</h1>
      <div id="modulesInfo">
        {modules.map((details, index) => {
          const date = new Date(details.timestamp);
          const lastSeen = isNaN(date.getTime())
            ? "Invalid timestamp"
            : date.toLocaleString();
          return (
            <div key={index} className="module">
              <strong>Module Name:</strong> {details.moduleName}
              <br />
              <strong>IP Address:</strong>{" "}
              {details.ipAddress || "Not Available"}
              <br />
              <strong>Mac Address:</strong>{" "}
              {details.macAddress || "Not Available"}
              <br />
              <strong>Last Seen:</strong> {lastSeen}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
