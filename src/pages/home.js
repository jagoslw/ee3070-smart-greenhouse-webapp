import React from "react";
import { Link } from "react-router-dom";
import "./home.css";

function Home() {
  const pages = [
    { title: "Sensors", description: "View live sensor data", path: "/sensors" },
    { title: "Control", description: "Control the greenhouse environment", path: "/control" },
    { title: "Reports", description: "Check performance reports", path: "/reports" },
    { title: "About Us", description: "Learn more about our project", path: "/aboutus" }
  ];

  return (
    <div className="home-container">
      <h1 className="home-title">Smart Greenhouse Dashboard</h1>
      <p className="home-subtitle">Navigate through the system</p>

      <div className="home-grid">
        {pages.map((page, i) => (
          <Link to={page.path} key={i} className="home-card">
            <h2>{page.title}</h2>
            <p>{page.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
