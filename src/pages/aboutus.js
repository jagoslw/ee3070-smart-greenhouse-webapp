import React from "react";
import "./aboutus.css";

function About() {
  return (
    <div className="about-container">
      <section className="about-hero">
        <h1>About Us</h1>
        <p>Building IOT project for EE3070 Design Project, CityU</p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            We aim to leverage technology and innovation to create intelligent
            systems that improve efficiency, sustainability, and everyday life.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            To empower communities with smart solutions that make environments
            healthier, greener, and more connected.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Team</h2>
          <p>
            A passionate group of engineers, designers, and innovators dedicated
            to turning ideas into impactful realities.
          </p>
        </div>
      </section>
      <section className="about-hero">
        <h1>Team Members</h1>
      </section>
      <section>
        <div className="about-content">
            <div className="about-card">
                <h2>Cheng Tsz Hing</h2>
                <p1>Team Leader & Hardware Engineer</p1>
                <p>

                </p>
            </div>
            <div className="about-card">
                <h2>Ip Kwun Shing</h2>
                <p1>AI module Engineer</p1>
                <p>
                    
                </p>
            </div>
            <div className="about-card">
                <h2>Ng Chun Man</h2>
                <p1>Backend Engineer</p1>
                <p>

                </p>
            </div>
            <div className="about-card">
                <h2>So Long Wang</h2>
                <p1>Frontend Engineer</p1>
                <p>

                </p>
            </div>
        </div>
      </section>
        <section className="about-hero">
            <h1> </h1>
        <div className="about-card">
            <h2>Powered by</h2>
            <p>
                ESP32 (multiple!), React, Firebase, and a lot of coffee!
            </p>
        </div>
        </section>
    </div>
  );
}

export default About;
