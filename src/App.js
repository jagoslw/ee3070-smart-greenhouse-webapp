import logo from './logo.svg';
import menu from './menu.svg';
import './App.css';
import React, { useState, useRef, useEffect } from "react";
import SensorCard from "./SensorCard";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Control from "./pages/controls";
import Sensors from "./pages/sensors";
import Reports from "./pages/reports";  
import { doc, getDoc } from "firebase/firestore"; 
import { db } from "./firebase"; // your initialized Firestore

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  // State to hold humidity value
  const [humidity, setHumidity] = useState(null);
  const [tempC, setTempC] = useState(null);
  const [tempF, setTempF] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    // Close sidebar when clicking outside
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch humidity once when component mounts
  useEffect(() => {
    async function fetchData() {
      const docRef = doc(db, "Environment", "DHT11");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
  
        setHumidity(data.Humidity);
        setTempC(data.Temperature_C);
        setTempF(data.Temperature_F);
  
        if (data.Timestamp) {
          const date = data.Timestamp.toDate();
          setTimestamp(date.toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" }));
        }
      }
    }
  
    // Run once immediately
    fetchData();
  
    // Run every 15 seconds
    const interval = setInterval(fetchData, 15000);
  
    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);
  

  // Example sensor cards (only showing humidity from Firestore)
  const sensors = [
    { sensorName: "Humidity", value: humidity+" %" ?? "Loading..." },
    { sensorName: "Temperature (°C)", value: tempC ?? "Loading..." },
    { sensorName: "Temperature (°F)", value: tempF ?? "Loading..." },
    { sensorName: "Timestamp", value: timestamp ?? "Loading..." }
  ];

  return (
    <div className="app-container">
      <header className="App-header">
        <button onClick={() => setSidebarOpen(true)}> 
          <img src={menu} className="Menu-logo" alt="menu" />
        </button>
        <img src={logo} className="App-logo" alt="logo" />
      </header>

      <div className="app-layout">
        <Router>
          <aside ref={sidebarRef} className={`sidebar ${sidebarOpen ? "open" : ""}`}>
            <h2>
              <li className="sidebar-item" onClick={() => setSidebarOpen(false)}>
                🌿 Greenhouse Control
              </li>
            </h2>
            <ul className="sidebar-menu">      
              <li className="sidebar-item"><Link to="/controls">Controls</Link></li>
              <li className="sidebar-item"><Link to="/sensors">Sensors</Link></li>
              <li className="sidebar-item"><Link to="/reports">Reports</Link></li>
              <li className="sidebar-item">Settings</li>
            </ul>
          </aside>

          <main className="main-content">
            <h1 className="dashboard-title">🌱 Smart Greenhouse Dashboard</h1>
            <div className="grid-container">
              {sensors.map((sensor, index) => (
                <SensorCard key={index} sensorName={sensor.sensorName} value={sensor.value} />
              ))}
            </div>

            <Routes>
              <Route path="/controls" element={<Control />} />
              <Route path="/sensors" element={<Sensors />} />
              <Route path="/reports" element={<Reports />} />
            </Routes>
          </main>
        </Router>
      </div>
    </div>
  );
}

export default App;
