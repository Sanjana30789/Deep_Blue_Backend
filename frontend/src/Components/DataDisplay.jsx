import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate, Link } from "react-router-dom";
import "./style.css";
import sanjana from '../assets/sanjana.png';
import PieChartPage from './Piechart';
import GraphPage from './GraphPage';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState({});
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();
        console.log("Fetched data:", data);

        const filteredData = removeDuplicates(data);
        const groupedData = groupByDate(filteredData);
        setSensorData(groupedData);
        prepareChartData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
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

  const getRecommendations = () => {
    const allData = Object.values(sensorData).flat();
    const totalSittingDuration = allData.reduce((sum, item) => sum + item.sittingDuration, 0);
    const avgSittingDuration = totalSittingDuration / allData.length;

    if (avgSittingDuration > 120) {
      return "You have been sitting for a long time. Consider standing up or walking for a few minutes.";
    } else if (avgSittingDuration < 30) {
      return "Good! You are staying active.";
    }
    return "Keep maintaining a balanced sitting time.";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <img src={sanjana} alt="User" className="profile-img" />
        <h2>Sanjana Choubey</h2>
        <p className="email">sanju763@gmail.com</p>
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
          <p><Link to="/health" style={{ textDecoration: 'none' }}><span className="status">Health Planner</span></Link></p>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="content">
        <h1>📊 Live Sensor Readings</h1>
        <div className="readings-container" style={{ width: "100%" }}>
          {Object.keys(sensorData).length > 0 ? (
            Object.entries(sensorData).map(([date, readings]) => (
              <div key={date} className="date-group" style={{ width: "100%" }}>
                <h2>{date}</h2>
                <div className="readings-row" style={{ display: "flex", flexWrap: "wrap", width: "100%", overflowX: "auto" }}>
                  {readings.map((data, index) => (
                    <div key={index} className="reading-card" style={{ flex: "0 0 auto", minWidth: "200px", margin: "5px" }}>
                      <p>Sitting Duration: <span>{data.sittingDuration} mins</span></p>
                      <p>FSR Reading: <span>{data.fsrReading}</span></p>
                      <p className="timestamp">⏱ {new Date(data.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
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
