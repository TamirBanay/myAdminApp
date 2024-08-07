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
import ButtonUp from "../../components/ButtonUp/ButtonUp";

function Logs() {
  const [groupedLogs, setGroupedLogs] = useState({});
  const [logsData, setLogs] = useRecoilState(_logs);
  const [timeToDesplayLogs, setTimeToDesplayLogs] =
    useRecoilState(_timeToDesplayLogs);
  const LocalStoragelogs = localStorage.getItem("logs");
  const logs = LocalStoragelogs ? JSON.parse(LocalStoragelogs) : [];

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "https://logsapi-o1jn.onrender.com/api/getLogs"
        );
        if (!response.ok) {
          throw new Error(
            `Network response was not ok, status: ${response.status}`
          );
        }

        let data = await response.json();
        data = data.filter((log) => log.log && log.log.trim() !== "");
        data = filterLogsByTime(data, timeToDesplayLogs);
        setLogs(data);
        localStorage.setItem("logs", JSON.stringify(data));
        const grouped = groupLogsByMacAddress(data);
        setGroupedLogs(grouped);
      } catch (error) {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    fetchLogs();

    // רענון הלוגים כל 30 שניות אם נדרש
    // const intervalId = setInterval(fetchLogs, 30000);

    // ניקוי רענון במידה והמרכיב יוצא מה-DOM
    // return () => clearInterval(intervalId);
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
      <Select /> <p />
      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>MAC Address</th>
              <th>Log Message</th>
              <th>Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedLogs).map(
              ([macAddress, logs], index, array) =>
                [...logs].reverse().map((log, logIndex) => (
                  <tr
                    key={`${index}-${logIndex}`}
                    className={
                      logIndex === logs.length - 1 && index !== array.length - 1
                        ? "mac-separator"
                        : ""
                    }
                  >
                    <td className="mac-address">
                      {macAddress}
                      <br />
                      {log.moduleName}
                    </td>
                    <td className="log-message">
                      <div
                        className={
                          log.log.startsWith("alerm active ")
                            ? "redTextForAlert"
                            : log.log.startsWith("module is connected")
                            ? "greenTextForConnection"
                            : "message-column"
                        }
                      >
                        {log.log}
                      </div>
                    </td>
                    <td className="last-seen">
                      <div className="timestamp">
                        {log.timestamp.split("T")[0] +
                          " " +
                          log.timestamp.split("T")[1].split("Z")[0]}
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      <ButtonUp />
    </div>
  );
}

export default Logs;
