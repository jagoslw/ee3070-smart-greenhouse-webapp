import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; 
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./control.css";

function Control() {
  const [values, setValues] = useState({});

  const switches = [
    { id: "ManControl", label: "Manual Override (AI Off)" },
    { id: "FanDecision", label: "Fan Control" },
    { id: "WaterDecision", label: "Irrigation Pump" },
    { id: "LEDDecision", label: "Grow Light" },
    { id: "FertDecision", label: "Fertilizer Pump" },
  ];

  // 定義顏色選項
  const colorOptions = ["white", "red", "yellow", "green", "purple"];

  useEffect(() => {
    const fetchValues = async () => {
      const snapshot = await getDoc(doc(db, "Controls", "ai"));
      if (snapshot.exists()) {
        setValues(snapshot.data());
      }
    };
    fetchValues();
  }, []);
  
  const handleToggle = async (id) => {
    let newValue = values[id] === 1 ? 0 : 1;
    await setDoc(doc(db, "Controls", "ai"), { [id]: newValue }, { merge: true });  
    setValues((prev) => ({ ...prev, [id]: newValue }));
  };

  // 新增：處理顏色更新的函數
  const handleColorChange = async (color) => {
    await setDoc(doc(db, "Controls", "ai"), { color: color }, { merge: true });
    setValues((prev) => ({ ...prev, color: color }));
  };

  const isManualMode = values["ManControl"] === 1;

  return (
    <div className="control-container">
      <h1 className="control-title">Greenhouse Control Panel</h1>
      <p className="control-subtitle">
        {isManualMode ? "⚠️ Manual Control Enabled" : "🤖 AI Auto-Pilot Active"}
      </p>

      {/* --- 設備開關區塊 --- */}
      <div className="control-grid">
        {switches.map((sw, i) => {
          const isOn = values[sw.id] === 1;
          const canClick = sw.id === "ManControl" || isManualMode;
          const cardClass = `control-card ${isOn ? "on" : "off"}`;

          return (
            <div
              key={i}
              className={cardClass}
              style={{ 
                cursor: canClick ? "pointer" : "not-allowed",
                filter: canClick ? "none" : "brightness(0.8)",
              }}
              onClick={canClick ? () => handleToggle(sw.id) : undefined}
            >
              <h2>{sw.label}</h2>
              <p>Status: {isOn ? "ON" : "OFF"}</p>
              {!canClick && <div className="lock-tag">🔒 AI Active</div>}
            </div>
          );
        })}
      </div>

      {/* --- 新增：LED 顏色選擇區塊 --- */}
      <div className="color-selection-section" style={{ marginTop: '30px', textAlign: 'center' }}>
        <h3>LED Spectrum Color</h3>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '10px' }}>
          {colorOptions.map((color) => {
            const isSelected = values.color === color;
            return (
              <button
                key={color}
                onClick={isManualMode ? () => handleColorChange(color) : undefined}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  border: isSelected ? '4px solid #fff' : '2px solid #555',
                  boxShadow: isSelected ? `0 0 15px ${color}` : 'none',
                  cursor: isManualMode ? 'pointer' : 'not-allowed',
                  opacity: isManualMode || isSelected ? 1 : 0.3,
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.2)' : 'scale(1)'
                }}
                title={color.charAt(0).toUpperCase() + color.slice(1)}
              />
            );
          })}
        </div>
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#ccc' }}>
          Current Selection: <strong>{values.color || "None"}</strong>
        </p>
      </div>
    </div>
  );
}

export default Control;