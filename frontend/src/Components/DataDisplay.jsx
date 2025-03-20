import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";
import defaultProfile from '../assets/sanjana.png'; // Default profile image
import PosturePieChart from './Piechart';
import GraphPage from './GraphPage';
import iot from '../assets/iot.jpg'; // IoT image
import WeightHistogram from './Histogram';
import UserProfile from './UserProfile';
import DataAnalysis from './graph';
import "./DataDisplay.css";
import Histogram from './weight';
import PosturePredictor from './PosturePredictor'
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import ChairMonitor from "./Notification";
import  ChairAnalysisChart from './Analytics'
import HeatmapComponent from './Heatmap'
import FinalAnalysis from './Analytics'
import SettingsPage from './ExercisePopup'
import PostureModel from "./PostureModel";
import AnimePosture from './finalposture'
import Sitting from './Sitting'
import Weight from './Weigh'


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [chairData, setChairData] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [user, setUser] = useState(null);
  const [showExercise, setShowExercise] = useState(false);
  const [sittingThreshold, setSittingThreshold] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const progress = (countdown / (chairData?.relaxation_time || 30)) * circumference;
  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchUserData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user not logged in.");
                return;
            }

            const response = await fetch("http://localhost:5000/api/auth/user", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const userData = await response.json();

            if (response.ok) {
                console.log("Fetched User Data:", userData);
                setUser(userData);

                if (userData?.chair_id) {
                    fetchChairData(userData.chair_id);
                }
            } else {
                console.error("Error fetching user:", userData.msg);
            }
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    const fetchSensorData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found, user not logged in.");
                return;
            }

            const userResponse = await fetch("http://localhost:5000/api/auth/user", {
                method: "GET",
                headers: { 
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            const userData = await userResponse.json();
            if (!userResponse.ok) {
                console.error("Error fetching user:", userData.msg);
                return;
            }

            if (!userData?.chair_id) {
                console.log("No chair assigned to user, no sensor data available.");
                setSensorData(null);
                return;
            }

            const response = await fetch(`http://localhost:5000/data/${userData.chair_id}`);
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

            if (todayReadings.length > 0) {
                const latestReading = todayReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

                if (latestReading.sitting_duration !== undefined) {
                    latestReading.sitting_duration = formatDuration(latestReading.sitting_duration);
                }

                setSensorData(latestReading);
            } else {
                setSensorData(null);
            }
        } catch (error) {
            console.error("Error fetching sensor data:", error);
        }
    };

    const fetchChairData = async (chair_id) => {
        if (!chair_id) {
            console.error("Chair ID is missing.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/chair/chair-data/${chair_id}`);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();
            setChairData(data);
            setSittingThreshold(data.sitting_threshold); // Store sitting threshold

            if (data.sitting_threshold && sensorData?.sitting_duration > data.sitting_threshold) {
              setCountdown(data.relaxation_time);
          }
          
        } catch (error) {
            console.error("Error fetching chair data:", error);
        }
    };

    // ✅ Initial Data Fetch
    fetchUserData();
    fetchSensorData();

    // ✅ Periodic Sensor and Chair Data Fetch
    const interval = setInterval(() => {
        fetchSensorData();
        if (user?.chair_id) {
            fetchChairData(user.chair_id);
        }
    }, 1000);

    return () => {
        clearInterval(interval);
    };
}, []); 

// ✅ **Trigger Exercise Popup Effect (New Code)**
useEffect(() => {
  if (sensorData?.sittingDuration > chairData?.sitting_threshold) {
      setShowExercise(true);
      setTimeLeft(chairData?.relaxation_time);
  } else {
      setShowExercise(false);
  }
}, [sensorData, chairData]);



