import React, { useEffect, useState, useRef } from "react";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../components/firebase"; 
import "./camera.css";

const CameraView = () => {
  const [base64Image, setBase64Image] = useState("");
  const [status, setStatus] = useState("CONNECTING"); // CONNECTING, ONLINE, OFFLINE
  const lastUpdateRef = useRef(Date.now());

  useEffect(() => {
    if (!rtdb) return;

    const imageRef = ref(rtdb, 'camera/latest_image');
    
    // 監聽影像更新
    const unsubscribe = onValue(imageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBase64Image(data);
        setStatus("ONLINE");
        lastUpdateRef.current = Date.now(); // 每次收到圖，更新最後活躍時間
      }
    });

    // 斷線檢測計時器：每 3 秒檢查一次是否「過期」
    const checkInterval = setInterval(() => {
      const secondsSinceLastUpdate = (Date.now() - lastUpdateRef.current) / 1000;
      
      if (secondsSinceLastUpdate > 10) { // 如果超過 10 秒沒更新
        setStatus("OFFLINE");
      }
    }, 3000);

    return () => {
      unsubscribe();
      clearInterval(checkInterval);
    };
  }, []);

  return (
    <div className="camera-page">
      <div className="camera-header">
        <h2 className="camera-title">AGiVEMS Live Feed</h2>
        <div className={`live-indicator status-${status.toLowerCase()}`}>
          <span className="dot"></span>
          {status === "ONLINE" ? "SYSTEM ONLINE" : status === "OFFLINE" ? "SYSTEM OFFLINE" : "INITIALIZING..."}
        </div>
      </div>

      <div className="camera-viewport">
        {/* 只有在 ONLINE 且有圖片時才顯示影像，否則顯示佔位符 */}
        {status === "ONLINE" && base64Image ? (
          <div className="image-container">
            <img 
              decoding="async"
              src={`data:image/jpeg;base64,${base64Image}`} 
              alt="Live Feed" 
              className="live-img"
            />
          </div>
        ) : (
          <div className="camera-placeholder">
            <div className={`status-icon ${status.toLowerCase()}`}></div>
            <p>{status === "OFFLINE" ? "Connection Lost: Check ESP32 Power" : "Awaiting Uplink..."}</p>
            {status === "OFFLINE" && <span className="retry-hint">Last seen: {new Date(lastUpdateRef.current).toLocaleTimeString()}</span>}
          </div>
        )}
      </div>

      <div className="camera-footer">
        <div className="info-chip">Source: ESP32-CAM</div>
        <div className="info-chip">Resolution: 640x480</div>
        <div className="info-chip">Auto-Timeout: 10s</div>
      </div>
    </div>
  );
};

export default CameraView;