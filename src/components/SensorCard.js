import React, { useEffect, useState } from "react";

function SensorCard({ sensorName, value, unit, statusFn }) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (value != null) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 600);
      return () => clearTimeout(timer);
    }
  }, [value]);

  const numericValue = value != null ? parseFloat(value) : 0;
  const { label, tone } = statusFn(numericValue);

  // Simple logic to determine progress bar width
  // (Assuming most sensors are 0-100%, except NPK which we cap for visual)
  const getProgressWidth = () => {
    if (unit === "mg/KG") return Math.min((numericValue / 300) * 100, 100); 
    return Math.min(numericValue, 100);
  };

  return (
    <div className="sensor-card">
      <h4 className="sensor-title">{sensorName}</h4>
      
      <div className={`sensor-value ${pulse ? "glow-pulse" : ""}`}>
        {value != null ? value : "--"}
        <span style={{ fontSize: '1rem', marginLeft: '5px', color: '#555' }}>{unit}</span>
      </div>

      <div className={`sensor-status status-${tone}`}>
        {label}
      </div>

      {/* Visual Progress Bar */}
      <div className="sensor-progress-bg">
        <div 
          className="sensor-progress-fill" 
          style={{ 
            width: `${getProgressWidth()}%`,
            backgroundColor: tone === 'good' ? 'var(--neon-green)' : tone === 'bad' ? '#ff3b3b' : 'var(--neon-blue)'
          }}
        />
      </div>
    </div>
  );
}

export default SensorCard;