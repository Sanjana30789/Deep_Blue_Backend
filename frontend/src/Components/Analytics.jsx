import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Line, Scatter, Pie, Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import "./Analytics.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

export default function FinalAnalysis() {
  const [sensorData, setSensorData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data/ALPHA`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        setSensorData(Array.isArray(data) ? data : []);
        setDataCount(data.length);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Extracting values for graphs
  const timestamps = sensorData.map((d) =>
    new Date(d.timestamp).toLocaleTimeString()
  );
  const days = sensorData.map((d) =>
    new Date(d.timestamp).toLocaleDateString()
  );

  const fsr1Data = sensorData.map((d) => d.fsr1);
  const fsr2Data = sensorData.map((d) => d.fsr2);
  const fsr3Data = sensorData.map((d) => d.fsr3);
  const fsr4Data = sensorData.map((d) => d.fsr4);
  const weightData = sensorData.map((d) => d.weight);
  const sittingDurationData = sensorData.map((d) => d.sittingDuration);

  // Group data by day for weekly trends
  const dailySittingData = {};
  days.forEach((day, index) => {
    dailySittingData[day] =
      (dailySittingData[day] || 0) + sittingDurationData[index];
  });

  const weeklySittingLabels = Object.keys(dailySittingData);
  const weeklySittingValues = Object.values(dailySittingData);

  return (
    <div className="analysis-container">
      {/* Back to Dashboard Button */}
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>📊 Final Analysis of Sensor Data</h1>

      {/* Data Counter */}
      <div className="data-counter">
        <h2>📌 Total Records in Database: {dataCount}</h2>
      </div>

      {/* Graphs Grid */}
      <div className="charts-grid">
        {/* Line Chart - FSR Readings Over Time */}
        <div className="chart-card">
          <h3>📈 FSR Readings Over Time</h3>
          <Line
            data={{
              labels: timestamps,
              datasets: [
                { label: "FSR1", data: fsr1Data, borderColor: "red", tension: 0.1 },
                { label: "FSR2", data: fsr2Data, borderColor: "blue", tension: 0.1 },
                { label: "FSR3", data: fsr3Data, borderColor: "green", tension: 0.1 },
                { label: "FSR4", data: fsr4Data, borderColor: "purple", tension: 0.1 },
              ],
            }}
          />
        </div>

        {/* Bar Chart - Sitting Duration Trends */}
        <div className="chart-card">
          <h3>📊 Sitting Duration Trends</h3>
          <Bar
            data={{
              labels: timestamps,
              datasets: [
                {
                  label: "Sitting Duration (mins)",
                  data: sittingDurationData,
                  backgroundColor: "rgba(75,192,192,0.6)",
                },
              ],
            }}
          />
        </div>

        {/* Weekly Sitting Trends */}
        <div className="chart-card">
          <h3>📅 Weekly Sitting Patterns</h3>
          <Bar
            data={{
              labels: weeklySittingLabels,
              datasets: [
                {
                  label: "Total Sitting Duration per Day (mins)",
                  data: weeklySittingValues,
                  backgroundColor: "rgba(255,99,132,0.6)",
                },
              ],
            }}
          />
        </div>

        {/* Scatter Plot - FSR Readings */}
        <div className="chart-card">
          <h3>🔍 FSR Readings Scatter Plot</h3>
          <Scatter
            data={{
              datasets: [
                {
                  label: "FSR1",
                  data: fsr1Data.map((val, index) => ({ x: index, y: val })),
                  backgroundColor: "red",
                },
                {
                  label: "FSR2",
                  data: fsr2Data.map((val, index) => ({ x: index, y: val })),
                  backgroundColor: "blue",
                },
              ],
            }}
          />
        </div>

        {/* Radar Chart - FSR Comparison */}
        <div className="chart-card">
          <h3>🛡️ FSR Comparison (Radar Chart)</h3>
          <Radar
            data={{
              labels: ["FSR1", "FSR2", "FSR3", "FSR4"],
              datasets: [
                {
                  label: "FSR Readings",
                  data: [
                    fsr1Data.reduce((a, b) => a + b, 0) / fsr1Data.length,
                    fsr2Data.reduce((a, b) => a + b, 0) / fsr2Data.length,
                    fsr3Data.reduce((a, b) => a + b, 0) / fsr3Data.length,
                    fsr4Data.reduce((a, b) => a + b, 0) / fsr4Data.length,
                  ],
                  backgroundColor: "rgba(255, 99, 132, 0.2)",
                  borderColor: "rgb(255, 99, 132)",
                  borderWidth: 2,
                },
              ],
            }}
          />
        </div>

        {/* Pie Chart - Weight Distribution */}
        <div className="chart-card">
          <h3>⚖️ Weight Distribution</h3>
          <Pie
            data={{
              labels: ["Light (<60kg)", "Average (60-90kg)", "Heavy (>90kg)"],
              datasets: [
                {
                  data: [
                    weightData.filter((w) => w < 60).length,
                    weightData.filter((w) => w >= 60 && w <= 90).length,
                    weightData.filter((w) => w > 90).length,
                  ],
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
}