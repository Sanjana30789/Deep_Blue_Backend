import React, { useState, useEffect } from "react";
import "./style.css"; 
import sanjana from '../assets/sanjana.png';

export default function Dashboard() {
  const [sensorData, setSensorData] = useState([]);

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
      </div>

      {/* Right Content - Sensor Readings */}
      <div className="content">
        <h1>📊 Live Sensor Readings</h1>
        <div className="readings-container">
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
