import React, { useState, useEffect } from "react";
import HeatMap from "react-heatmap-grid";

export default function HeatmapComponent() {
  const [heatmapData, setHeatmapData] = useState({});

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data/HARSH");
        const data = await response.json();

        const groupedData = {};
        data.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString();
          const hour = new Date(item.timestamp).getHours();
          if (!groupedData[date]) {
            groupedData[date] = Array(24).fill(0);
          }
          groupedData[date][hour] += item.sittingDuration; 
        });

        setHeatmapData(groupedData);
      } catch (error) {
        console.error("Error fetching heatmap data:", error);
      }
    };

    fetchHeatmapData();
    const interval = setInterval(fetchHeatmapData, 5000);

    return () => clearInterval(interval);
  }, []);

  const days = Object.keys(heatmapData);
  const hours = [...Array(24).keys()];

  return (
    <div style={{ width: "90%", margin: "50px auto", textAlign: "center" }}>
      <h2>🌡️ Sitting Intensity Heatmap</h2>
      <HeatMap
        xLabels={hours.map((h) => `${h}:00`)}
        yLabels={days}
        data={days.map((d) => heatmapData[d])}
        background="rgba(255, 69, 0, 0.5)"
        height={50}
      />
    </div>
  );
}
