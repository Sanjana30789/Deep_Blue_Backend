import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import "./style.css";
import defaultProfile from '../assets/sanjana.png'; // Default profile image
import PieChartPage from './Piechart';
import GraphPage from './GraphPage';
import iot from '../assets/iot.jpg'; // IoT image
import WeightHistogram from './Histogram'
import UserProfile from './UserProfile';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });

        const userData = await response.json();
        if (response.ok) {
          setUser(userData);
        } else {
          console.error("Error fetching user:", userData.msg);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchSensorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/data/HARSH`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Sensor Data:", data);

        const sensorArray = Array.isArray(data) ? data : data.data;

        if (!Array.isArray(sensorArray)) {
          console.error("Error: Sensor data is not an array:", sensorArray);
          return;
        }

        const today = new Date().toLocaleDateString();
        const todayReadings = sensorArray.filter(reading =>
          new Date(reading.timestamp).toLocaleDateString() === today
        );

        console.log("Today's Readings:", todayReadings);
        setSensorData(todayReadings.length > 0 ? todayReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] : null);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchUserData();
    fetchSensorData();

    const interval = setInterval(fetchSensorData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleAboutClick = () => {
    navigate('/about');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <button onClick={handleProfileClick} className='sidebar-button'>Profile</button>
        {showProfile && <UserProfile />}
        <button onClick={handleAboutClick} className='sidebar-button'>About Us</button>
        <button onClick={handleLogout} className='sidebar-button'>Logout</button>
      </div>

      <div className="main-content">
        <div className="row">
          <div className="box readings-box">
            <h2>📊 Today's Sensor Readings</h2>
            {sensorData ? (
              <div className="reading-card">
                <p>Sitting Duration: <span>{sensorData.sittingDuration} mins</span></p>
                <p>FSR Reading 1: <span>{sensorData.fsr1}</span></p>
                <p>FSR Reading 2: <span>{sensorData.fsr2}</span></p>
                <p>FSR Reading 3: <span>{sensorData.fsr3}</span></p>
                <p>FSR Reading 4: <span>{sensorData.fsr4}</span></p>
                <p>Weight: <span>{sensorData.weight}</span></p>
                <p>Total Sitting Duration: <span>{sensorData.totalsittingduration} mins</span></p>
                <p className="timestamp">⏱ {new Date(sensorData.timestamp).toLocaleString()}</p>
              </div>
            ) : (
              <p>No data available for today</p>
            )}
          </div>

          <div className="box image-box">
            <img src={iot} alt="Live Feed" />
            <p>Current Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="row">
          <div className="box">
            <h2>📊 Sitting vs. Active Time</h2>
            <PieChartPage />
          </div>

          <div className="box">
            <h2>📈 Line Chart</h2>
            <GraphPage />
          </div>

          <div className="box">
            <h2>📊 Histogram</h2>
            <WeightHistogram />
          </div>
        </div>
      </div>
    </div>
  );
}

