import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import exercise1 from "../assets/side.mp4";
import exercise2 from "../assets/chest.mp4";
import exercise3 from "../assets/leg_to_chest.mp4";
import exercise4 from "../assets/hip.mp4";
import exercise5 from "../assets/glute.mp4";
import exercise6 from "../assets/tricep.mp4";

const exercises = [
  { id: 1, name: "Start Streching with side exercise", video: exercise1 },
  { id: 2, name: "Strech Your chest streching with us..", video: exercise2 },
  { id: 3, name: "Move your leg to chest streching", video: exercise3 },
  { id: 4, name: "Strech your hips like this..", video: exercise4 },
  { id: 5, name: "Pump your glute like this", video: exercise5 },
  { id: 6, name: "Lets relax with tricep streching", video: exercise6 },
];

export default function SettingsPage() {
  const [showExercise, setShowExercise] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowExercise(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showExercise) {
      const interval = setInterval(() => {
        setFade(false);
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % exercises.length);
          setFade(true);
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [showExercise]);

  return (
    <div style={styles.settingsContainer}>
      {showExercise && (
        <div style={styles.exerciseOverlay}>
          <div style={styles.exerciseContainer}>
            <button style={styles.closeButton} onClick={() => setShowExercise(false)}>✖</button>
            <div style={{ ...styles.videoContainer, opacity: fade ? 1 : 0, transition: "opacity 0.5s ease-in-out" }}>
              <video
                src={exercises[currentIndex].video}
                style={styles.exerciseMedia}
                autoPlay
                loop
                muted
              />
              <p style={styles.exerciseName}>{exercises[currentIndex].name}</p>
            </div>
            <button onClick={() => navigate('/exercise')} style={styles.exerciseButton}>🏋️ Exercise</button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  settingsContainer: {
    padding: "20px",
    textAlign: "center",
  },
  exerciseOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(7, 0, 0, 0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  exerciseContainer: {
    background: "#fff",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    border: "5px solid yellowgreen",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "50%",
    fontSize: "16px",
    cursor: "pointer",
  },
  videoContainer: {
    width: "500px",
    height: "570px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  exerciseMedia: {
    padding: "20px",
    width: "100%",
    height: "570px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  exerciseName: {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "5px",
  },
  exerciseButton: {
    marginTop: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "yellowgreen",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};
