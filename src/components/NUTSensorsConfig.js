export const nutritionDefinitions = [
    {
      key: "Nitrogen",
      label: "Nitrogen",
      unit: "mg/L",
      format: (data) => data.Nitrogen ?? null,
      status: (v) => v < 20
        ? { label: "Nitrogen is too low", tone: "bad" }
        : { label: "Nitrogen level is sufficient", tone: "good" }
    },
    {
      key: "Phospherous",
      label: "Phosphorous",
      unit: "mg/L",
      format: (data) => data.Phospherous ?? null,
      status: (v) => v < 15
        ? { label: "Phosphorous is too low", tone: "bad" }
        : { label: "Phosphorous level is sufficient", tone: "good" }
    },
    {
      key: "Potassium",
      label: "Potassium",
      unit: "mg/L",
      format: (data) => data.Potassium ?? null,
      status: (v) => v < 10
        ? { label: "Potassium is too low", tone: "bad" }
        : { label: "Potassium level is sufficient", tone: "good" }
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
    }
  ];
  