import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function GraphPage() {
  const [dailyGraphData, setDailyGraphData] = useState({});
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        const groupedData = {};
        data.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString();
          if (!groupedData[date]) {
            groupedData[date] = { labels: [], sittingDuration: [], fsrReading: [] };
          }
          groupedData[date].labels.push(new Date(item.timestamp).toLocaleTimeString());
          groupedData[date].sittingDuration.push(item.sittingDuration);
          groupedData[date].fsrReading.push(item.fsrReading);
        });

        setDailyGraphData(groupedData);

        const dailyRecommendations = {};
        Object.keys(groupedData).forEach((date) => {
          const avgSitting = groupedData[date].sittingDuration.reduce((a, b) => a + b, 0) / groupedData[date].sittingDuration.length;
          const avgFSR = groupedData[date].fsrReading.reduce((a, b) => a + b, 0) / groupedData[date].fsrReading.length;

          let advice = "✅ Keep up the good work!";
          if (avgSitting > 180) {
            advice = "⚠️ You've been sitting for too long today. Take regular breaks!";
          } else if (avgFSR < 50) {
            advice = "⚠️ Your posture seems incorrect. Adjust your sitting position!";
          } else if (avgSitting > 120 && avgFSR < 70) {
            advice = "⚠️ Long sitting hours and poor posture detected. Take breaks and sit properly.";
          }

          dailyRecommendations[date] = advice;
        });

        setRecommendations(dailyRecommendations);
      } catch (error) {
        console.error("Error fetching graph data:", error);
      }
    };

    fetchGraphData();
    const interval = setInterval(fetchGraphData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "90%", margin: "50px auto", textAlign: "center" }}>
      <h2>📈 Day-wise Sensor Data Graph</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {Object.keys(dailyGraphData).map((date) => (
          <div
            key={date}
            style={{
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#333" }}>📅 {date}</h3>
            <Line
              data={{
                labels: dailyGraphData[date].labels,
                datasets: [
                  {
                    label: "Sitting Duration (mins)",
                    data: dailyGraphData[date].sittingDuration,
                    borderColor: "blue",
                    backgroundColor: "rgba(0,0,255,0.2)",
                    fill: true,
                  },
                  {
                    label: "FSR Reading",
                    data: dailyGraphData[date].fsrReading,
                    borderColor: "red",
                    backgroundColor: "rgba(255,0,0,0.2)",
                    fill: true,
                  },
                ],
              }}
            />
            <div
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "#fff3cd",
                borderRadius: "8px",
              }}
            >
              <h4>📢 Recommendation:</h4>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#856404" }}>
                {recommendations[date]}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

}
