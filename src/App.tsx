import React from 'react';
import './App.css';
import TrashZone from "./components/TrashZone";
import Board from "./components/Board";

function App() {
  return (
      <div className="app-container">
        <Board />
        <TrashZone />
      </div>
  );
}

export default App;
