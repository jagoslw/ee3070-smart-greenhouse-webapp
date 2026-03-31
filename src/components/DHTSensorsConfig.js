// sensorConfig.js
export const sensorDefinitions = [
  {
    key: "Humidity",
    label: "Humidity",
    unit: "%",
    format: (data) => data.Humidity ?? null,
    status: (v) => {
      if (v < 30) return { label: "Humidity is too low", tone: "bad" };
      return { label: "Humidity is sufficient", tone: "good" };
    }
  },
  {
    key: "Moisture",
    label: "Soil Moisture",
    unit: "%",
    format: (data) => data.Moisture ?? null,
    status: (v) => {
      if (v < 30) return { label: "Soil moisture is too low", tone: "bad" };
      return { label: "Soil moisture is sufficient", tone: "good" };
    }
  },
  {
    key: "Light",
    label: "Light",
    unit: "%",
    format: (data) => data.Light ?? null,
    status: () => ({ label: "OK", tone: "neutral" }) // add thresholds later if needed
  },{
    key: "Nitrogen",
    label: "Nitrogen",
    unit: "mg/KG",
    format: (data) => data.Nitrogen ?? null,
    status: (v) => v < 20
      ? { label: "Nitrogen is too low", tone: "bad" }
      : { label: "Nitrogen level is sufficient", tone: "good" }
  },
  {
    key: "Phosphorous",
    label: "Phosphorous",
    unit: "mg/KG",
    format: (data) => data.Phosphorous ?? null,
    status: (v) => v < 15
      ? { label: "Phosphorous is too low", tone: "bad" }
      : { label: "Phosphorous level is sufficient", tone: "good" }
  },
  {
    key: "Potassium",
    label: "Potassium",
    unit: "mg/KG",
    format: (data) => data.Potassium ?? null,
    status: (v) => v < 10
      ? { label: "Potassium is too low", tone: "bad" }
      : { label: "Potassium level is sufficient", tone: "good" }
  },
  {
    key: "Temperature_C",
    label: "Temperature (°C)",
    unit: "°C",
    format: (data) => data.Temperature_C ?? null,
    status: (v) => {
      if (v < 15) return { label: "Temperature is too low", tone: "bad" };
      if (v > 35) return { label: "Temperature is too high", tone: "bad" };
      return { label: "Temperature is in the safe range", tone: "good" };
    }
  },
  {
    key: "Timestamp",
    label: "Timestamp",
    unit: "",
    format: (data) =>
      data.Timestamp && typeof data.Timestamp.toDate === "function"
        ? data.Timestamp.toDate().toLocaleString("en-US", { timeZone: "Asia/Hong_Kong" })
        : null,
    status: () => ({ label: "OK", tone: "neutral" })
  },
  {
    key: "Temperature_F",
    label: "Temperature (°F)",
    unit: "°F",
    format: (data) => data.Temperature_F ?? null,
    status: (v) => {
      if (v < 59) return { label: "Temperature is too low", tone: "bad" };
      if (v > 95) return { label: "Temperature is too high", tone: "bad" };
      return { label: "Temperature is in the safe range", tone: "good" };
    }
  },
];
