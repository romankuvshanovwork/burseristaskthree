import React from "react";
import logo from "./logo.svg";
import "./App.css";
import SearchAppBar from "./components/AppBar/AppBar";
import Box from "@mui/material/Box/Box";
import ShowWindInfo from "./components/ShowWindInfo/ShowWindInfo";

function App() {
  return (
    <>
      <SearchAppBar />
      <ShowWindInfo windSpeed={5} />
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </>
  );
}

export default App;
