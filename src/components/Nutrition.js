import React from "react";
import SensorCard from "./SensorCard";
import { useNutrition } from "./useNUTSensors";
import { nutritionDefinitions } from "./NUTSensorsConfig";

function Nutrition() {
  const nutritionData = useNutrition();
  console.log("Nutrition data:", nutritionData);


  const sensors = nutritionDefinitions.map(def => ({
    sensorName: def.label,
    value: def.format(nutritionData),
    unit: def.unit,
    statusFn: def.status
    
  }));

  return (

    <section className="sensor-grid">
      {sensors.map((s, i) => (
        <SensorCard
          key={i}
          sensorName={s.sensorName}
          value={s.value}
          unit={s.unit}
          statusFn={s.statusFn}
        />
      ))}
      
    </section>
    
  );
}

export default Nutrition;
