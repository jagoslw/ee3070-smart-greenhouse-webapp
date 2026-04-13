export const yoloDefinitions = [
// --- NEW: YOLO DETECTION GROUP ---
  {
    key: "health",
    group: "YOLO Detection",
    label: "Plant Health",
    unit: "",
    format: (data) => data.health ?? null,
    status: () => ({ label: "Monitored", tone: "neutral" })
  },
  {
    key: "level",
    group: "YOLO Detection",
    label: "Growth Level",
    unit: "Stage",
    format: (data) => data.level ?? null,
    status: () => ({ label: "Monitored", tone: "neutral" })
  }
];