
import { Link } from "react-router-dom";

function sensors(){

    return(
        <div className="sensors-page">
            <h1>Sensors Page</h1>
            <h2>return to <Link to="/">Dashboard</Link></h2>
        </div>
    );
}
export default sensors;