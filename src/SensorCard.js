import React from "react";

function SensorCard({ sensorName, value }) {
    const numericValue = parseFloat(value);

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "8px",
      padding: "12px",
      margin: "8px",
      backgroundColor: "#f9f9f9"
    }}>
 
    <h3>{sensorName}</h3>
      <p style={{ fontSize: "18px" }}>{value}</p>

      {/* Soil Moisture Warning */}
      {sensorName === "Soil Moisture" && numericValue < 30 && (
        <p style={{ color: "red" }}>⚠️ Soil moisture is too low!</p>
      )}
      {sensorName === "Soil Moisture" && numericValue >= 30 && (
        <p style={{ color: "green" }}>✅ Soil moisture is sufficient</p>
      )}

      {/* Temperature Warning */}
      {sensorName === "Temperature" && numericValue > 35 && (
        <p style={{ color: "red" }}>🔥 Temperature is too high!</p>
      )}
      {sensorName === "Temperature" && numericValue < 15 && (
        <p style={{ color: "blue" }}>❄️ Temperature is too low!</p>
      )}
      {sensorName === "Temperature" && numericValue >= 15 && numericValue <= 35 && (
        <p style={{ color: "green" }}>✅ Temperature is in the safe range</p>
      )}
    </div>
  );
}

export default SensorCard;
