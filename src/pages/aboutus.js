import React from "react";
import "./aboutus.css";

function About() {
  const team = [
    { name: "Cheng Tsz Hing", role: "Team Leader & Hardware Engineer", desc: "System architecture and ESP32 hardware integration." },
    { name: "Ip Kwun Shing", role: "AI Module Engineer", desc: "Computer vision and fruit recognition logic." },
    { name: "Ng Chun Man", role: "Backend Engineer", desc: "Firebase RTDB infrastructure and data synchronization." },
    { name: "So Long Wang", role: "Frontend Engineer", desc: "React dashboard design and real-time visualization." }
  ];

  return (
    <div className="about-container">
      <section className="about-hero">
        <h1 className="glitch-text">About Project</h1>
        <p className="project-code">EE3070 Design Project | City University of Hong Kong</p>
        <p className="project-desc">Building a Smart Greenhouse Ecosystem with IoT & AI</p>
      </section>

      <section className="about-content">
        <div className="about-card mission">
          <h2>Our Mission</h2>
          <p>Leveraging IoT technology to create intelligent systems that improve agricultural efficiency and sustainability.</p>
        </div>
        <div className="about-card vision">
          <h2>Our Vision</h2>
          <p>To empower urban farming with smart solutions that make environments greener and more connected.</p>
        </div>
      </section>

      <section className="team-section">
        <h1 className="section-title">Development Team</h1>
        <div className="team-grid">
          {team.map((member, index) => (
            <div className="member-card" key={index}>
              <div className="member-info">
                <h3>{member.name}</h3>
                <span className="member-role">{member.role}</span>
                <p className="member-desc">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="tech-stack">
        <div className="tech-card">
          <h2>Powered By</h2>
          <div className="tech-tags">
            <span>ESP32 (Dual-Core)</span>
            <span>React.js</span>
            <span>Firebase RTDB</span>
            <span>Firestore</span>
            <span>FreeRTOS</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;