import React, { useState, useEffect } from "react";
import "./Logs.css"; // Ensure you have a Logs.css file for CSS
import { _modules, _logs, _userIsLoggedIn } from "../../services/atom";
import { useRecoilState } from "recoil";

function Logs() {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [logs, setLogs] = useRecoilState(_logs);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "https://logs-foem.onrender.com/api/logs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setLogs(data);
        const nonEmptyLogs = data.filter(
          (log) => log.log && log.log.trim() !== ""
        );
        const grouped = groupLogsByMacAddress(nonEmptyLogs);
        setGroupedLogs(grouped);
      } catch (error) {
        console.error("There was a problem fetching the logs:", error);
      }
    };

    fetchLogs();
  }, []);

  function groupLogsByMacAddress(logs) {
    return logs.reduce((acc, log) => {
      if (!acc[log.macAddress]) {
        acc[log.macAddress] = [];
      }
      acc[log.macAddress].push(log);
      return acc;
    }, {});
  }
  return (
    <div className="logs-container">
      <h1>Logs</h1>
      <table className="logs-table">
        <thead>
          <tr>
            <td>MAC Address</td>
            <td>Log Message</td>
            <td>Last Seen</td>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedLogs).map(([macAddress, logs], index) => (
            <tr key={index}>
              <td>{macAddress}</td>
              <td>
                {logs.map((log, logIndex) => (
                  <div className="masagge-colum" key={logIndex}>
                    {log.log} <p />
                  </div>
                ))}
              </td>
              <td>
                {logs.map((log, logIndex) => {
                  const datePart = log.timestamp.split("T")[0];
                  const timePart = log.timestamp.split("T")[1].split("Z")[0];

                  const timeParts = timePart.split(":");
                  const formattedTime =
                    timeParts.length > 2
                      ? `${timeParts[0]}:${timeParts[1]}:${
                          timeParts[2].split(".")[0]
                        }`
                      : timePart;

                  return (
                    <div key={logIndex} className="timestamp">
                      {datePart} {formattedTime}
                      <p />
                    </div>
                  );
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Logs;
