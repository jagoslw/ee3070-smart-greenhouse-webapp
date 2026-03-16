import React from "react";
import SensorCard from "./SensorCard";
import { useSensors } from "./useDHTSensors";
import { sensorDefinitions } from "./DHTSensorsConfig";

function DHT() {
  const DHTData = useSensors();
  console.log("DHT data:", DHTData);


  const sensors = sensorDefinitions.map(def => ({
    sensorName: def.label,
    value: def.format(DHTData),
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

export default DHT;
