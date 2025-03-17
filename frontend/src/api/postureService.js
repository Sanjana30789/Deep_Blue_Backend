import axios from "axios";

const API_URL = "http://127.0.0.1:8000/predict/";

export const predictPosture = async (fsrData) => {
  try {
    const response = await axios.post(API_URL, fsrData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.predicted_posture;
  } catch (error) {
    console.error("Error predicting posture:", error);
    return null;
  }
};
