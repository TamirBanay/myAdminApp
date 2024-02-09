import React, { useEffect, useState } from "react";
import "./Home.css";
import { useRecoilState } from "recoil";
import { _modules, _logs } from "../../services/atom";

function Home() {
  const [modules, setModules] = useRecoilState(_modules);
  const [moduleDetails, setModuleDetails] = useState([]);

  return (
    <div>
      <h1>Connected Modules</h1>
      <div id="modulesInfo">
        {modules.map((details, index) => (
          <div key={index} className="module">
            <strong>Module Name:</strong> {details.moduleName}
            <br />
            <strong>Ip Address:</strong> {details.ipAddress || "Not Available"}
            <br />
            <strong>Mac Address:</strong>{" "}
            {details.macAddress || "Not Available"}
            <br />
            <strong>Last Seen:</strong>{" "}
            {new Date(details.lastSeen).toLocaleString()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
