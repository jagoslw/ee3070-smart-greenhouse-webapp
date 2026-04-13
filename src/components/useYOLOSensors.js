import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

export function useYoloSensors() {
  const [data, setData] = useState({});

  useEffect(() => {
    // Listening to the specific fixed document in the YOLO collection
    const docRef = doc(db, "YOLO", "fixed");
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setData(snap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  return data;
}