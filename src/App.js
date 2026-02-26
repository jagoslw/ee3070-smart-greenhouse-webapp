import logo from './logo.svg';
import './App.css';
import React from "react";
import SensorCard from "./SensorCard";
import ControlPanel from "./ControlPanel";

function App() {
// Example sensor data 
  const sensors = [ 
      { sensorName: "Temperature", value: "25" },{ sensorName: "Soil Moisture", value: "38" },
      { sensorName: "Temperature", value: "20" },{ sensorName: "Soil Moisture", value: "45" },
      { sensorName: "Temperature", value: "10" },{ sensorName: "Soil Moisture", value: "28" },
      { sensorName: "Temperature", value: "30" },{ sensorName: "Soil Moisture", value: "50" },
      { sensorName: "Temperature", value: "40" },{ sensorName: "Soil Moisture", value: "22" },
      { sensorName: "Temperature", value: "18" },{ sensorName: "Soil Moisture", value: "35" },
  ];

  return (
    <div className="app-container">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          This is <code>src/App.js</code> and I have saved and reloaded now
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
      <h1 ClassName="dashboard-title">🌱 Smart Greenhouse Dashboard</h1>
      <div className="grid-container">
        {sensors.map((sensor, index) => (
          <SensorCard key={index} sensorName={sensor.sensorName} value={sensor.value} />
        ))}
      </div>
      <ControlPanel />
    </div>
  );
}

export default App;
