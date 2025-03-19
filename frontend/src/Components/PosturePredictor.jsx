import { useState, useEffect } from "react";
import { predictPosture } from "../api/postureService";
import "./Posture.css"; // Import the CSS file
// Import the image file

const PosturePredictor = () => {
  const [fsrValues, setFsrValues] = useState({
    fsr1: 0,
    fsr2: 0,
    fsr3: 0,
    fsr4: 0, 
  });

  const [prediction, setPrediction] = useState("");

  // Fetch FSR values from API
  const fetchFSRValues = async () => {
    try {
        const response = await fetch("https://deep-blue-backend-2-lwms.onrender.com/data/PRAM");
        const data = await response.json();
        
        console.log("API Response:", data); // Log the full response
        
        if (Array.isArray(data) && data.length > 0) {
            const latestData = data[0];

            console.log("Extracted Data:", latestData); // Log extracted data

            setFsrValues({
                fsr1: parseFloat(latestData.fsr1) || 0,
                fsr2: parseFloat(latestData.fsr2) || 0,
                fsr3: parseFloat(latestData.fsr3) || 0,
                fsr4: parseFloat(latestData.fsr4) || 0,
               
            });
        } else {
            console.error("FSR values not found in API response:", data);
        }
    } catch (error) {
        console.error("Error fetching FSR data:", error);
    }
};

  

  // Predict posture when values are updated
  const handlePredict = async () => {
    try {
      const result = await predictPosture(fsrValues);
      setPrediction(result || "Prediction failed.");
    } catch (error) {
      console.error("Error predicting posture:", error);
      setPrediction("Error in prediction.");
    }
  };

  // Fetch values every 5 seconds
  useEffect(() => {
    fetchFSRValues();
    const interval = setInterval(fetchFSRValues, 2000);
    return () => clearInterval(interval);
  }, []);

  // Trigger prediction when FSR values update
  useEffect(() => {
    if (fsrValues.fsr1 || fsrValues.fsr2 || fsrValues.fsr3 || fsrValues.fsr4 ) {
      handlePredict();
    }
  }, [fsrValues]);

  // Select image based on prediction
  const postureImage =
    prediction.toLowerCase().includes("good")
      ? "./assets/iot.jpg"
      : "./assets/iot.jpg";

  return (
    <div className="posture-container">
      <div className="posture-card">
        <h2>Posture Prediction</h2>

        <div className="fsr-inputs">
          {["fsr1", "fsr2", "fsr3", "fsr4"].map((fsr, index) => (
            <input key={index} type="number" name={fsr} value={fsrValues[fsr]} readOnly />
          ))}
        </div>

        <button onClick={fetchFSRValues} className="refresh-button">
          Refresh Data
        </button>

        {prediction && <div className="prediction-text">Predicted Posture: {prediction}</div>}

        {/* {prediction && <img src={postureImage} alt="Posture" className="posture-image" />} */}
      </div>
    </div>
  );
};

export default PosturePredictor;
