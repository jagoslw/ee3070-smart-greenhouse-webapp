export const sensorDefinitions = [
  // --- ENVIRONMENTAL GROUP ---
  {
    key: "Temperature_C",
    group: "Vital",
    label: "Temperature",
    unit: "°C",
    format: (data) => data.Temperature_C ?? null,
    status: (v) => v < 15 || v > 35 
      ? { label: "Outside Safe Range", tone: "bad" } 
      : { label: "Optimal", tone: "good" }
  },
  {
    key: "Humidity",
    group: "Vital",
    label: "Humidity",
    unit: "%",
    format: (data) => data.Humidity ?? null,
    status: (v) => v < 30 ? { label: "Too Dry", tone: "bad" } : { label: "Sufficient", tone: "good" }
  },
  // --- SOIL & NUTRIENTS ---
  {
    key: "Moisture",
    group: "Vital",
    label: "Soil Moisture",
    unit: "%",
    format: (data) => data.Moisture ?? null,
    status: (v) => v < 30 ? { label: "Critical", tone: "bad" } : { label: "Ideal", tone: "good" }
  },
  {
    key: "Nitrogen",
    group: "Nutrients",
    label: "Nitrogen",
    unit: "mg/KG",
    format: (data) => data.Nitrogen ?? null,
    status: (v) => v < 20 ? { label: "Low", tone: "bad" } : { label: "Healthy", tone: "good" }
  },
  {
    key: "Phosphorous",
    group: "Nutrients",
    label: "Phosphorous",
    unit: "mg/KG",
    format: (data) => data.Phosphorous ?? null,
    status: (v) => v < 20 ? { label: "Low", tone: "bad" } : { label: "Healthy", tone: "good" }
  },
  {
    key: "Potassium",
    group: "Nutrients",
    label: "Potassium",
    unit: "mg/KG",
    format: (data) => data.Potassium ?? null,
    status: (v) => v < 20 ? { label: "Low", tone: "bad" } : { label: "Healthy", tone: "good" }
  },
  // --- TANK LEVELS ---
  {
    key: "Waterlevel",
    group: "Resources",
    label: "Water Reservoir",
    unit: "%",
    format: (data) => data.Waterlevel ?? null,
    status: (v) => v < 30 ? { label: "Refill Required", tone: "bad" } : { label: "Adequate", tone: "good" }
  },
  {
    key: "Fertilizerlevel",
    group: "Resources",
    label: "Fertilizer Reservoir",
    unit: "%",
    format: (data) => data.FertLevel ?? null,
    status: (v) => v < 30 ? { label: "Refill Required", tone: "bad" } : { label: "Adequate", tone: "good" }
  },
];