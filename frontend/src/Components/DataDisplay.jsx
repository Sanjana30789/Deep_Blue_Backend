import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./style.css"; 
import sanjana from '../assets/sanjana.png';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Fetch data from backend
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data"); // Your backend URL
        const data = await response.json();
        console.log("Fetched data:", data); // Debugging: Check if data is correctly fetched
        
        // Filter out duplicates based on sittingDuration and fsrReading
        const filteredData = removeDuplicates(data);
        
        // Group data by date
        const groupedData = groupByDate(filteredData);
        setSensorData(groupedData);
        
        // Prepare data for the chart
        prepareChartData(groupedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s

    return () => clearInterval(interval);
  }, []);

  // Function to filter out duplicates based on sittingDuration and fsrReading
  const removeDuplicates = (data) => {
    const seen = new Set();
    return data.filter((item) => {
      const uniqueKey = `${item.sittingDuration}-${item.fsrReading}`; // Create unique key from sittingDuration and fsrReading
      if (seen.has(uniqueKey)) {
        return false; // Duplicate found, skip this item
      } else {
        seen.add(uniqueKey); // Mark as seen
        return true; // Include item in filtered data
      }
    });
  };

  // Function to group data by date
  const groupByDate = (data) => {
    return data.reduce((acc, curr) => {
      const date = new Date(curr.timestamp).toLocaleDateString(); // Extract date (ignores time)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(curr);
      return acc;
    }, {});
  };

  // Function to prepare chart data
  const prepareChartData = (groupedData) => {
    const labels = [];
    const sittingDurations = [];
    const fsrReadings = [];

    // Loop through the data and populate the arrays for chart
    for (let date in groupedData) {
      labels.push(date);
      const dailyData = groupedData[date];
      const totalSittingDuration = dailyData.reduce((sum, item) => sum + item.sittingDuration, 0);
      const totalFSRReading = dailyData.reduce((sum, item) => sum + item.fsrReading, 0);

      sittingDurations.push(totalSittingDuration);
      fsrReadings.push(totalFSRReading);
    }

    // Set chart data
    setChartData({
      labels,
      datasets: [
        {
          label: 'Sitting Duration (mins)',
          data: sittingDurations,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
        },
        {
          label: 'FSR Reading',
          data: fsrReadings,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
        },
      ],
    });
  };

  // Logic for recommendations
  const getRecommendations = () => {
    // Flatten the grouped data to a single array
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
  

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    navigate("/"); // Redirect to signup page
  };

  return (
    <div className="dashboard-container">
      {/* Left Sidebar */}
      <div className="sidebar">
        <img src={sanjana} alt="User" className="profile-img" />
        <h2>Sanjana Choubey</h2>
        <p className="email">sanju763@gmail.com</p>
        <div className="account-info">
          <h3>Account Details</h3>
          <p>Status: <span className="status">Active</span></p>
          <p>Joined: Jan 2024</p>
        </div>
        {/* Logout Button */}
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      {/* Right Content - Sensor Readings */}
      <div className="content">
        <h1>📊 Live Sensor Readings</h1>
        <div className="readings-container">
          {/* Display Chart */}
          {chartData.labels ? (
            <Line data={chartData} options={{ responsive: true }} />
          ) : (
            <p>Loading chart...</p>
          )}
          
          {/* Display Recommendations */}
          <div className="recommendations">
            <h3>Recommendations</h3>
            <p>{getRecommendations()}</p>
          </div>

          {Object.keys(sensorData).length > 0 ? (
            Object.entries(sensorData).map(([date, readings]) => (
              <div key={date} className="date-group">
                <h2>{date}</h2> {/* Display the date */}
                <div className="readings-row">
                  {readings.map((data, index) => (
                    <div key={index} className="reading-card">
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
      </div>
    </div>
  );
}
