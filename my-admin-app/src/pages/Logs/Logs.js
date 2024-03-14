import React, { useState, useEffect } from "react";
import "./Logs.css";
import {
  _modules,
  _logs,
  _userIsLoggedIn,
  _timeToDesplayLogs,
} from "../../services/atom";
import { useRecoilState } from "recoil";
import Select from "../../components/Select/Select";

function Logs() {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [logs, setLogs] = useRecoilState(_logs);
  const [timeToDesplayLogs, setTimeToDesplayLogs] =
    useRecoilState(_timeToDesplayLogs);
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

        let data = await response.json();

        data = data.filter((log) => log.log && log.log.trim() !== "");

        data = filterLogsByTime(data, timeToDesplayLogs);

        setLogs(data);

        const grouped = groupLogsByMacAddress(data);
        setGroupedLogs(grouped);
      } catch (error) {
        console.error("There was a problem fetching the logs:", error);
      }
    };

    fetchLogs();
  }, [timeToDesplayLogs]);

  function groupLogsByMacAddress(logs) {
    return logs.reduce((acc, log) => {
      if (!acc[log.macAddress]) {
        acc[log.macAddress] = [];
      }
      acc[log.macAddress].push(log);
      return acc;
    }, {});
  }

  function filterLogsByTime(logs, timeFilter) {
    const now = new Date();
    const yearNow = now.getUTCFullYear();
    const monthNow = now.getUTCMonth();
    const dayNow = now.getUTCDate();

    return logs.filter((log) => {
      if (!log.log || !log.timestamp) {
        return false;
      }

      const [datePart] = log.timestamp.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const logYear = year;
      const logMonth = month - 1;
      const logDay = day;

      switch (timeFilter) {
        case "today":
          return (
            logYear === yearNow && logMonth === monthNow && logDay === dayNow
          );

        case "lastWeek":
          const oneWeekAgo = new Date(Date.UTC(yearNow, monthNow, dayNow - 7));
          const logDate = new Date(Date.UTC(year, month - 1, day));
          return logDate >= oneWeekAgo && logDate < now;

        case "all":
          return true;

        default:
          return false;
      }
    });
  }

  return (
    <div className="logs-container">
      <h1>Logs</h1>
      <Select />
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
                  if (log.timestamp) {
                    const datePart = log.timestamp.split("T")[0];
                    const timePartSplit = log.timestamp.split("T")[1]
                      ? log.timestamp.split("T")[1].split("Z")[0]
                      : "";
                    const timeParts = timePartSplit.split(":");
                    const formattedTime =
                      timeParts.length > 2
                        ? `${timeParts[0]}:${timeParts[1]}:${
                            timeParts[2].split(".")[0]
                          }`
                        : timePartSplit;
                    return (
                      <div key={logIndex} className="timestamp">
                        {datePart} {formattedTime}
                        <p />
                      </div>
                    );
                  } else {
                    return (
                      <div key={logIndex} className="timestamp">
                        Timestamp unavailable
                        <p />
                      </div>
                    );
                  }
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
