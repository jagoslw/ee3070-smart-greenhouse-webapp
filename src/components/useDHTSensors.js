import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore"; // Switched to onSnapshot for real-time
import { db } from "./firebase";

export function useSensors() {
  const [data, setData] = useState({});

  useEffect(() => {
    // Optimization: Using onSnapshot instead of a manual setInterval
    // This is "cheaper" on Firebase reads and updates instantly when the sensor writes
    const docRef = doc(db, "Environment", "0000000");
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      } else {
        console.warn("Sensor document '0000000' not found.");
      }
    }, (error) => {
      console.error("Firebase Sensor Error:", error);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  return data;
}