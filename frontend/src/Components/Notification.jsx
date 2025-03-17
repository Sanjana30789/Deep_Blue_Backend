import React, { useState, useEffect } from "react";

export default function Notifications() {
  const [sensorData, setSensorData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  // Fetch sensor data every 5 seconds
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data/HARSH"); // Replace HARSH with dynamic chair_id
        if (!response.ok) throw new Error(API `Error: ${response.status}`);

        const data = await response.json();
        const latestData = Array.isArray(data)
          ? data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0]
          : data;

        setSensorData(latestData);
        checkFSRAlerts(latestData);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };

    fetchSensorData();
    const interval = setInterval(fetchSensorData, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Function to check FSR alerts and trigger JavaScript alerts
  const checkFSRAlerts = (data) => {
    if (!data) return;
    const { fsr1, fsr2, fsr3, fsr4, sittingDuration, measureweight, weight } = data;

    const fsrValues = [fsr1, fsr2, fsr3, fsr4];
    const maxFSR = Math.max(...fsrValues);
    const minFSR = Math.min(...fsrValues);

    let newAlerts = [];

    // ⚠ Condition 1: Uneven Pressure (Bad Posture)
    if (maxFSR - minFSR > 1500) {
      newAlerts.push("⚠ Posture Alert: Uneven pressure detected. Adjust your sitting position.");
      alert("⚠ Posture Alert: Uneven pressure detected. Adjust your sitting position.");
    }

    // 🚨 Condition 2: High Pressure (Possible Risk of Damage)
    if (fsrValues.some(fsr => fsr > 5000)) {
      newAlerts.push("🚨 High Pressure Alert: Excessive force detected! Adjust posture.");
      alert("🚨 High Pressure Alert: Excessive force detected! Adjust posture.");
    }

    // ℹ Condition 3: No Pressure (User Left Seat)
    if (fsrValues.every(fsr => fsr < 500)) {
      newAlerts.push("ℹ Seat Empty: No user detected on the seat.");
      alert("ℹ Seat Empty: No user detected on the seat.");
    }

    // ⏳ Condition 4: Long Sitting Duration
    if (sittingDuration >= 60) {
      newAlerts.push("⏳ Health Alert: You've been sitting for too long! Please take a break.");
      alert("⏳ Health Alert: You've been sitting for too long! Please take a break.");
    }

    // 🚨 Condition 5: Low Weight Detected (Child or Object Instead of a Person)
    if (measureweight && weight < 40) {
      newAlerts.push("⚠ Light Weight Alert: Low weight detected. Ensure the user is seated properly.");
      alert("⚠ Light Weight Alert: Low weight detected. Ensure the user is seated properly.");
    }

    // 🚨 Condition 6: Overload (Too Much Weight on the Seat)
    if (measureweight && weight > 150) {
      newAlerts.push("⚠ Overload Alert: Weight exceeds safe limits! Risk of damage.");
      alert("⚠ Overload Alert: Weight exceeds safe limits! Risk of damage.");
    }

    setAlerts(newAlerts);
  };

  return (
    <div className="notifications-container">
      <h2>🔔 <strong>Real-Time Notifications</strong></h2>

      {/* Displaying Real-Time Sensor Data */}
      <div className="sensor-data-box">
        <h3>📊 Latest Sensor Readings</h3>
        {sensorData ? (
          <div className="sensor-card">
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
          <p>Loading sensor data...</p>
        )}
      </div>

      {/* Displaying Alerts */}
      <div className="alerts-box">
        <h3>⚠ Active Alerts</h3>
        {alerts.length > 0 ? (
          <ul className="alert-list">
            {alerts.map((alert, index) => (
              <li key={index} className="alert-item">{alert}</li>
            ))}
          </ul>
        ) : (
          <p>No active alerts. Everything looks good! ✅</p>
        )}
      </div>
    </div>
  );
}