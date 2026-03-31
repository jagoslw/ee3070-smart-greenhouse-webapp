import React, { useEffect, useState } from "react";
// 從 firebase/database 匯入必要的函式
import { ref, onValue } from "firebase/database"; 
// 從你自己的設定檔匯入 db
import { rtdb } from "../components/firebase"; 

const CameraView = () => {
  const [base64Image, setBase64Image] = useState("");

  useEffect(() => {
    // 確保 rtdb 存在後再建立 ref
    if (!rtdb) return;

    // 監聽路徑：camera/latest_image
    const imageRef = ref(rtdb, 'camera/latest_image');
    
    const unsubscribe = onValue(imageRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // 更新圖片 State
        setBase64Image(data);
      }
    }, (error) => {
      console.error("Firebase Read Error: ", error);
    });

    return () => unsubscribe(); 
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h2>Smart Harvesting - Live Camera</h2>
      <div style={{ margin: '20px auto', maxWidth: '640px' }}>
        {base64Image ? (
          <img 
            decoding = "async"
            src={`data:image/jpeg;base64,${base64Image}`} 
            alt="Live Feed" 
            style={{ 
              width: '100%', 
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              border: '2px solid #ddd' 
            }}
          />
        ) : (
          <div style={{ padding: '40px', background: '#f0f0f0', borderRadius: '8px' }}>
            <p>正在等待 ESP32 上傳影像...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraView;