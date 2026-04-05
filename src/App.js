import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";

import Sensors from "./pages/sensors";
import Reports from "./pages/reports";
import AboutUs from "./pages/aboutus";
import Control from "./pages/control";
import Camera from "./pages/camera";
import Home from "./pages/home";

import "./App.css";
import logo from "./logo.svg";

// 獨立的導航組件，用於處理 Active 狀態
function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="mobile-nav">
      <Link to="/" className={`nav-item ${isActive("/") ? "active" : ""}`}>
        <span className="nav-icon">📊</span>
        <span className="nav-label">Home</span>
      </Link>
      <Link to="/sensors" className={`nav-item ${isActive("/sensors") ? "active" : ""}`}>
        <span className="nav-icon">🌡️</span>
        <span className="nav-label">Sensors</span>
      </Link>
      <Link to="/control" className={`nav-item ${isActive("/control") ? "active" : ""}`}>
        <span className="nav-icon">🎮</span>
        <span className="nav-label">Control</span>
      </Link>
      <Link to="/camera" className={`nav-item ${isActive("/camera") ? "active" : ""}`}>
        <span className="nav-icon">📸</span>
        <span className="nav-label">Cam</span>
      </Link>
      <Link to="/reports" className={`nav-item ${isActive("/reports") ? "active" : ""}`}>
        <span className="nav-icon">📝</span>
        <span className="nav-label">Docs</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        {/* 固定頂部 Header */}
        <header className="app-header">
          <div className="app-brand">
            <img src={logo} alt="Logo" className="brand-logo" />
            <div className="brand-info">
              <span className="brand-text">GREENHOUSE</span>
              <span className="brand-subtext">EE3070 Smart Greenhouse</span>
            </div>
          </div>
          
          {/* PC 端導航欄 (在 Header 內) */}
          <nav className="pc-nav">
            <Link to="/">Dashboard</Link>
            <Link to="/sensors">Sensors</Link>
            <Link to="/control">Control</Link>
            <Link to="/camera">Camera</Link>
            <Link to="/reports">Reports</Link>
            <Link to="/aboutus">About Us</Link>
            <a href="https://jagoslw.github.io" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        {/* 路由切換區域 */}
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sensors" element={<Sensors />} />
            <Route path="/control" element={<Control />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/camera" element={<Camera />} />
          </Routes>
        </main>

        {/* 手機底部導航 */}
        <Navigation />
      </div>
    </Router>
  );
}

export default App;