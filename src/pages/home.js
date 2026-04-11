import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  // Added icons and refined the descriptions for a more "Cyber-Dashboard" feel
  const pages = [
    { title: "Sensors", description: "Real-time environment telemetry", path: "/sensors", icon: "🌡️" },
    { title: "Control", description: "Manual override & AI autopilot", path: "/control", icon: "🎮" },
    { title: "Chat", description: "Interactive AI chat interface", path: "/chat", icon: "💬" },
    { title: "Camera", description: "Live optical feed & vision processing", path: "/camera", icon: "📸" },
    { title: "Reports", description: "Historical data logs & analytics", path: "/reports", icon: "📝" },
    { title: "About Us", description: "System architecture & dev team", path: "/aboutus", icon: "ℹ️" },
  ];

  return (
    <div className="home-container">
      <div className="home-header">
        <h1 className="home-title">AGiVEMS DASHBOARD</h1>
        <p className="home-subtitle">Advanced Greenhouse Intelligence and Vision-Enhanced Monitoring System</p>
      </div>

      <div className="home-grid">
        {pages.map((page, i) => (
          <Link to={page.path} key={i} className="home-card">
            <div className="card-icon">{page.icon}</div>
            <div className="card-content">
              <h2>{page.title}</h2>
              <p>{page.description}</p>
            </div>
            <div className="card-action">ACCESS &rarr;</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;