import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChartPage() {
  const [pieDataByDate, setPieDataByDate] = useState({});
  const [recommendations, setRecommendations] = useState({});

  useEffect(() => {
    const fetchPieData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        // Group data by date
        const groupedData = {};
        data.forEach((item) => {
          const date = new Date(item.timestamp).toLocaleDateString();

          if (!groupedData[date]) {
            groupedData[date] = { sittingDuration: [], fsrReading: [] };
          }

          groupedData[date].sittingDuration.push(item.sittingDuration);
          groupedData[date].fsrReading.push(item.fsrReading);
        });

        const pieDataObj = {};
        const dailyRecommendations = {};

        Object.keys(groupedData).forEach((date) => {
          const totalSitting = groupedData[date].sittingDuration.reduce((a, b) => a + b, 0);
          const totalFSR = groupedData[date].fsrReading.reduce((a, b) => a + b, 0);
          const avgSitting = totalSitting / groupedData[date].sittingDuration.length;
          const avgFSR = totalFSR / groupedData[date].fsrReading.length;

          pieDataObj[date] = {
            labels: ["Sitting Duration", "FSR Reading"],
            datasets: [
              {
                data: [totalSitting, totalFSR],
                backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
                borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1,
              },
            ],
          };

          // Generate Recommendations
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

        setPieDataByDate(pieDataObj);
        setRecommendations(dailyRecommendations);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchPieData();
    const interval = setInterval(fetchPieData, 5000); // Refresh every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "90%", margin: "50px auto", textAlign: "center" }}>
      <h2>📊 Date-wise Pie Charts</h2>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px" }}>
        {Object.keys(pieDataByDate).map((date) => (
          <div
            key={date}
            style={{
              flex: "1 1 calc(20% - 20px)", // Ensures 3 per row
              minWidth: "250px", // Prevents shrinking too much
              maxWidth: "350px",
              textAlign: "center",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ color: "#333" }}>📅 {date}</h3>
            <Pie data={pieDataByDate[date]} />
            <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#fff3cd", borderRadius: "8px" }}>
              <h4>📢 Recommendation:</h4>
              <p style={{ fontSize: "16px", fontWeight: "bold", color: "#856404" }}>{recommendations[date]}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
