import DHT from "../components/DHT";
import "./sensor.css";
function Sensors() {
    return (
        <div>
        <h3 class="sensor-legend">Sensor Levels</h3>
        <DHT />
        </div>
    );
  }
  

export default Sensors;
