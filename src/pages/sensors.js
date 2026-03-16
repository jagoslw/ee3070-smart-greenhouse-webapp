import DHT from "../components/DHT";
import Nutrition from "../components/Nutrition";
function Sensors() {
    return (
        <div>
        <h3 class="sensor-legend">Sensor Levels</h3>
        <DHT />
        <h3 class="sensor-legend">Nutrition Levels</h3>
         <Nutrition />
        </div>
    );
  }
  

export default Sensors;
