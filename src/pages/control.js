import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; 
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import "./control.css";

function Control() {
  const [values, setValues] = useState({});
  const [sensorData, setSensorData] = useState({});
  const [isDisconnected, setIsDisconnected] = useState(false);

  const deviceSwitches = [
    { id: "FanDecision", label: "Fan Control", prefix: "FAN" },
    { id: "WaterDecision", label: "Irrigation Pump", prefix: "WATER" },
    { id: "LEDDecision", label: "Grow Light", prefix: "LED" },
    { id: "FertDecision", label: "Fertilizer Pump", prefix: "FERT" },
  ];

  const colorOptions = ["white", "red", "yellow", "green", "purple"];

  // 核心：控制全螢幕 Body 背景顏色
  useEffect(() => {
    if (isDisconnected) {
      document.body.classList.add("global-offline-bg");
      document.body.classList.remove("global-online-bg");
    } else {
      document.body.classList.add("global-online-bg");
      document.body.classList.remove("global-offline-bg");
    }

    // 當離開此頁面時，清除背景類名，避免影響其他頁面
    return () => {
      document.body.classList.remove("global-offline-bg");
      document.body.classList.remove("global-online-bg");
    };
  }, [isDisconnected]);

  useEffect(() => {
    const unsubControls = onSnapshot(doc(db, "Controls", "ai"), (snapshot) => {
      if (snapshot.exists()) setValues(snapshot.data());
    });

    const unsubSensors = onSnapshot(doc(db, "Environment", "0000000"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSensorData(data);

        let timeDisconnected = false;
        if (data.timestamp) {
          const lastUpdateMillis = data.timestamp.seconds ? data.timestamp.seconds * 1000 : new Date(data.timestamp).getTime();
          timeDisconnected = (Date.now() - lastUpdateMillis > 45000);
        }
        
        const allZero = (data.Temperature_C === 0 && data.Humidity === 0 && data.Moisture === 0);
        setIsDisconnected(timeDisconnected || allZero);
      }
    });

    return () => { unsubControls(); unsubSensors(); };
  }, []);

  const handleToggle = async (id, prefix) => {
    const currentVal = String(values[id] || "");
    const isCurrentlyOn = currentVal.includes("_ON");
    const newValue = isCurrentlyOn ? `${prefix}_OFF` : `${prefix}_ON`;
    try {
      await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });
    } catch (e) { console.error("Firebase update failed", e); }
  };

  const handleColorChange = async (color) => {
    try {
      await setDoc(doc(db, "Controls", "ai"), { color: color.toUpperCase() }, { merge: true });
    } catch (e) { console.error("Color change failed", e); }
  };

  const isManualMode = String(values["ManControl"]).includes("MAN_ON");

  const getDeviceIcon = (id, isOn) => {
    switch (id) {
      case "FanDecision": return <span className={`device-icon ${isOn ? "icon-spin" : ""}`}>🌀</span>;
      case "WaterDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>💧</span>;
      case "LEDDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>💡</span>;
      case "FertDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>🧪</span>;
      case "ManControl": return <span className="device-icon">{isOn ? "🔓" : "🔒"}</span>;
      default: return <span className="device-icon">⚙️</span>;
    }
  };

  

  return (
    <div className={`control-container fade-in-up ${isDisconnected ? "disconnected" : ""}`}>
      <h1 className="control-title">Oasis Command</h1>

      {/* 狀態列：現在手機與 PC 都顯示這個 */}
      <div className="status-bar">
        <div className="status-item">
          <span className="label">TEMP</span>
          <span className="value">{sensorData.Temperature_C ?? "--"}°C</span>
        </div>
        <div className="status-divider">|</div>
        <div className="status-item">
          <span className="label">HUMIDITY</span>
          <span className="value">{sensorData.Humidity ?? "--"}%</span>
        </div>
        <div className="status-divider">|</div>
        <div className="status-item">
          <span className="label">MOISTURE</span>
          <span className="value">{sensorData.Moisture ?? "--"}%</span>
        </div>
        <div className="status-divider">|</div>
        <div className="status-item">
          <span className="label">STATUS</span>
          <span className={`value ${isDisconnected ? "error" : "glow"}`}>
            {isDisconnected ? "OFFLINE" : "ONLINE"}
          </span>
        </div>
      </div>

      <p className="control-subtitle">{isManualMode ? "🔓 Manual Control Enabled" : "🔒 AI Autopilot Mode"}</p>

      <div className="main-layout-wrapper">
        <div 
          className={`control-card wide-card ${isManualMode ? "on neon-active" : "off"}`}
          onClick={() => handleToggle("ManControl", "MAN")}
        >
          <div className="card-content-horizontal">
            {getDeviceIcon("ManControl", isManualMode)}
            <div className="text-group">
              <h2>Manual Override System</h2>
              <div className="status-badge">{isManualMode ? "MANUAL" : "AI AUTO"}</div>
            </div>
          </div>
        </div>

        <div className="control-grid-four">
          {deviceSwitches.map((sw, i) => {
            const valStr = String(values[sw.id] || "");
            const isOn = valStr.endsWith("_ON");
            return (
              <div key={i} className={`control-card ${isOn ? "on neon-active" : "off"}`}
                style={{ cursor: isManualMode ? "pointer" : "not-allowed", filter: isManualMode ? "none" : "brightness(0.7)" }}
                onClick={isManualMode ? () => handleToggle(sw.id, sw.prefix) : undefined}>
                {!isManualMode && <div className="lock-tag">AI ACTIVE</div>}
                {getDeviceIcon(sw.id, isOn)}
                <h2>{sw.label}</h2>
                <div className="status-badge">{isOn ? "On" : "Off"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="color-selection-section">
        <h3>LED LIGHT SPECTRUM</h3>
        <div className="color-btn-wrapper">
          {colorOptions.map((color) => {
            const isSelected = String(values.color).toUpperCase() === color.toUpperCase();
            return (
              <button key={color} className={`color-btn ${isSelected ? "selected" : ""}`}
                onClick={() => handleColorChange(color)}
                style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 20px ${color}` : 'none', cursor: "pointer" }} />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Control;