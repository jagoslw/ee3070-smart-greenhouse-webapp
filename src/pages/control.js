import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; 
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import "./control.css";

function Control() {
  const [values, setValues] = useState({});
  const [sensorData, setSensorData] = useState({});
  const [isDisconnected, setIsDisconnected] = useState(false);

  const [selectedTimeouts, setSelectedTimeouts] = useState({
    FanDecision: 7200,   // 2 hours default
    WaterDecision: 300,  // 5 mins default
    LEDDecision: 28800,  // 8 hours default
    FertDecision: 300    // 5 mins default
  });

  const timeoutOptions = [
    { label: "5 Minutes", value: 300 },
    { label: "15 Minutes", value: 900 },
    { label: "30 Minutes", value: 1800 },
    { label: "1 Hour", value: 3600 },
    { label: "2 Hours", value: 7200 },
    { label: "4 Hours", value: 14400 },
    { label: "8 Hours", value: 28800 },
    { label: "12 Hours", value: 43200 },
    { label: "24 Hours", value: 86400 },
  ];

  const deviceSwitches = [
    { id: "FanDecision", label: "Fan Control" },
    { id: "WaterDecision", label: "Irrigation Pump" },
    { id: "LEDDecision", label: "Grow Light" },
    { id: "FertDecision", label: "Fertilizer Pump" },
  ];

  const colorOptions = ["white", "red", "yellow", "green", "purple"];

  useEffect(() => {
    const themeClass = isDisconnected ? "global-offline-bg" : "global-online-bg";
    document.body.classList.add(themeClass);
    return () => document.body.classList.remove("global-offline-bg", "global-online-bg");
  }, [isDisconnected]);

  useEffect(() => {
    const unsubControls = onSnapshot(doc(db, "Controls", "ai"), (snapshot) => {
      if (snapshot.exists()) setValues(snapshot.data());
    });

    const unsubSensors = onSnapshot(doc(db, "Environment", "0000000"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSensorData(data);
        const lastUpdate = data.timestamp?.seconds ? data.timestamp.seconds * 1000 : new Date(data.timestamp).getTime();
        setIsDisconnected(Date.now() - lastUpdate > 45000 || (data.Temperature_C === 0 && data.Humidity === 0));
      }
    });

    return () => { unsubControls(); unsubSensors(); };
  }, []);

  const handleToggle = async (id) => {
    const currentVal = String(values[id] || "");
    const isAuto = currentVal.includes("AUTO");
    
    // 🔥 NEW LOGIC: Block clicks only if it is in AUTO mode
    if (isAuto) return;

    const isCurrentlyOn = currentVal.includes("_ON");
    const nextStatus = isCurrentlyOn ? "OFF" : "ON";
    
    // Maintain the current prefix (LOCK or MAN)
    const prefix = currentVal.includes("LOCK") ? "LOCK" : "MAN";
    const newValue = `${prefix}_${nextStatus}`;

    try {
      await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });
    } catch (e) { console.error("Toggle failed", e); }
  };

  const handleModeToggle = async (e, id) => {
    e.stopPropagation(); 
    const currentVal = String(values[id] || "");
    const isAuto = currentVal.includes("AUTO");
    const isCurrentlyOn = currentVal.includes("_ON");
    const status = isCurrentlyOn ? "ON" : "OFF";
    
    const nextMode = isAuto ? "MAN" : "AUTO";
    const newValue = `${nextMode}_${status}`;
  
    try {
      const payload = { [id]: newValue };
      
      if (isAuto) { 
          // 🔥 2. When switching to MAN, send the chosen Limit from state
          payload[`${id}_Limit`] = selectedTimeouts[id];
      } else {
          // Releasing to AI: Clean up
          payload[`${id}_ExpirationTime`] = null; 
      }
      
      await setDoc(doc(db, "Controls", "ai"), payload, { merge: true });
    } catch (e) { console.error("Mode switch failed", e); }
  };

  // New Lock function
  const handleLockToggle = async (e, id) => {
    e.stopPropagation();
    const currentVal = String(values[id] || "");
    const isCurrentlyOn = currentVal.includes("_ON");
    const isLocked = currentVal.includes("LOCK");
    const status = isCurrentlyOn ? "ON" : "OFF";

    // Toggle between LOCK and AUTO
    const newValue = isLocked ? `AUTO_${status}` : `LOCK_${status}`;

    try {
      await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });
    } catch (e) { console.error("Lock toggle failed", e); }
  };

  const handleColorChange = async (color) => {
    try {
      await setDoc(doc(db, "Controls", "ai"), { color: color.toUpperCase() }, { merge: true });
    } catch (e) { console.error("Color change failed", e); }
  };

  const getDeviceIcon = (id, isOn) => {
    switch (id) {
      case "FanDecision": return <span className={`device-icon ${isOn ? "icon-spin" : ""}`}>🌀</span>;
      case "WaterDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>💧</span>;
      case "LEDDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>💡</span>;
      case "FertDecision": return <span className={`device-icon ${isOn ? "icon-pulse" : ""}`}>🧪</span>;
      default: return <span className="device-icon">⚙️</span>;
    }
  };

  // No more TIMEOUT_CONFIG needed here!

  function ExpiryTimer({ expirationTime }) {
    const [timeLeft, setTimeLeft] = useState("");
  
    useEffect(() => {
      const calculate = () => {
        const nowInSeconds = Date.now() / 1000;
        const remaining = expirationTime - nowInSeconds;
  
        if (remaining <= 0) {
          setTimeLeft("REVERTING...");
          return true; 
        } else {
          const h = Math.floor(remaining / 3600);
          const m = Math.floor((remaining % 3600) / 60);
          const s = Math.floor(remaining % 60);
          
          // Still formats nicely, but doesn't care about device types
          const display = h > 0 
            ? `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
            : `${m}:${s < 10 ? '0' : ''}${s}`;
              
          setTimeLeft(display);
          return false;
        }
      };
  
      calculate();
      const interval = setInterval(() => {
        if (calculate()) clearInterval(interval);
      }, 1000);
  
      return () => clearInterval(interval);
    }, [expirationTime]);
  
    return <span className="timer-val">{timeLeft}</span>;
  }

  return (
    <div className={`control-container fade-in-up ${isDisconnected ? "disconnected" : ""}`}>
      <h1 className="control-title">AGiVEMS Command</h1>

      <div className="status-bar">
        <div className="status-item"><span className="label">TEMP: </span><span className="value">{sensorData.Temperature_C ?? "--"}°C</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">HUMIDITY: </span><span className="value">{sensorData.Humidity ?? "--"}%</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">MOISTURE: </span><span className="value">{sensorData.Moisture ?? "--"}%</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">STATUS: </span><span className={`value ${isDisconnected ? "error" : "glow"}`}>{isDisconnected ? "OFFLINE" : "ONLINE"}</span></div>
      </div>

      <div className="main-layout-wrapper">
      <div className="control-grid-four">
      {deviceSwitches.map((sw, i) => {
        const valStr = String(values[sw.id] || "");
        const isOn = valStr.includes("_ON");
        const isAuto = valStr.includes("AUTO");
        const isLocked = valStr.includes("LOCK");
        const isManual = valStr.includes("MAN");

        return (
          <div key={i} className={`control-card ${isOn ? "on" : "off"} ${isAuto ? "is-auto" : ""} ${isLocked ? "locked-state" : ""}`}>
            
            <button className="thin-lock-btn" onClick={(e) => handleLockToggle(e, sw.id)}>
              {isLocked ? "🔓 UNLOCK" : "🔒 LOCK"}
            </button>

            <div className="card-main-area" onClick={() => handleToggle(sw.id)}>
              <div className="mode-indicator">
                {isLocked ? "🚫 LOCKED" : isManual ? "👤 MANUAL" : "🤖 AI AUTO"}
              </div>
              
              {getDeviceIcon(sw.id, isOn)}
              <h2>{sw.label}</h2>
              
              <div className="status-badge">
                {isAuto ? "AI MANAGED" : (isOn ? "ACTIVE" : "IDLE")}
              </div>

              {isManual && values[`${sw.id}_ExpirationTime`] && (
                <div className="expiration-timer">
                  AI TAKEOVER IN: 
                  <ExpiryTimer expirationTime={values[`${sw.id}_ExpirationTime`]} />
                </div>
              )}
            </div>

            {/* 🔥 3. NEW: Timeout Dropdown Selection */}
            <div className="timeout-selector-area">
              <label>AUTO-REVERT AFTER:</label>
              <select 
                value={selectedTimeouts[sw.id]} 
                disabled={isManual} // Gray out when in Manual
                onChange={(e) => setSelectedTimeouts({
                  ...selectedTimeouts, 
                  [sw.id]: Number(e.target.value)
                })}
              >
                {timeoutOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <button 
              className={`mode-toggle-btn ${!isAuto ? "btn-to-auto" : "btn-to-man"}`}
              onClick={(e) => handleModeToggle(e, sw.id)}
            >
              {!isAuto ? "RELEASE TO AI" : "TAKE MANUAL CONTROL"}
            </button>
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
                style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 20px ${color}` : 'none' }} />
            );
          })}
        </div>
      </div>
      {/* --- Added System Logic Guide --- */}
      <div className="system-logic-guide">
        <div className="guide-item">
          <span className="guide-title">🤖 AI AUTO</span>
          <p>The neural network manages the environment based on real-time sensor data to optimize plant growth.</p>
        </div>
        <div className="guide-item">
          <span className="guide-title">👤 MANUAL</span>
          <p>Temporary user override. The system will revert to AI control after a safety timeout period expires.</p>
        </div>
        <div className="guide-item">
          <span className="guide-title">🔒 LOCK</span>
          <p>Permanent manual override. Disables AI control for this component until manually unlocked by the user.</p>
        </div>
      </div>
    </div>
  );
}

export default Control;