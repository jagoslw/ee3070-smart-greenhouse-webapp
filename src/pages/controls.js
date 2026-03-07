
import { Link } from "react-router-dom";

function controls(){
    
    
    return(
        <div className="controls-page">
            <h1>Controls Page</h1>
            <h2>return to <Link to="/">Dashboard</Link></h2>
        </div>
    );
}
export default controls;