import React, { useEffect } from "react";
import "./App.css";
import { _modules, _logs } from "./services/atom";
import { useRecoilState } from "recoil";

function App() {
  const [modules, setModules] = useRecoilState(_modules);
  const [logs, setLogs] = useRecoilState(_logs);

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

  useEffect(() => {
    // Function to fetch logs from the server
    const fetchLogs = async () => {
      try {
        const response = await fetch(
          "https://logs-foem.onrender.com/api/logs",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            // Send any required data as JSON
            // If your endpoint doesn't require a body, you can omit this part
            body: JSON.stringify({
              /* Your request body here */
            }),
          }
        );

        if (!response.ok) {
          // If the response is not ok, throw an error with the status
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON from the response
        setLogs(data); // Update state with the received logs
        console.log(data);
      } catch (error) {
        // Log the error message, which includes the status if it was thrown above
        console.error("There was a problem fetching the logs:", error.message);
      }
    };

    fetchLogs();
  }, []);
  return <div className="App"></div>;
}

export default App;
