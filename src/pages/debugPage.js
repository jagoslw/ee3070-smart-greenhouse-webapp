import React, { useState, useEffect } from 'react';
import { db } from '../components/firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

const DebugPage = () => {
  const [currentStats, setCurrentStats] = useState({});
  const [loading, setLoading] = useState(false);
  const docRef = doc(db, "Environment", "testing");

  useEffect(() => {
    const unsub = onSnapshot(docRef, (doc) => {
      setCurrentStats(doc.data() || {});
    });
    return () => unsub();
  }, []);

  const updateStat = async (field, value) => {
    setLoading(true);
    try {
      await updateDoc(docRef, { [field]: value });
    } catch (error) {
      console.error("Update failed:", error);
    }
    setLoading(false);
  };

  const sensorConfigs = [
    { 
        label: "Moisture (%)", 
        field: "Moisture", 
        desc: "Tests 5% Death Gate vs 60% Sweet Spot",
        options: [
            { label: "💀 CRITICAL", val: 5, color: "bg-red-100 hover:bg-red-600 text-red-700" },
            { label: "📉 LOW", val: 30, color: "bg-orange-100 hover:bg-orange-600 text-orange-700" },
            { label: "✅ TARGET", val: 60, color: "bg-green-100 hover:bg-green-600 text-green-700" },
            { label: "🌊 FLOOD", val: 95, color: "bg-blue-100 hover:bg-blue-600 text-blue-700" }
        ] 
    },
    { 
        label: "Nitrogen (N)", 
        field: "Nitrogen", 
        desc: "Primary growth nutrient tests",
        options: [
            { label: "⚠️ STARVE", val: 5, color: "bg-red-100 hover:bg-red-600 text-red-700" },
            { label: "🎯 STAGE 1", val: 80, color: "bg-emerald-50 hover:bg-emerald-600 text-emerald-700" },
            { label: "🎯 STAGE 3", val: 140, color: "bg-emerald-100 hover:bg-emerald-600 text-emerald-700" },
            { label: "⛰️ CLIFF", val: 200, color: "bg-purple-100 hover:bg-purple-600 text-purple-700" }
        ] 
    },
    { 
        label: "Phosphorous (P)", 
        field: "Phosphorous", 
        desc: "Tests root and flower development logic",
        options: [
            { label: "⚠️ STARVE", val: 5, color: "bg-red-100 hover:bg-red-600 text-red-700" },
            { label: "🎯 STAGE 2", val: 60, color: "bg-teal-50 hover:bg-teal-600 text-teal-700" },
            { label: "🎯 STAGE 5", val: 140, color: "bg-teal-100 hover:bg-teal-600 text-teal-700" },
            { label: "⛰️ CLIFF", val: 180, color: "bg-purple-100 hover:bg-purple-600 text-purple-700" }
        ] 
    },
    { 
        label: "Potassium (K)", 
        field: "Potassium", 
        desc: "Tests fruiting and water regulation logic",
        options: [
            { label: "⚠️ STARVE", val: 5, color: "bg-red-100 hover:bg-red-600 text-red-700" },
            { label: "🎯 STAGE 1", val: 40, color: "bg-amber-50 hover:bg-amber-600 text-amber-700" },
            { label: "🎯 STAGE 6", val: 160, color: "bg-amber-100 hover:bg-amber-600 text-amber-700" },
            { label: "⛰️ CLIFF", val: 210, color: "bg-purple-100 hover:bg-purple-600 text-purple-700" }
        ] 
    },
    { 
        label: "Temperature (°C)", 
        field: "Temperature_C", 
        desc: "Tests Fan Proactivity (>30°C)",
        options: [
            { label: "❄️ COLD", val: 15, color: "bg-blue-50 hover:bg-blue-500 text-blue-600" },
            { label: "🍃 IDEAL", val: 24, color: "bg-green-50 hover:bg-green-500 text-green-600" },
            { label: "🔥 HOT", val: 32, color: "bg-orange-100 hover:bg-orange-600 text-orange-700" },
            { label: "🌋 DANGER", val: 45, color: "bg-red-200 hover:bg-red-700 text-red-800" }
        ] 
    },
    { 
        label: "Light (Lux)", 
        field: "Light", 
        desc: "Tests LED Logic",
        options: [
            { label: "🌑 NIGHT", val: 15, color: "bg-slate-200 hover:bg-slate-800 text-slate-800" },
            { label: "☁️ CLOUDY", val: 50, color: "bg-yellow-50 hover:bg-yellow-500 text-yellow-600" },
            { label: "☀️ SUNNY", val: 85, color: "bg-yellow-200 hover:bg-yellow-600 text-yellow-800" }
        ] 
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-100 min-h-screen font-sans">
      <header className="mb-10 flex justify-between items-end border-b pb-6 border-gray-200">
        <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">AGiVEMS <span className="text-green-600">V7.4</span></h1>
            <p className="text-gray-500 font-medium">Full Nutrient & Environment Stress-Test</p>
        </div>
        <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase">System Sync</span>
            <div className="flex items-center gap-2 justify-end">
                <div className={`w-3 h-3 rounded-full ${loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="font-mono font-bold text-gray-700">{loading ? 'UPDATING...' : 'ONLINE'}</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sensorConfigs.map((sensor) => (
          <div key={sensor.field} className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-200/40 border border-white flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <h2 className="text-lg font-bold text-gray-800">{sensor.label}</h2>
              <div className="bg-gray-900 text-white px-3 py-1 rounded-xl font-mono text-lg font-bold">
                {currentStats[sensor.field] || 0}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-5 leading-relaxed">{sensor.desc}</p>
            
            <div className="grid grid-cols-2 gap-2 mt-auto">
              {sensor.options.map((opt) => (
                <button
                  key={opt.val}
                  onClick={() => updateStat(sensor.field, opt.val)}
                  disabled={loading}
                  className={`flex flex-col items-center justify-center py-4 rounded-xl transition-all duration-150 active:scale-95 border-b-4 border-black/5 ${opt.color} hover:text-white hover:border-transparent`}
                >
                  <span className="text-[10px] font-black uppercase tracking-tighter opacity-70 mb-1">{opt.label}</span>
                  <span className="text-xl font-black">{opt.val}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-6 bg-white rounded-3xl border border-gray-200 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-xl">📋</span> NPK Test Scenarios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="p-3 bg-gray-50 rounded-xl">
                <p><strong>Under-feeding Test:</strong> Set P or K to <b>5</b>. The model should trigger the pump immediately to avoid the -500 starvation penalty.</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
                <p><strong>Over-feeding Test:</strong> Set K to <b>210</b>. The model should cease all pumping to escape the quadratic "Cliff" penalty.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;