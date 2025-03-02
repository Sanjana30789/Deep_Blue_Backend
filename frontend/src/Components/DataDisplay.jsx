import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import "./style.css";
import defaultProfile from '../assets/sanjana.png'; // Default profile image
import PieChartPage from './Piechart';
import GraphPage from './GraphPage';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({});
  const [chartData, setChartData] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/user");
        const data = await response.json();
  
        if (response.ok) {
          setUser(data);
        } else {
          console.error("Error fetching user data:", data.msg);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();
  
        if (data.length > 0) {
          const groupedData = {};
  
          data.forEach((reading) => {
            const date = new Date(reading.timestamp).toLocaleDateString();
            groupedData[date] = reading;
          });
  
          setSensorData(groupedData);
        }
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
  
    fetchUserData();
    fetchSensorData();
  
    const interval = setInterval(async () => {
      try {
        const today = new Date().toLocaleDateString();
        const response = await fetch("http://localhost:5000/data"); 
        const latestData = await response.json();
  
        setSensorData((prevData) => ({
          ...prevData,
          [today]: latestData,
        }));
      } catch (error) {
        console.error("Error updating today's data:", error);
      }
    }, 9000);  // Set a reasonable interval
  
    return () => clearInterval(interval);
  }, []);
  
  

  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter((item) => {
      const uniqueKey = `${item.sittingDuration}-${item.fsrReading}`;
      if (seen.has(uniqueKey)) {
        return false;
      } else {
        seen.add(uniqueKey);
        return true;
      }
    });
  };

  const groupByDate = (data) => {
    return data.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
      <img src={user?.profilePhoto ? user.profilePhoto : defaultProfile} alt="User" className="profile-img" onError={(e) => e.target.src = defaultProfile} />


        <h2>{user?.name || "Loading..."}</h2>
        <p className="email">{user?.email || ""}</p>

        <div className="account-info">
          <h3>Account Details</h3>
          <p>Status: <span className="status">Active</span></p>
          <p>Joined: Jan 2024</p>
        </div>

        <div className="data-info">
          <h3>Pages</h3>
          <p><span className="status">Dashboard</span></p>
          <p><span className="status">Profile Form</span></p>
          <p><span className="status">FAQ Page</span></p>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="content">
        <h1>📊 Live Sensor Readings</h1>
        <div className="readings-container">
  {Object.keys(sensorData).length > 0 ? (
    Object.entries(sensorData).map(([date, reading]) => (
      <div 
        key={date} 
        className={`date-group ${date === new Date().toLocaleDateString() ? "today-highlight" : ""}`}
      >
        <h2>{date === new Date().toLocaleDateString() ? "📅 Today’s Readings" : `📅 ${date}`}</h2>
        <div className="readings-row">
          <div className="reading-card">
            <p>Sitting Duration: <span>{reading.sittingDuration} mins</span></p>
            <p>FSR Reading: <span>{reading.fsr1}</span></p>
            {/* <p>Measured Weight: <span>{reading.measureweight}</span></p> */}
            <p className="timestamp">⏱ {new Date(reading.timestamp).toLocaleString()}</p>
          </div>
        </div>
      </div>
    ))
  ) : (
    <p>No data available</p>
  )}
</div>


        <div className="piechart-container">
          <h2>📊 Sitting vs. Active Time</h2>
          <PieChartPage />
        </div>

        <div className="piechart-container">
          <h2>📊 Sitting vs. Active Time</h2>
          <GraphPage />
        </div>
      </div>
    </div>
  );
}




