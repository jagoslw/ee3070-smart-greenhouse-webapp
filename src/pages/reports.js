
import { Link } from "react-router-dom";

function reports(){

    return(
        <div className="reports-page">
            <h1>Reports Page</h1>
            <h2>return to <Link to="/">Dashboard</Link></h2>
        </div>
    );
}
export default reports;