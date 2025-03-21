import React from "react";
import { useNavigate } from "react-router-dom";
import bgVideo from "../assets/l1.mp4";  

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={styles.landingContainer}>
      <video autoPlay loop muted style={styles.backgroundVideo}>
        <source src={bgVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.heading}>Transform the Way You Sit – Because Comfort Should Be Smart!</h1>
        {/* Remove any default margin/border that might be causing the line */}
        <p style={styles.paragraph}>Your journey begins here.</p>
        <button style={styles.button} onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </div>
    </div>
  );
}

const styles = {
  landingContainer: {
    position: "relative",
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // Add to prevent any default borders
    border: "none",
  },
  backgroundVideo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "translate(-50%, -50%)",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0, 0, 0, 0.5)", 
    // Add to ensure no borders
    border: "none",
  },
  content: {
    position: "relative",
    textAlign: "center",
    color: "#eee",
    zIndex: 2,
    // Add to remove any borders
    border: "none",
  },
  heading: {
    fontSize: "3rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#eee",
    // Remove any border that might be causing the line
    borderBottom: "none",
  },
  paragraph: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    // Add specific styling to remove top borders/margins
    marginTop: 0,
    borderTop: "none",
    paddingTop: "20px", // Add some space instead of relying on margins
  },
  button: {
    padding: "12px 24px",
    fontSize: "1.2rem",
    color: "#333",
    backgroundColor: "#eee",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "0.3s ease",
  },
};