import React, { useState, useEffect } from "react";
import "./style.css"; // Import the CSS file

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await fetch("https://deep-blue-backend-1.onrender.com/data"); // Your backend URL
        const data = await response.json();
        setSensorData(data.reverse().slice(0, 5)); // Show latest 5 readings
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <img src="https://via.placeholder.com/100" alt="User" className="profile-img" />
        <h2>John Doe</h2>
        <p className="email">johndoe@example.com</p>
        <div className="account-info">
          <h3>Account Details</h3>
          <p>Status: <span className="status">Active</span></p>
          <p>Joined: Jan 2024</p>
        </div>
      </div>

      {/* Right Content - Sensor Readings */}
      <div className="content">
        <h1>📊 Live Sensor Readings</h1>
        <div className="readings-container">
          {sensorData.length > 0 ? (
            sensorData.map((data, index) => (
              <div key={index} className="reading-card">
                <p>Sitting Duration: <span>{data.sittingDuration} mins</span></p>
                <p>FSR Reading: <span>{data.fsrReading}</span></p>
                <p className="timestamp">⏱ {new Date(data.createdAt).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>
    </div>
  );
}
