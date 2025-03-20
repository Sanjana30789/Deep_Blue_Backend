import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultProfile from "../assets/sanjana.png"; // Default profile image
import bgImage from "../assets/image.png"; // Background image
import "./ProfilePage.css"; // CSS file for styling

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [chairData, setChairData] = useState(null);
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
            "Content-Type": "application/json",
          },
        });

        const userData = await response.json();

        if (response.ok) {
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

    const fetchChairData = async (chair_id) => {
      if (!chair_id) return;

      try {
        const response = await fetch(
          `http://localhost:5000/api/chair/chair-data/${chair_id}`
        );
        if (!response.ok) throw new Error(`API Error: ${response.status}`);

        const data = await response.json();
        setChairData(data);
      } catch (error) {
        console.error("Error fetching chair data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Format the last active timestamp
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "Not Available";
    const date = new Date(timestamp);
    return date.toLocaleString(); // Converts to a user-friendly format
  };

  return (
    <div className="profile-container">
      <div className="profile-header" style={{ backgroundImage: `url(${bgImage})` }}>
        <button className="back-button" onClick={() => navigate("/dashboard")}>
          ← Back to Dashboard
        </button>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <img
            src={user?.profilePic || defaultProfile}
            alt="Profile"
            className="profile-image"
            onError={(e) => (e.target.src = defaultProfile)}
          />
          <h2>{user?.name || "User Name"}</h2>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Chair ID:</strong> {user?.chair_id || "Not Assigned"}</p>
        </div>

        <div className="chair-card">
          <h2>🪑 Chair Data</h2>
          {chairData ? (
            <div>
              <p><strong>Chair ID:</strong> {chairData.chair_id}</p>
              <p><strong>Sitting Threshold:</strong> {chairData.sitting_threshold} mins</p>
              <p><strong>Relaxation Time:</strong> {chairData.relaxation_time} mins</p>
              <p><strong>Continuous Vibration:</strong> {chairData.continuous_vibration ? "Enabled" : "Disabled"}</p>
            </div>
          ) : (
            <p>No chair data available</p>
          )}
        </div>
      </div>

      {/* Last Active Section */}
      <div className="last-active">
        <h2>Last Active</h2>
        <p>{formatDateTime(chairData?.updatedAt)}</p>
      </div>
    </div>
  );
}
