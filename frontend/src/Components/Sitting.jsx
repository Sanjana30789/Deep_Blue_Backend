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
  Filler
} from "chart.js";
import "./SittingPattern.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Sitting() {
  const [sensorData, setSensorData] = useState([]);
   const [user, setUser] = useState(null);
    const [currentSittingDuration, setCurrentSittingDuration] = useState(0);
     const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found.");
          return;
        }

        const response = await fetch("http://localhost:5000/api/auth/user", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const userData = await response.json();
        if (response.ok) {
          setUser(userData);
          if (userData?.chair_id) {
            fetchSensorData(userData.chair_id);
          }
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchSensorData = async (chair_id) => {
      try {
        const response = await fetch(`http://localhost:5000/data/${chair_id}`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        const processedData = Array.isArray(data) ? data : data.data;
        setSensorData(processedData);

        if (processedData.length > 0) {
          const latestReading = processedData[processedData.length - 1];
          setCurrentSittingDuration(latestReading.sittingDuration);
          setLastUpdated(new Date(latestReading.timestamp));
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchUserData();
    const interval = setInterval(() => {
      fetchUserData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const processSittingData = () => {
    if (!sensorData.length) return { timeLabels: [], durationValues: [] };

    return {
      timeLabels: sensorData.map(d => new Date(d.timestamp).toLocaleTimeString()),
      durationValues: sensorData.map(d => d.sittingDuration)
    };
  };

  const { timeLabels, durationValues } = processSittingData();

  const durationVsTimeConfig = {
    labels: timeLabels,
    datasets: [{
      label: 'Sitting Duration (minutes)',
      data: durationValues,
      borderColor: '#4CAF50',
      backgroundColor: 'rgba(76, 175, 80, 0.2)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="sitting-pattern-container">
      {/* <h1>Sitting Pattern Analysis</h1> */}
      <div className="chart-card">
        <h2>Real-time Sitting Duration</h2>
        <div className="chart-wrapper">
          <Line 
            data={durationVsTimeConfig}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
                title: { display: true, text: 'Sitting Duration vs Time' }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Duration (minutes)' }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
