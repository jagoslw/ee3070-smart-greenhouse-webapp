import React from "react";
import SensorCard from "./SensorCard";
import { useSensors } from "./useDHTSensors";
import { sensorDefinitions } from "./DHTSensorsConfig";

function DHT() {
  const DHTData = useSensors();

  // Separate meta-data (timestamp) from actual sensor levels// Inside DHT.js - Change how the timestamp is handled
  const timestamp = DHTData.Timestamp 
    ? (typeof DHTData.Timestamp.toDate === "function" 
        ? DHTData.Timestamp.toDate().toLocaleString() 
        : new Date(DHTData.Timestamp).toLocaleString())
    : "CONNECTING TO SENSOR...";
  // Filter out non-gauge items (Timestamp and Fahrenheit) to keep grid clean
  const displaySensors = sensorDefinitions.filter(
    def => def.key !== "Timestamp"
  );

  return (
    <div className="sensor-page-container">
      <header className="sensor-header">
        <h3 className="sensor-legend">Environmental Levels</h3>
        <p className="system-heartbeat">LAST SYNC: {timestamp}</p>
      </header>

      <section className="sensor-grid">
        {displaySensors.map((def, i) => (
          <SensorCard
            key={i}
            sensorName={def.label}
            value={def.format(DHTData)}
            unit={def.unit}
            statusFn={def.status}
          />
        ))}
      </section>
    </div>
  );
}

export default DHT;