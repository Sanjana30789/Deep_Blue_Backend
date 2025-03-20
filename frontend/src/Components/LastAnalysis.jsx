// LastAnalysis.jsx

import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./LastAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function LastAnalysis() {
  const [sensorData, setSensorData] = useState([]);
  const [user, setUser] = useState(null);
  const [currentWeight, setCurrentWeight] = useState(null);
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
          setCurrentWeight(latestReading.weight);
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

  const processWeightData = () => {
    if (!sensorData.length) return {
      timeLabels: [],
      weightValues: [],
      dailyLabels: [],
      dailyAverages: [],
      categories: {},
      weightDistribution: { Light: 0, Average: 0, Heavy: 0 }
    };

    const timeLabels = sensorData.map(d => new Date(d.timestamp).toLocaleTimeString());
    const weightValues = sensorData.map(d => d.weight);

    // Daily averages
    const dailyWeightData = sensorData.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { sum: 0, count: 0 };
      }
      acc[date].sum += curr.weight;
      acc[date].count += 1;
      return acc;
    }, {});

    const dailyLabels = Object.keys(dailyWeightData);
    const dailyAverages = dailyLabels.map(
      date => dailyWeightData[date].sum / dailyWeightData[date].count
    );

    // BMI Categories
    const categories = {
      Underweight: weightValues.filter(w => w < 18.5).length,
      Normal: weightValues.filter(w => w >= 18.5 && w < 25).length,
      Overweight: weightValues.filter(w => w >= 25 && w < 30).length,
      Obese: weightValues.filter(w => w >= 30).length
    };

    // Weight Distribution
    const weightDistribution = {
      Light: weightValues.filter(w => w < 60).length,
      Average: weightValues.filter(w => w >= 60 && w <= 90).length,
      Heavy: weightValues.filter(w => w > 90).length
    };

    return {
      timeLabels,
      weightValues,
      dailyLabels,
      dailyAverages,
      categories,
      weightDistribution
    };
  };

  const {
    timeLabels,
    weightValues,
    dailyLabels,
    dailyAverages,
    categories,
    weightDistribution
  } = processWeightData();

  // Chart Configurations
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

  const dailyWeightConfig = {
    labels: dailyLabels,
    datasets: [{
      label: 'Average Daily Weight (kg)',
      data: dailyAverages,
      borderColor: 'rgb(153, 102, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      tension: 0.1,
      fill: true
    }]
  };

  const weightCategoryConfig = {
    labels: Object.keys(categories),
    datasets: [{
      data: Object.values(categories),
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ]
    }]
  };

  const weightDistributionConfig = {
    labels: ["Light (<60kg)", "Average (60-90kg)", "Heavy (>90kg)"],
    datasets: [{
      data: [
        weightDistribution.Light,
        weightDistribution.Average,
        weightDistribution.Heavy
      ],
      backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      }
    }
  };

  return (
    <div className="lastanalysis-container">
      <h1>Weight Analysis Dashboard</h1>
      
      {/* First Row */}
      <div className="chart-row">
        <div className="chart-card current-weight">
          <h2>Current Weight</h2>
          <div className="weight-display">
            <div className="weight-value">
              {currentWeight ? `${currentWeight.toFixed(1)} kg` : 'No data'}
            </div>
            <div className="weight-timestamp">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="chart-card">
          <h2>Real-time Weight Trends</h2>
          <div className="chart-wrapper">
            <Line 
              data={weightTrendConfig}
              options={{
                ...chartOptions,
                scales: {
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="chart-row">
        <div className="chart-card">
          <h2>Daily Weight Trends</h2>
          <div className="chart-wrapper">
            <Line 
              data={dailyWeightConfig}
              options={{
                ...chartOptions,
                scales: {
                  y: { beginAtZero: false }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card">
          <h2>Weight Categories</h2>
          <div className="chart-wrapper">
            <Pie 
              data={weightCategoryConfig}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Third Row */}
      <div className="chart-row">
        <div className="chart-card">
          <h2>⚖️ Weight Distribution</h2>
          <div className="chart-wrapper">
            <Pie 
              data={weightDistributionConfig}
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="chart-card stats-card">
          <h2>Weight Statistics</h2>
          <div className="stats-container">
            <div className="stat-item">
              <h3>Average Weight</h3>
              <p>{weightValues.length > 0 
                ? (weightValues.reduce((a, b) => a + b, 0) / weightValues.length).toFixed(1) 
                : 0} kg</p>
            </div>
            <div className="stat-item">
              <h3>Max Weight</h3>
              <p>{weightValues.length > 0 ? Math.max(...weightValues).toFixed(1) : 0} kg</p>
            </div>
            <div className="stat-item">
              <h3>Min Weight</h3>
              <p>{weightValues.length > 0 ? Math.min(...weightValues).toFixed(1) : 0} kg</p>
            </div>
            <div className="stat-item">
              <h3>Total Readings</h3>
              <p>{weightValues.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
