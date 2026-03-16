import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export function useSensors() {
  const [data, setData] = useState({});

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      try {
        const snap = await getDoc(doc(db, "Environment", "DHT11"));
        if (!active || !snap.exists()) return;
        setData(snap.data());
      } catch (_) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return data;
}