const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return "00:00:00";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

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

  const handleShowExercise = () => {
    console.log("Exercise Popup Triggered");
    setShowExercise(true);
  };

  
  useEffect(() => {
      if (chairData && chairData.relaxation_time > 0) {
          setCountdown(chairData.relaxation_time);
          const interval = setInterval(() => {
              setCountdown(prev => (prev > 0 ? prev - 1 : 0));
          }, 1000);

          return () => clearInterval(interval);
      }
  }, [chairData]);


  const getCircularProgress = () => {
      const percentage = (countdown / chairData.relaxation_time) * 100;
      return `conic-gradient(#4CAF50 ${percentage}%, #ddd ${percentage}% 100%)`;
  };
  
  useEffect(() => {
    if (countdown > 0) {
        const timer = setInterval(() => {
            setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }
}, [countdown]);

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
        <button onClick={() => navigate('/Posture')} className='sidebar-button'> PREDICT POSTURE</button>
        {/* <button onClick={() => navigate('/model')} className='sidebar-button'>📞 VIDEO</button> */}
        <button onClick={() => navigate('/health')} className='sidebar-button'>Health Buddy</button>
        <button onClick={() => navigate('/ai')} className='sidebar-button'>Ask AI</button>
        <button onClick={() => navigate('/analysis')} className='sidebar-button'>Detailed Analysis</button>
        <button onClick={() => navigate('/settings')} className='sidebar-button'>SETTINGS</button>
        <button onClick={() => navigate('/developer')} className='sidebar-button'>Developvers Page</button>
        <button onClick={() => navigate('/last-analysis')} className='sidebar-button'>📊 Weight Analysis</button>
        <button onClick={() => navigate('/sitting-pattern')} className='sidebar-button'>📊 Sitting Analysis</button>
        <button onClick={() => navigate('/exercise')} className='sidebar-button'>🏋️ Exercise</button>  {/* ✅ New Exercise Button */}
        <button onClick={handleLogout} className='sidebar-button logout-btn'>🚪 Logout</button>
        {/* <button onClick={handleShowExercise}>Show Exercise</button> */}

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
  {/* Sitting Duration Card */}
  <div className="box readings-box">
    <h2>📊 Sitting Duration</h2>
    {sensorData ? (
      <div className="card-1">
      
           <span className="one">{formatDuration(sensorData.sittingDuration)}
            </span>
        
        {/* <p>
          Total Sitting Duration: <span>{formatDuration(sensorData.totalsittingduration)}</span>
        </p> */}
        {/* <p className="timestamp">⏱ {new Date(sensorData.timestamp).toLocaleString()}</p> */}
      </div>
    ) : (
      <p>No sitting data available</p>
    )}
  </div>

  {/* Weight Card */}
  <div className="box readings-box">
    <h2>⚖️ Weight</h2>
    {sensorData ? (
      <div className="card-1">
        
          <span className="one">{sensorData.weight}</span>
        
      
      </div>
    ) : (
      <p>No weight data available</p>
    )}
  </div>

  {/* Chair Details Card */}
  {/* <div className="box readings-box">
    <h2>🪑 Chair Details</h2>
    {chairData ? (
      <div className="reading-card">
        <p>
          Chair ID: <span>{chairData.chair_id}</span>
        </p>
        <p>
          Sitting Threshold: <span>{formatDuration(chairData.sitting_threshold)}</span>
        </p>
      </div>
    ) : (
      <p>No chair data available</p>
    )}
  </div> */}

  {/* Relaxation Timer Card */}
  <div className="box chair-box1">
    <div className="countdown-container">
    <h2>Relaxation Time </h2>
      <div className="circular-timer">
        <svg width="120" height="120">
          <circle cx="60" cy="60" r="50" className="timer-circle-bg" />
          <circle
            cx="60"
            cy="60"
            r="50"
            className="timer-circle"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ stroke: countdown > 10 ? "#4CAF50" : "#FF3D00" }}
          />
        </svg>
        <div className="countdown-text">
          <h2>{formatDuration(countdown)}</h2>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="row-1">
  
    <Sitting />

  
    <Weight />
  
</div>

<AnimePosture/>



<div>
   {showExercise && <SettingsPage onClose={() => setShowExercise(false)} />}
  
   </div>

   


  

 {/* Data Analysis */}
        {/* <div className="row">
          <div className="box1">
            <h2>📊 Data Analysis</h2>
            <GraphPage />
          </div>


          <div className="box1">
            <h2>📊 Histogram Analysis</h2>
            <Histogram />
            <PosturePieChart/>
         
          </div>
        
         
        </div> */}
      </div>
    </div>
  );
}
