import React, { useState, useEffect } from "react";
import { db } from "../components/firebase"; // your firebase config
import { doc, getDoc, setDoc } from "firebase/firestore";
import "./control.css";

function Control() {
  const switches = [
    { id: "fan", label: "Fan Control" },
    { id: "pump", label: "Irrigation Pump" },
    { id: "light", label: "Grow Light" },
    { id: "motor", label: "Door Motor" },
  ];

  const [values, setValues] = useState({});

  useEffect(() => {
    const fetchValues = async () => {
      const snapshot = await getDoc(doc(db, "Controls", "esp32"));
      if (snapshot.exists()) {
        setValues(snapshot.data());
      }
    };
    fetchValues();
  }, []);
  
  const handleToggle = async (id, direction) => {
    let newValue;
    if (id === "motor") {
      const current = values[id];
      if (direction === "plus") {
        if (current === 0) newValue = 90;
        else if (current === 90) newValue = 180;
        else if (current === 180) newValue = 0;
        else newValue = 0;
      } else if (direction === "minus") {
        if (current === 0) newValue = 180;
        else if (current === 90) newValue = 0;
        else if (current === 180) newValue = 90;
        else newValue = 0;
      }
    } else {
      newValue = values[id] === 1 ? 0 : 1;
    }
    await setDoc(doc(db, "Controls", "esp32"), { [id]: newValue }, { merge: true });  
    setValues((prev) => ({ ...prev, [id]: newValue }));
  };

  return (
    <div className="control-container">
      <h1 className="control-title">Greenhouse Control Panel</h1>
      <p className="control-subtitle">Toggle devices on/off</p>

      <div className="control-grid">
        {switches.map((sw, i) => {
          const isOn = values[sw.id] === 1;
          const motorValue = values[sw.id];
          const cardClass = sw.id === "motor" ? `control-card motor-${motorValue}` : `control-card ${isOn ? "on" : "off"}`;
          return (
            <div
              key={i}
              className={cardClass}
              onClick={sw.id !== "motor" ? () => handleToggle(sw.id) : undefined}
            >
              <h2>{sw.label}</h2>
              <p>Status: {sw.id === "motor" ? `Position: ${motorValue}°` : (isOn ? "ON" : "OFF")}</p>
              {sw.id === "motor" && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <button className="motor-button" onClick={(e) => { e.stopPropagation(); handleToggle(sw.id, "minus"); }}>-</button>
                  <button className="motor-button" onClick={(e) => { e.stopPropagation(); handleToggle(sw.id, "plus"); }}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Control;
