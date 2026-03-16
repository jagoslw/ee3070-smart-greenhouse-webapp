import React, { useEffect, useState } from "react";

function SensorCard({ sensorName, value, unit, statusFn }) {
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    if (value != null) {
      setGlow(true);
      const timer = setTimeout(() => setGlow(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const numericValue = value != null ? Number(value) : null;
  const { label, tone } = numericValue != null && !Number.isNaN(numericValue)
    ? statusFn(numericValue)
    : { label: "N/A", tone: "neutral" };

  return (
    <div className="sensor-card">
      <h4 className="sensor-title">{sensorName}</h4>
      <div className={`sensor-value ${glow ? "glow-green" : ""}`}>
        {value != null ? `${value} ${unit}` : "N/A"}
      </div>
      <div
        className={`sensor-status ${
          tone === "good" ? "status-good" : tone === "bad" ? "status-bad" : "status-neutral"
        }`}
      >
        {label}
      </div>
    </div>
  );
}

export default SensorCard;
