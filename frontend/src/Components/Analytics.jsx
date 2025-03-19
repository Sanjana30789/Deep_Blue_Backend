import React, { useState, useEffect } from "react";
import { Line, Bar, Pie, Scatter } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from "chart.js";
import Heatmap from "react-heatmap-grid"; // Heatmap for sitting behavior
import "./Analytics.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend);

export default function AllAnalysis() {
  const [sensorData, setSensorData] = useState([]);
  const [user, setUser] = useState(null);

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
        } else {
          console.error("Error fetching user:", userData.msg);
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
        setSensorData(Array.isArray(data) ? data : data.data);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Extracting timestamps, sitting duration, and weight
  const timestamps = sensorData.map((d) => new Date(d.timestamp));
  const sittingDurationData = sensorData.map((d) => d.sittingDuration);
  const weightData = sensorData.map((d) => d.weight);

  // ===========================
  // ✅ Weight Analysis
  // ===========================
  const days = sensorData.map((d) => new Date(d.timestamp).toLocaleDateString());

  // Group weight by days
  const dailyWeightData = {};
  days.forEach((day, index) => {
    if (!dailyWeightData[day]) dailyWeightData[day] = [];
    dailyWeightData[day].push(weightData[index]);
  });

  // Calculate daily average weight
  const dailyWeightLabels = Object.keys(dailyWeightData);
  const dailyWeightValues = dailyWeightLabels.map((day) => {
    const weights = dailyWeightData[day];
    return weights.reduce((sum, w) => sum + w, 0) / weights.length;
  });

  // ===========================
  // ✅ Sitting Duration Analysis
  // ===========================

  // 🔹 Group by hours for daily trends
  const hourlyData = {};
  timestamps.forEach((timestamp, index) => {
    const hour = timestamp.getHours();
    hourlyData[hour] = (hourlyData[hour] || 0) + sittingDurationData[index];
  });

  const dailyHours = Object.keys(hourlyData);
  const dailyDurations = Object.values(hourlyData);

  // 🔹 Group by days for weekly trends
  const dailySittingData = {};
  timestamps.forEach((timestamp, index) => {
    const date = timestamp.toLocaleDateString();
    dailySittingData[date] = (dailySittingData[date] || 0) + sittingDurationData[index];
  });

  const weeklyLabels = Object.keys(dailySittingData);
  const weeklyValues = Object.values(dailySittingData);

  // 🔹 Create Heatmap Data Structure
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

  const heatmapData = new Array(7).fill(0).map(() => new Array(24).fill(0));

  // 🔹 Adjusted heatmap data calculation
timestamps.forEach((timestamp, index) => {
  let dayIndex = timestamp.getDay(); // 0 = Sunday, 6 = Saturday
  if (dayIndex === 0) dayIndex = 6; // Adjust Sunday to last index

  const hourIndex = timestamp.getHours();
  heatmapData[dayIndex][hourIndex] += sittingDurationData[index] || 0;
});


  // ===========================
  // ✅ Posture Analysis (Right vs Wrong)
  // ===========================
  const postureData = {
    labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    datasets: [
      {
        label: "Right Posture (%)",
        data: [80, 75, 78, 85, 88, 90, 92], // Example data
        backgroundColor: "green",
      },
      {
        label: "Wrong Posture (%)",
        data: [20, 25, 22, 15, 12, 10, 8], // Example data
        backgroundColor: "red",
      },
    ],
  };

  // No need to redefine dailySittingData as it's already defined above
  const dailySittingLabels = Object.keys(dailySittingData);
  const dailySittingValues = Object.values(dailySittingData);

  return (
    <div className="analysis-container">
      <h1>📊 Weight & Sitting Analysis</h1>

      {/* Charts Grid Layout - Weight Analysis */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>📈 Weight Trends Over Time</h3>
          <Line data={{ labels: dailyWeightLabels, datasets: [{ label: "Avg Weight Per Day (kg)", data: dailyWeightValues, borderColor: "blue", tension: 0.2 }] }} />
        </div>

        <div className="chart-card">
          <h3>⚖️ Weight Distribution</h3>
          <Pie data={{ labels: ["Light (<60kg)", "Average (60-90kg)", "Heavy (>90kg)"], datasets: [{ data: [weightData.filter((w) => w < 60).length, weightData.filter((w) => w >= 60 && w <= 90).length, weightData.filter((w) => w > 90).length], backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"] }] }} />
        </div>
      </div>

      {/* Charts Grid Layout - Sitting Duration */}
      <div className="chart-grid">
        <div className="chart-card">
          <h3>📅 Daily Sitting Trends</h3>
          <Bar data={{ labels: dailyHours, datasets: [{ label: "Sitting Duration (mins)", data: dailyDurations, backgroundColor: "blue" }] }} />
        </div>

        <div className="chart-card">
          <h3>📈 Weekly Sitting Patterns</h3>
          <Line data={{ labels: weeklyLabels, datasets: [{ label: "Total Sitting Duration per Day (mins)", data: weeklyValues, borderColor: "green", tension: 0.2 }] }} />
        </div>
      </div>

      {/* Charts Grid Layout - Posture and Sitting Duration */}
      <div className="chart-grid">
        {/* ✅ Right vs Wrong Posture Bar Chart */}
        <div className="chart-card">
          <h3>📊 Right vs Wrong Posture vs Day</h3>
          <Bar data={postureData} />
        </div>

        {/* ✅ Average Sitting Duration Per Day Bar Chart */}
        <div className="chart-card">
          <h3>⏳ Average Sitting Duration Per Day</h3>
          <Bar
            data={{
              labels: dailySittingLabels,
              datasets: [{ label: "Sitting Duration (mins)", data: dailySittingValues, backgroundColor: "blue" }],
            }}
          />
        </div>
      </div>

      {/* ✅ Heatmap of Sitting Behavior */}
      <div className="chart-card heatmap-container">
        <h3>🔥 Heatmap of Sitting Behavior</h3>
        <div className="heatmap-wrapper">
          <Heatmap 
            xLabels={hours} 
            yLabels={weekDays} 
            data={heatmapData}
            height={40}  
            squares
            cellStyle={(background, value) => ({
              background: `rgba(0, 123, 255, ${value / 100})`, 
              border: "1px solid white",
              color: value ? "white" : "black",
            })}
            xLabelsStyle={{ fontSize: "12px", color: "#333", transform: "rotate(-45deg)" }} 
            yLabelsStyle={{ fontSize: "14px", fontWeight: "bold" }}
          />
        </div>
      </div>
    </div>
  );
}