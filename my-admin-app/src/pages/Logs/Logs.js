import React, { useState, useEffect } from "react";
import "./Logs.css"; // Ensure you have a Logs.css file for CSS

function Logs() {
  const [groupedLogs, setGroupedLogs] = useState({});

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
        const nonEmptyLogs = data.filter(
          (log) => log && Object.keys(log).length > 0
        );
        setGroupedLogs(groupLogsByMacAddress(nonEmptyLogs));
      } catch (error) {
        console.error("There was a problem fetching the logs:", error);
      }
    };

    fetchLogs();
  }, [groupedLogs]);

  function groupLogsByMacAddress(logs) {
    return logs.reduce((acc, log) => {
      if (log.macAddress && log.timestamp) {
        if (!acc[log.macAddress]) {
          acc[log.macAddress] = { messages: [], lastSeen: new Date(0) }; // Set to epoch
        }
        acc[log.macAddress].messages.push(log.log);

        const newTimestamp = new Date(log.timestamp);
        if (newTimestamp > acc[log.macAddress].lastSeen) {
          acc[log.macAddress].lastSeen = newTimestamp;
        }
      }
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
          {Object.entries(groupedLogs).map(([macAddress, data], index) => (
            <tr key={macAddress}>
              <td>{macAddress}</td>
              <td>
                {data.messages.map((msg, msgIndex) => (
                  <p key={msgIndex}>{msg}</p> // Use <p> or another appropriate element instead of <td> here
                ))}
              </td>
              <td>
                {data.lastSeen
                  ? new Date(data.lastSeen).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Logs;
