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


ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [sensorData, setSensorData] = useState(null);
  const [chairData, setChairData] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [user, setUser] = useState(null);
  const [showExercise, setShowExercise] = useState(false);
  const [sittingThreshold, setSittingThreshold] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //         const token = localStorage.getItem("token");
  //         if (!token) {
  //             console.error("No token found, user not logged in.");
  //             return;
  //         }
  
  //         const response = await fetch("http://localhost:5000/api/auth/user", {
  //             method: "GET",
  //             headers: { 
  //                 Authorization: `Bearer ${token}`,
  //                 "Content-Type": "application/json"
  //             },
  //         });
  
  //         const userData = await response.json();
  
  //         if (response.ok) {
  //             console.log("Fetched User Data:", userData);
  //             setUser(userData); // Set user data in state
  
  //             // Fetch chair data using chair_id if available
  //             if (userData?.chair_id) {
  //                 fetchChairData(userData.chair_id);
  //             }
  //         } else {
  //             console.error("Error fetching user:", userData.msg);
  //         }
  //     } catch (error) {
  //         console.error("Error fetching user:", error);
  //     }
  // };
  

  //   const fetchSensorData = async () => {
  //     try {
  //       const response = await fetch(`http://localhost:5000/data/ALPHA`);
  //       if (!response.ok) throw new Error(`API Error: ${response.status}`);

  //       const data = await response.json();
  //       const sensorArray = Array.isArray(data) ? data : data.data;

  //       if (!Array.isArray(sensorArray)) {
  //         console.error("Error: Sensor data is not an array:", sensorArray);
  //         return;
  //       }

  //       const today = new Date().toLocaleDateString();
  //       const todayReadings = sensorArray.filter(reading =>
  //         new Date(reading.timestamp).toLocaleDateString() === today
  //       );

  //       setSensorData(todayReadings.length > 0 ? todayReadings.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] : null);
  //     } catch (error) {
  //       console.error("Error fetching sensor data:", error);
  //     }
  //   };

  //   const fetchChairData = async (chair_id) => {
  //     if (!chair_id) {
  //         console.error("Chair ID is missing.");
  //         return;
  //     }
  
  //     try {
  //         const response = await fetch(`http://localhost:5000/api/chair/chair-data/${chair_id}`);
  //         if (!response.ok) throw new Error(`API Error: ${response.status}`);
  
  //         const data = await response.json();
  //         setChairData(data);
  
  //         if (data.sittingThreshold && sensorData?.sittingDuration > data.sittingThreshold) {
  //             setCountdown(data.relaxationTime);
  //         }
  //     } catch (error) {
  //         console.error("Error fetching chair data:", error);
  //     }
  // };
  

  //   fetchUserData();
  //   fetchSensorData();
  //   fetchChairData();

  //   const interval = setInterval(() => {
  //     fetchSensorData();
  //     fetchChairData();
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

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





// 🟢 Countdown logic
// useEffect(() => {
//   if (showExercise && timeLeft > 0) {
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(timer);
//           setShowExercise(false);
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }
// }, [showExercise, timeLeft]);


const formatDuration = (seconds) => {
  if (!seconds || seconds < 0) return "00:00:00";
  
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};


// useEffect(() => {
//   if (sensorData.sittingDuration >= sitting_threshold) {
//     setShowExercise(true);
//   }
// }, [sensorData.sittingDuration]);




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
        <button onClick={() => navigate('/developer')} className='sidebar-button'>Developvers Page </button>
        <button onClick={handleLogout} className='sidebar-button logout-btn'>🚪 Logout</button>
        {/* <button onClick={handleShowExercise}>Show Exercise</button> */}

      </div>

      {/* Main Content */}
      <div className="main-content">
     


         {/* <AnimePosture/> */}





        {/* Sensor Readings & IoT Live Feed */}
        <div className="row">
  <div className="box readings-box" style={{ position: "relative", width: "100%", height: "400px" }}>
    <h2>📊 Today's Sensor Readings</h2>
    {sensorData ? (
      <div className="reading-card">
        <p>Sitting Duration: <span>{formatDuration(sensorData.sittingDuration)}</span></p>
        <p>FSR Reading 1: <span>{sensorData.fsr1}</span></p>
        <p>FSR Reading 2: <span>{sensorData.fsr2}</span></p>
        <p>FSR Reading 3: <span>{sensorData.fsr3}</span></p>
        <p>FSR Reading 4: <span>{sensorData.fsr4}</span></p>
        {/* <p>FSR Reading 5: <span>{sensorData.fsr5}</span></p>
        <p>FSR Reading 6: <span>{sensorData.fsr6}</span></p> */}
        <p>Weight: <span>{sensorData.weight}</span></p>
        <p>Total Sitting Duration: <span>{formatDuration(sensorData.totalsittingduration)}</span></p>
        <p className="timestamp">⏱ {new Date(sensorData.timestamp).toLocaleString()}</p>

       
      </div>

      
    ) : (
      <p>No data available for today</p>
    )}
    
     {/* {showExercise && <SettingsPage />} */}
  </div>
  
  <div className="box chair-box " style={{ position: "relative", width: "100%", height: "400px" }}>
    <h2>🪑 Chair Data</h2>
    {chairData ? (
      <div>
        <p>Chair ID: <span>{chairData.chair_id} </span></p>
        <p>Sitting Threshold: <span>{formatDuration(chairData.sitting_threshold)}</span></p>
        <p>Relaxation Time: <span>{formatDuration(chairData.relaxation_time)}</span></p>
        {countdown !== null && (
          <div className="countdown-container">
            <p>Countdown: <span>{formatDuration(countdown)}</span></p>
            <div className="circular-timer"></div>
          </div>
        )}
      </div>
    ) : (
      <p>No chair data available</p>
    )}
     
  </div>

  


</div>

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
