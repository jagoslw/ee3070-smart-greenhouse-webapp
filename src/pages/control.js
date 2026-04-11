import React, { useState, useEffect } from "react";
import { db, rtdb } from "../components/firebase"; 
import { doc, onSnapshot } from "firebase/firestore";
import { ref, update, onValue } from "firebase/database";
import "./control.css";

function Control() {
  const [values, setValues] = useState({});
  const [sensorData, setSensorData] = useState({});
  const [isDisconnected, setIsDisconnected] = useState(false);

  const [selectedTimeouts, setSelectedTimeouts] = useState({
    FanDecision: 7200,   
    WaterDecision: 300,  
    LEDDecision: 28800,  
    FertDecision: 300    
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
    // 1. Listen to RTDB for Controls (Using rtdb)
    const controlsRef = ref(rtdb, "Controls");
    const unsubControls = onValue(controlsRef, (snapshot) => {
      if (snapshot.exists()) setValues(snapshot.val());
    });

    // 2. Listen to Firestore for Sensors (Using db)
    const unsubSensors = onSnapshot(doc(db, "Environment", "0000000"), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setSensorData(data);
        const lastUpdate = data.timestamp?.seconds 
          ? data.timestamp.seconds * 1000 
          : new Date(data.timestamp).getTime();
        setIsDisconnected(Date.now() - lastUpdate > 45000 || (data.Temperature_C === 0 && data.Humidity === 0));
      }
    });

    return () => { unsubControls(); unsubSensors(); };
  }, []);

  const handleToggle = async (id) => {
    const currentVal = String(values[id] || "");
    if (currentVal.includes("AUTO")) return;

    const isCurrentlyOn = currentVal.includes("_ON");
    const nextStatus = isCurrentlyOn ? "OFF" : "ON";
    const prefix = currentVal.includes("LOCK") ? "LOCK" : "MAN";
    const newValue = `${prefix}_${nextStatus}`;

    try {
      // WRITE TO RTDB
      await update(ref(rtdb, "Controls"), { [id]: newValue });
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
          payload[`${id}_Limit`] = selectedTimeouts[id];
      } else {
          payload[`${id}_ExpirationTime`] = null; // RTDB deletes on null
      }
      // WRITE TO RTDB
      await update(ref(rtdb, "Controls"), payload);
    } catch (e) { console.error("Mode switch failed", e); }
  };

  const handleLockToggle = async (e, id) => {
    e.stopPropagation();
    const currentVal = String(values[id] || "");
    const status = currentVal.includes("_ON") ? "ON" : "OFF";
    const newValue = currentVal.includes("LOCK") ? `AUTO_${status}` : `LOCK_${status}`;

    try {
      // WRITE TO RTDB
      await update(ref(rtdb, "Controls"), { [id]: newValue });
    } catch (e) { console.error("Lock toggle failed", e); }
  };

  const handleColorChange = async (color) => {
    try {
      // WRITE TO RTDB
      await update(ref(rtdb, "Controls"), { color: color.toUpperCase() });
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

  function ExpiryTimer({ expirationTime }) {
    const [timeLeft, setTimeLeft] = useState("");
    useEffect(() => {
      const calculate = () => {
        const remaining = expirationTime - (Date.now() / 1000);
        if (remaining <= 0) {
          setTimeLeft("REVERTING...");
          return true; 
        }
        const h = Math.floor(remaining / 3600);
        const m = Math.floor((remaining % 3600) / 60);
        const s = Math.floor(remaining % 60);
        setTimeLeft(h > 0 ? `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}` : `${m}:${s < 10 ? '0' : ''}${s}`);
        return false;
      };
      calculate();
      const interval = setInterval(() => { if (calculate()) clearInterval(interval); }, 1000);
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
                  <div className="mode-indicator">{isLocked ? "🚫 LOCKED" : isManual ? "👤 MANUAL" : "🤖 AI AUTO"}</div>
                  {getDeviceIcon(sw.id, isOn)}
                  <h2>{sw.label}</h2>
                  <div className="status-badge">{isAuto ? "AI MANAGED" : (isOn ? "ACTIVE" : "IDLE")}</div>
                  {isManual && values[`${sw.id}_ExpirationTime`] && (
                    <div className="expiration-timer">
                      AI TAKEOVER IN: <ExpiryTimer expirationTime={values[`${sw.id}_ExpirationTime`]} />
                    </div>
                  )}
                </div>

                <div className="timeout-selector-area">
                  <label>AUTO-REVERT AFTER:</label>
                  <select 
                    value={selectedTimeouts[sw.id]} 
                    disabled={isManual} 
                    onChange={(e) => setSelectedTimeouts({...selectedTimeouts, [sw.id]: Number(e.target.value)})}
                  >
                    {timeoutOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                
                <button className={`mode-toggle-btn ${!isAuto ? "btn-to-auto" : "btn-to-man"}`} onClick={(e) => handleModeToggle(e, sw.id)}>
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
    </div>
  );
}

export default Control;