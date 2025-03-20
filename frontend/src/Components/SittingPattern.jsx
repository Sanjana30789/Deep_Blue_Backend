// SittingPattern.jsx

import React, { useState, useEffect } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SittingPattern() {
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

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const processSittingData = () => {
    if (!sensorData.length) return {
      timeLabels: [],
      durationValues: [],
      dailyData: {},
      hourlyData: {},
      breakPatterns: { good: 0, moderate: 0, poor: 0 },
      totalDuration: 0
    };

    // Time-based data
    const timeLabels = sensorData.map(d => new Date(d.timestamp).toLocaleTimeString());
    const durationValues = sensorData.map(d => d.sittingDuration);

    // Daily aggregation
    const dailyData = sensorData.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = { total: 0, count: 0 };
      }
      acc[date].total += curr.sittingDuration;
      acc[date].count += 1;
      return acc;
    }, {});

    // Hourly patterns
    const hourlyData = sensorData.reduce((acc, curr) => {
      const hour = new Date(curr.timestamp).getHours();
      if (!acc[hour]) acc[hour] = 0;
      acc[hour] += curr.sittingDuration;
      return acc;
    }, {});

    // Break patterns analysis
    const breakPatterns = sensorData.reduce((acc, curr) => {
      if (curr.sittingDuration < 30) acc.good++;
      else if (curr.sittingDuration < 60) acc.moderate++;
      else acc.poor++;
      return acc;
    }, { good: 0, moderate: 0, poor: 0 });

    // Total sitting duration
    const totalDuration = durationValues.reduce((a, b) => a + b, 0);

    return {
      timeLabels,
      durationValues,
      dailyData,
      hourlyData,
      breakPatterns,
      totalDuration
    };
  };

  const {
    timeLabels,
    durationValues,
    dailyData,
    hourlyData,
    breakPatterns,
    totalDuration
  } = processSittingData();

  // Chart Configurations
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

  const durationVsDateConfig = {
    labels: Object.keys(dailyData),
    datasets: [{
      label: 'Total Daily Sitting Duration (minutes)',
      data: Object.values(dailyData).map(d => d.total),
      backgroundColor: '#2196F3',
      borderColor: '#1976D2',
      borderWidth: 1
    }]
  };

  const hourlyPatternConfig = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Average Sitting Duration by Hour',
      data: Array.from({ length: 24 }, (_, i) => hourlyData[i] || 0),
      backgroundColor: '#9C27B0',
      borderColor: '#7B1FA2',
      borderWidth: 1
    }]
  };

  const breakPatternsConfig = {
    labels: ['Good Breaks (<30m)', 'Moderate (30-60m)', 'Poor Breaks (>60m)'],
    datasets: [{
      data: [
        breakPatterns.good,
        breakPatterns.moderate,
        breakPatterns.poor
      ],
      backgroundColor: [
        '#4CAF50',
        '#FFC107',
        '#F44336'
      ]
    }]
  };

  return (
    <div className="sitting-pattern-container">
      <h1>Sitting Pattern Analysis</h1>

      {/* Current Status Section */}
      <div className="status-row">
        <div className="status-card current-duration">
          <h2>Current Session</h2>
          <div className="duration-display">
            <div className="duration-value">
              {formatDuration(currentSittingDuration)}
            </div>
            <div className="duration-label">
              Current Sitting Duration
            </div>
            <div className="update-time">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          </div>
        </div>

        <div className="status-card total-duration">
          <h2>Total Today</h2>
          <div className="duration-display">
            <div className="duration-value">
              {formatDuration(totalDuration)}
            </div>
            <div className="duration-label">
              Total Sitting Time
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="chart-row">
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

        <div className="chart-card">
          <h2>Daily Sitting Patterns</h2>
          <div className="chart-wrapper">
            <Bar 
              data={durationVsDateConfig}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Sitting Duration vs Date' }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Total Duration (minutes)' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="chart-row">
        <div className="chart-card">
          <h2>Hourly Sitting Patterns</h2>
          <div className="chart-wrapper">
            <Bar 
              data={hourlyPatternConfig}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Average Sitting Duration by Hour' }
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

        <div className="chart-card">
          <h2>Break Pattern Analysis</h2>
          <div className="chart-wrapper">
            <Doughnut 
              data={breakPatternsConfig}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right' }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <h3>Average Session Duration</h3>
          <p>{formatDuration(totalDuration / durationValues.length || 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Longest Session</h3>
          <p>{formatDuration(Math.max(...durationValues) || 0)}</p>
        </div>
        <div className="stat-card">
          <h3>Total Sessions</h3>
          <p>{durationValues.length}</p>
        </div>
        <div className="stat-card">
          <h3>Break Quality Score</h3>
          <p>{Math.round((breakPatterns.good / (breakPatterns.good + breakPatterns.moderate + breakPatterns.poor) || 0) * 100)}%</p>
        </div>
      </div>
    </div>
  );
}