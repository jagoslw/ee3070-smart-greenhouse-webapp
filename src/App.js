// App.js
import React, { useRef, useState } from "react";
import { HashRouter as Router, Route, Routes, Link } from "react-router-dom";

import Sensors from "./pages/sensors";
import Reports from "./pages/reports";
import AboutUs from "./pages/aboutus";
import Home from "./pages/home";

import "./App.css";
import logo from "./logo.svg";
import menu from "./menu.png";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <button
            className="icon-button"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <img src={menu} alt="Menu" />
          </button>

          <div className="app-brand">
            <img src={logo} alt="Logo" className="brand-logo" />
            <span className="brand-text">EE3070 Smart Greenhouse Webapp</span>
          </div>
        </header>

        <aside
          className={`sidebar ${sidebarOpen ? "open" : ""}`}
          ref={sidebarRef}
        >
          <button
            className="close-button"
            aria-label="Close menu"
            onClick={() => setSidebarOpen(false)}
          >
            Close
          </button>
          <nav className="nav">
            <Link to="/" onClick={() => setSidebarOpen(false)}>Dashboard</Link>
            <Link to="/sensors" onClick={() => setSidebarOpen(false)}>Sensors</Link>
            <Link to="/reports" onClick={() => setSidebarOpen(false)}>Reports</Link>
            <Link to="/aboutus" onClick={() => setSidebarOpen(false)}>About Us</Link>
          </nav>
        </aside>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/aboutus" element={<AboutUs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
