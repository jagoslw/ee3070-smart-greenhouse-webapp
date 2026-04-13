import React from "react";
import SensorCard from "./SensorCard";
import { useSensors } from "./useDHTSensors";
import { useYoloSensors } from "./useYOLOSensors"; // New Hook
import { sensorDefinitions } from "./DHTSensorsConfig";
import { yoloDefinitions } from "./YOLOSensorsConfig";

function DHT() {
  const dhtData = useSensors();
  const yoloData = useYoloSensors();

  const timestamp = dhtData.Timestamp 
    ? (dhtData.Timestamp.toDate?.() || new Date(dhtData.Timestamp)).toLocaleString() 
    : "SYNCING...";

  // Group definitions by their 'group' property
  const groups = ["Vital", "Nutrients", "Resources", "YOLO Detection"];

  return (
    <div className="sensor-page-modern">
      <header className="sensor-header-v2">
        <div className="header-content">
          <h1>AGiVEMS <span className="highlight">Intelligence</span></h1>
          <div className="pulse-container">
            <span className="pulse-dot"></span>
            <p>Live Telemetry: {timestamp}</p>
          </div>
        </div>
      </header>

      {groups.map(groupName => (
        <div key={groupName} className="sensor-section">
          <h2 className="section-title">{groupName}</h2>
          <div className="sensor-grid">
            {sensorDefinitions
              .filter(def => def.group === groupName)
              .map((def, i) => (
                <SensorCard
                  key={i}
                  sensorName={def.label}
                  value={def.format(dhtData)}
                  unit={def.unit}
                  statusFn={def.status}
                />
              ))}
            {yoloDefinitions
              .filter(def => def.group === groupName)
              .map((def, i) => (
                <SensorCard
                  key={i}
                  sensorName={def.label}
                  value={def.format(yoloData)}
                  unit={def.unit}
                  statusFn={def.status}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default DHT;