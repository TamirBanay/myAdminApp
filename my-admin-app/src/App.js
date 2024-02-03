import logo from "./logo.svg";
import "./App.css";

function App() {
  fetch("https://logs-foem.onrender.com/api/modules")
    .then((response) => {
      console.log(response.headers.get("content-type")); // Log the content type
      console.log(response.status); // Log the status code
      if (!response.ok) {
        throw new Error(
          "Network response was not ok, status: " + response.status
        );
      }
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        return response.json();
      }
      throw new TypeError("Oops, we haven't got JSON!");
    })
    .then((data) => {
      // Handle your JSON data here
      console.log(data);
    })
    .catch((error) => {
      // Handle any errors that occurred during the fetch
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  return <div className="App">hello</div>;
}

export default App;
