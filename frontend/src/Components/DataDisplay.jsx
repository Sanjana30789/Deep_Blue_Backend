import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import defaultProfile from '../assets/sanjana.png'; // Default profile image
import PieChartPage from './Piechart';
import GraphPage from './GraphPage';
import iot from '../assets/iot.jpg'; // IoT image
import WeightHistogram from './Histogram';
import UserProfile from './UserProfile';
import DataAnalysis from './graph';
import "./DataDisplay.css";
import Histogram from './weight';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [chairData, setChairData] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user not logged in.");
          return;
        }
    
        const response = await fetch("http://localhost:5000/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        const userData = await response.json();
        console.log("Fetched User Data:", userData);
    
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
        const sensorArray = Array.isArray(data) ? data : data.data;

        if (!Array.isArray(sensorArray)) {
          console.error("Error: Sensor data is not an array:", sensorArray);
          return;
        }

        const today = new Date().toLocaleDateString();
        const todayReadings = sensorArray.filter(reading =>
          new Date(reading.timestamp).toLocaleDateString() === today
        );

        setSensorData(todayReadings.length > 0 ? todayReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] : null);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    const fetchChairData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/chair/chair-data/HARSH`);
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        setChairData(data);

        if (data.sittingThreshold && sensorData?.sittingDuration > data.sittingThreshold) {
          setCountdown(data.relaxationTime);
        }
      } catch (error) {
        console.error("Error fetching chair data:", error);
      }
    };

    fetchUserData();
    fetchSensorData();
    fetchChairData();

    const interval = setInterval(() => {
      fetchSensorData();
      fetchChairData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="profile-section">
          <img
            src={user?.profilePic || defaultProfile}
            alt="Profile"
            className="profile-image"
            onError={(e) => {
              if (!e.target.dataset.error) {
                e.target.dataset.error = "true";
                e.target.src = defaultProfile;
              }
            }}
          />
          <h3>{user?.name || "User Name"}</h3>
        </div>

        <button onClick={() => navigate('/profile')} className='sidebar-button'>👤 Profile</button>
        <button onClick={() => navigate('/about')} className='sidebar-button'>ℹ️ About Us</button>
        <button onClick={() => navigate('/faq')} className='sidebar-button'>❓ FAQ</button>
        <button onClick={() => navigate('/support')} className='sidebar-button'>📞 Customer Support</button>
        <button onClick={handleLogout} className='sidebar-button logout-btn'>🚪 Logout</button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">
          <div className="nav-left">
            <h1>Dashboard</h1>
          </div>
          <div className="nav-right">
            <span className="notification-icon">🔔</span>
            <button className="nav-button">⚙️ Settings</button>
          </div>
        </div>

        {/* Sensor Readings & IoT Live Feed */}
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


          <div className="box chair-box">
          <h2>🪑 Chair Data</h2>
       {chairData ? (
        <div>
        <p>Sitting Threshold: <span>{chairData.sitting_threshold} mins</span></p>
        <p>Relaxation Time: <span>{chairData.relaxation_time} mins</span></p>
        {countdown !== null && <p>Countdown: <span>{countdown} seconds</span></p>}
       </div>
    ) : (
      <p>No chair data available</p>
    )}
  </div>

          <div className="box image-box">
            <img src={iot} alt="Live Feed" />
            <p>Current Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Chair Data */}
        {/* <div className="row">
          <div className="box chair-box">
            <h2>🪑 Chair Data</h2>
            {chairData ? (
              <div>
                <p>Sitting Threshold: <span>{chairData.sitting_threshold} mins</span></p>
                <p>Relaxation Time: <span>{chairData.relaxation_time} mins</span></p>
                {countdown !== null && <p>Countdown: <span>{countdown} seconds</span></p>}
              </div>
            ) : (
              <p>No chair data available</p>
            )}
          </div>
        </div> */}

        {/* Data Analysis */}
        <div className="row">
          <div className="box">
            <h2>📊 Data Analysis</h2>
            <DataAnalysis />
          </div>

          <div className="box">
            <h2>📊 Histogram Analysis</h2>
            <Histogram />
          </div>
        </div>
      </div>
    </div>
  );
}
