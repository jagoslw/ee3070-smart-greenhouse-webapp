import React from "react";

function SensorCard({ sensorName, value, unit, statusFn }) {
  const numericValue = value != null ? Number(value) : null;
  const { label, tone } = numericValue != null && !Number.isNaN(numericValue)
    ? statusFn(numericValue)
    : { label: "N/A", tone: "neutral" };

  return (
    <div className="sensor-card">
      <h4 className="sensor-title">{sensorName}</h4>
      <div className="sensor-value">
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
