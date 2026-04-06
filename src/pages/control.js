import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; 
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import "./control.css";

function Control() {
  const [values, setValues] = useState({});
  const [sensorData, setSensorData] = useState({});
  const [isDisconnected, setIsDisconnected] = useState(false);

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

  // 修改後的開關邏輯：僅在手動模式下允許操作
  const handleToggle = async (id) => {
    const currentVal = String(values[id] || "");
    const isManual = currentVal.includes("MAN");
    
    // 如果不是手動模式，直接攔截，不允許操作開關
    if (!isManual) return;

    const isCurrentlyOn = currentVal.includes("_ON");
    const nextStatus = isCurrentlyOn ? "OFF" : "ON";
    const newValue = `MAN_${nextStatus}`; // 在手動模式下切換，輸出必定是 MAN_...

    try {
      await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });
    } catch (e) { console.error("Toggle failed", e); }
  };

  // 修改後的模式切換：輸出簡化格式
  const handleModeToggle = async (e, id) => {
    e.stopPropagation(); 
    const currentVal = String(values[id] || "");
    const isManual = currentVal.includes("MAN");
    const isCurrentlyOn = currentVal.includes("_ON");

    // 切換模式但保留目前的開關狀態
    const nextMode = isManual ? "AUTO" : "MAN";
    const status = isCurrentlyOn ? "ON" : "OFF";
    const newValue = `${nextMode}_${status}`; // 輸出：AUTO_ON, MAN_OFF 等

    try {
      await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });
    } catch (e) { console.error("Mode switch failed", e); }
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

  return (
    <div className={`control-container fade-in-up ${isDisconnected ? "disconnected" : ""}`}>
      <h1 className="control-title">AGiVEMS Command</h1>

      <div className="status-bar">
        <div className="status-item"><span className="label">TEMP</span><span className="value">{sensorData.Temperature_C ?? "--"}°C</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">HUMIDITY</span><span className="value">{sensorData.Humidity ?? "--"}%</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">MOISTURE</span><span className="value">{sensorData.Moisture ?? "--"}%</span></div>
        <div className="status-divider">|</div>
        <div className="status-item"><span className="label">STATUS</span><span className={`value ${isDisconnected ? "error" : "glow"}`}>{isDisconnected ? "OFFLINE" : "ONLINE"}</span></div>
      </div>

      <div className="main-layout-wrapper">
        <div className="control-grid-four">
        {deviceSwitches.map((sw, i) => {
          const valStr = String(values[sw.id] || "");
          const isOn = valStr.includes("_ON");
          const isManual = valStr.includes("MAN");

          return (
            <div key={i} className={`control-card ${isOn ? "on" : "off"} ${!isManual ? "is-locked" : ""}`}>
              <div className="card-main-area" onClick={() => handleToggle(sw.id)}>
                <div className="mode-indicator">
                  {/* 如果是 AI 模式，在文字後方加上鎖頭 */}
                  {isManual ? "👤 MANUAL" : "🤖 AI AUTO 🔒"}
                </div>
                
                {/* 這裡移除了原本的 lock-overlay div */}
                
                {getDeviceIcon(sw.id, isOn)}
                <h2>{sw.label}</h2>
                <div className="status-badge">{isOn ? "ACTIVE" : "IDLE"}</div>
              </div>
              
              <button 
                className={`mode-toggle-btn ${isManual ? "btn-to-auto" : "btn-to-man"}`}
                onClick={(e) => handleModeToggle(e, sw.id)}
              >
                {isManual ? "RELEASE TO AI" : "TAKE MANUAL CONTROL"}
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