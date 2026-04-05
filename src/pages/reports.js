import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../components/firebase";
import { Line, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement, CategoryScale, LinearScale, PointElement,
  Title, Tooltip, Legend, Filler, RadialLinearScale
} from "chart.js";
import "./reports.css";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend, Filler, RadialLinearScale);

function Reports() {
  const [readings, setReadings] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "Environment"), orderBy("Timestamp", "desc"), limit(30));
    const unsubscribe = onSnapshot(q, (snap) => {
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (data.length > 0) setLatest(data[0]);
      setReadings(data.reverse());
    });
    return () => unsubscribe();
  }, []);

  // --- 專業閾值與動態建議邏輯 ---
  const getEnvironmentalHealth = () => {
    if (!latest) return { label: "SCANNING", class: "status-neutral" };
    const t = latest.Temperature_C, h = latest.Humidity, m = latest.Moisture;
    if (t > 32) return { label: "🔥 CRITICAL: OVERHEAT", class: "status-critical" };
    if (t < 18) return { label: "❄️ WARNING: LOW TEMP", class: "status-warning" };
    if (m < 30) return { label: "💧 WARNING: SOIL DRY", class: "status-warning" };
    if (h > 85) return { label: "☁️ WARNING: HIGH HUMIDITY", class: "status-warning" };
    return { label: "✅ OPTIMAL GROWTH", class: "status-optimal" };
  };

  // 修改後的 NPK 建議邏輯：改為回傳數組
  const getSoilActions = () => {
    if (!latest) return [];
    const actions = [];
    if (latest.Nitrogen < 50) actions.push({ type: "Nitrogen", desc: "Essential for leaf growth and chlorophyll." });
    if (latest.Phosphorous < 120) actions.push({ type: "Phosphorous", desc: "Required for strong roots and blooming." });
    if (latest.Potassium < 180) actions.push({ type: "Potassium", desc: "Boosts overall plant immunity and fruit quality." });
    return actions;
  };

  const envStatus = getEnvironmentalHealth();
  const soilActions = getSoilActions();

  // --- 圖表數據配置 ---
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#888', font: { family: 'JetBrains Mono', size: 10 } } } },
    scales: {
      y: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: '#555' } },
      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: '#555' } }
    }
  };

  const hydrationData = {
    labels: readings.map(r => r.Timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      { label: "Humidity %", data: readings.map(r => r.Humidity), borderColor: "#00ff88", backgroundColor: "rgba(0, 255, 136, 0.1)", fill: true, tension: 0.4 },
      { label: "Moisture %", data: readings.map(r => r.Moisture), borderColor: "#60a5fa", backgroundColor: "rgba(96, 165, 250, 0.1)", fill: true, tension: 0.4 }
    ]
  };

  const npkTrendData = {
    labels: readings.map(r => r.Timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
    datasets: [
      { label: "N", data: readings.map(r => r.Nitrogen), borderColor: "#ff3b3b", tension: 0.2, pointRadius: 0 },
      { label: "P", data: readings.map(r => r.Phosphorous), borderColor: "#ffcc00", tension: 0.2, pointRadius: 0 },
      { label: "K", data: readings.map(r => r.Potassium), borderColor: "#a855f7", tension: 0.2, pointRadius: 0 }
    ]
  };

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h1 className="reports-title">Oasis Intelligence</h1>
        <p className="reports-subtitle">Analytical Insights & Trend Reports</p>
      </div>

      <div className="top-stats-grid">
        <div className="report-card nutrient-analysis">
          <h3>Nutrient Profile (NPK)</h3>
          <div className="radar-wrapper">
            <Radar data={{
              labels: ["N", "P", "K"],
              datasets: [{
                data: [latest?.Nitrogen || 0, latest?.Phosphorous || 0, latest?.Potassium || 0],
                backgroundColor: "rgba(0, 255, 136, 0.2)", borderColor: "#00ff88", borderWidth: 2,
              }]
            }} options={{ scales: { r: { grid: { color: "#333" }, pointLabels: { color: "#888" }, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
          
          {/* 改進：獨立行的施肥建議 */}
          <div className="action-list">
            {soilActions.length > 0 ? (
              soilActions.map((action, idx) => (
                <div key={idx} className="action-item">
                  <span className={`action-type type-${action.type.toLowerCase()}`}>{action.type} needed</span>
                  <span className="action-desc">({action.desc})</span>
                </div>
              ))
            ) : (
              <div className="action-success">✨ Soil nutrition is perfectly balanced.</div>
            )}
          </div>
        </div>

        <div className="report-card status-card">
          <h3>System Vitals</h3>
          <div className="vital-mini-grid">
            <div className="v-box"><span>Air</span><p>{latest?.Temperature_C}°C</p></div>
            <div className="v-box"><span>Soil</span><p>{latest?.Moisture}%</p></div>
            <div className="v-box"><span>Light</span><p>{latest?.Light}%</p></div>
          </div>
          <div className="vital-status-container">
            <span className="status-label">AI Diagnostic:</span>
            <span className={`status-tag ${envStatus.class}`}>{envStatus.label}</span>
          </div>
        </div>
      </div>

      <div className="charts-main-grid">
        <div className="report-card chart-item">
          <h3>Hydration (Air vs Soil)</h3>
          <div className="chart-wrapper-sm">
            <Line data={hydrationData} options={commonOptions} />
          </div>
        </div>
        <div className="report-card chart-item">
          <h3>Nutrient Consumption (NPK Trend)</h3>
          <div className="chart-wrapper-sm">
            <Line data={npkTrendData} options={commonOptions} />
          </div>
        </div>
      </div>

      <div className="raw-logs">
        <h3 className="section-label">Real-time Telemetry Stream</h3>
        <div className="log-table">
          {readings.slice().reverse().slice(0, 8).map((r, i) => (
            <div key={i} className="log-row">
              <span className="log-time">{r.Timestamp?.toDate().toLocaleTimeString()}</span>
              <span>Temp: {r.Temperature_C}°</span>
              <span>Hum: {r.Humidity}%</span>
              <span>Moist: {r.Moisture}%</span>
              <span className="npk-small">NPK: {r.Nitrogen}-{r.Phosphorous}-{r.Potassium}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reports;