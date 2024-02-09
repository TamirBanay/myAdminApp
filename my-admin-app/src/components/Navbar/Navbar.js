import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/logs">Logs</Link>
        </li>
        <li>
          <Link to="/test">Test</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
