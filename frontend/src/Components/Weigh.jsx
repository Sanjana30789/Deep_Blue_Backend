import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./LastAnalysis.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Weight() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data/PRAM");
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        setSensorData(Array.isArray(data) ? data : data.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeLabels = sensorData.map(d => new Date(d.timestamp).toLocaleTimeString());
  const weightValues = sensorData.map(d => d.weight);

  const weightTrendConfig = {
    labels: timeLabels,
    datasets: [{
      label: 'Weight (kg)',
      data: weightValues,
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      tension: 0.1,
      fill: true
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: false }
    },
    plugins: {
      legend: { position: 'top' }
    }
  };

  return (
    <div className="lastanalysis-container">
      {/* <h1>Real-time Weight Trends</h1> */}
      <div className="chart-card">
      <h2>Real-time Weight Analysis</h2>
        <div className="chart-wrapper">
          <Line data={weightTrendConfig} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
