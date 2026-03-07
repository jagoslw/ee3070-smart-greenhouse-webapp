import React, { useState } from "react";

function ControlPanel() {
  const [pumpOn, setPumpOn] = useState(false);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Control Panel</h2>
      <button
        onClick={() => setPumpOn(!pumpOn)}
        style={{
          padding: "10px 20px",
          backgroundColor: pumpOn ? "green" : "gray",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        {pumpOn ? "Pump ON" : "Pump OFF"}
      </button>
    </div>
  );
}

export default ControlPanel;
