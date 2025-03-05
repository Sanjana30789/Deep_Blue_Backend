// import React, { useState, useEffect } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
// import { useNavigate } from "react-router-dom";
// import "./style.css";
// import defaultProfile from '../assets/sanjana.png'; // Default profile image
// import PieChartPage from './Piechart';
// import GraphPage from './GraphPage';

// ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

// export default function Dashboard() {
//   const [sensorData, setSensorData] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//         try {
//             const response = await fetch("http://localhost:5000/user", {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             });

//             const userData = await response.json();
//             if (response.ok) {
//                 setUser(userData);
//             } else {
//                 console.error("Error fetching user:", userData.msg);
//             }
//         } catch (error) {
//             console.error("Error fetching user:", error);
//         }
//     };

//     const fetchSensorData = async () => {
//       try {
//           const response = await fetch(`http://localhost:5000/data/HARSH`);
//           if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
//           const data = await response.json();
//           console.log("Fetched Sensor Data:", data);
  
//           // Handle case where data is inside an object
//           const sensorArray = Array.isArray(data) ? data : data.data;
  
//           if (!Array.isArray(sensorArray)) {
//               console.error("Error: Sensor data is not an array:", sensorArray);
//               return;
//           }
  
//           const today = new Date().toLocaleDateString();
//           const todayReadings = sensorArray.filter(reading =>
//               new Date(reading.timestamp).toLocaleDateString() === today
//           );
  
//           console.log("Today's Readings:", todayReadings);
//           setSensorData(todayReadings.length > 0 ? todayReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] : null);
//       } catch (error) {
//           console.error("Error fetching sensor data:", error);
//       }
//   };
  
  

//     fetchUserData();
//     fetchSensorData();

//     const interval = setInterval(fetchSensorData, 1000); // Refresh every 9 seconds
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   return (
//     <div className="dashboard-container">
//       <div className="sidebar">
//         <img src={user?.profilePhoto ? user.profilePhoto : defaultProfile} 
//              alt="User" 
//              className="profile-img" 
//              onError={(e) => e.target.src = defaultProfile} 
//         />
//         <h2>{user?.name || "Loading..."}</h2>
//         <p className="email">{user?.email || ""}</p>
//         <div className="account-info">
//           <h3>Account Details</h3>
//           <p>Status: <span className="status">Active</span></p>
//           <p>Joined: Jan 2024</p>
//           {/* <p>Chair ID: <span>{user?.chair_id || "Not Assigned"}</span></p> */}
//         </div>
//         <button className="logout-button" onClick={handleLogout}>Logout</button>
//       </div>

//       <div className="content">
//         <h1>📊 Today's Sensor Readings</h1>
//         <div className="readings-container">
//           {sensorData ? (
//             <div className="date-group today-highlight">
//               <h2>📅 Latest Reading</h2>
//               <div className="readings-row">
//                 <div className="reading-card">
//                   <p>Sitting Duration: <span>{sensorData.sittingDuration} mins</span></p>
//                   <p>FSR Reading: <span>{sensorData.fsr1}</span></p>
//                   <p>FSR Reading: <span>{sensorData.fsr2}</span></p>
//                   <p>FSR Reading: <span>{sensorData.fsr3}</span></p>
//                   <p>FSR Reading: <span>{sensorData.fsr4}</span></p>
//                   <p>Total Sitting Duration: <span>{sensorData.totalsittingduration} mins</span></p>

//                   <p className="timestamp">⏱ {new Date(sensorData.timestamp).toLocaleString()}</p>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <p>No data available for today</p>
//           )}
//         </div>

        
//       </div>
//     </div>
//   );
// }


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

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <img 
          src={user?.profilePhoto ? user.profilePhoto : defaultProfile} 
          alt="User" 
          className="profile-img" 
          onError={(e) => e.target.src = defaultProfile} 
        />
        <h2>{user?.name || "Loading..."}</h2>
        <p className="email">{user?.email || ""}</p>
        <nav className="menu">
          <button>Profile</button>
          <button>Settings</button>
          <button>Customer</button>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* First Row */}
        <div className="row">
          {/* Sensor Readings */}
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

          {/* Images and Current Time */}
          <div className="box image-box">
            {/* <h2>🖼️ Image Feed</h2> */}
            <img src={iot} alt="Live Feed" />
            <p>Current Time: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="row">
          {/* Pie Chart */}
          <div className="box">
            <h2>📊 Sitting vs. Active Time</h2>
            <PieChartPage />
          </div>

          {/* Line Chart */}
          <div className="box">
            <h2>📈 Line Chart</h2>
            <GraphPage />
          </div>

          {/* Histogram */}
          <div className="box">
            <h2>📊 Histogram</h2>
            <WeightHistogram />
          </div>
        </div>
      </div>
    </div>
  );
}

