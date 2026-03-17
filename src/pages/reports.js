import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../components/firebase";

import React, {     useState, useEffect} from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Reports(){
    const [readings, setReadings] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const q = query(
                collection(db, "Environment"),
                orderBy("Timestamp", "desc"),
                limit(50)
            );
            const snap = await getDocs(q);
            const data = snap.docs.map(doc => doc.data());
            setReadings(data);
        }
        fetchData();
    }, []);
        const chartData = {
            labels: readings.map(r =>
            r.Timestamp?.toDate().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            ),
            datasets: [
            {
                label: "Sensor Value",
                data: readings.map(r => r.Humidity), // adjust field name to match your Firestore
                borderColor: "rgba(75,192,192,1)",
                backgroundColor: "rgba(75,192,192,0.2)",
                tension: 0.3
            }
            ]
        };const options = {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Last 50 Sensor Readings" }
            }
          };
        
          return (
            <div className="reports-page">
              <h2>Reports</h2>
        
              {/* Chart */}
              <Line data={chartData} options={options} />
        
              {/* Raw list of records */}
              <ul>
                {readings.map((r, i) => (
                  <li key={i}>
                    {r.Timestamp?.toDate().toLocaleString()} — Value: {r.Value}
                  </li>
                ))}
              </ul>
            </div>
          );
        }
        
export default Reports;