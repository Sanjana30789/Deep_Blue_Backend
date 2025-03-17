// import React, { useEffect, useState } from "react";
// import { Pie } from "react-chartjs-2";
// import axios from "axios";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const PosturePieChart = ({ chairId }) => {
//     const [fsrData, setFsrData] = useState(null);
//     const [postureStatus, setPostureStatus] = useState("");

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 const response = await axios.get(`http://localhost:5000/data/ALPHA`);
//                 const { fsr1, fsr2, fsr3, fsr4 } = response.data; // Assuming your API returns these values

//                 // FSR readings in an array
//                 const fsrValues = [fsr1, fsr2, fsr3, fsr4];

//                 // Posture determination logic
//                 let status = "Good Posture";
//                 if (fsr1 + fsr2 > fsr3 + fsr4) {
//                     status = "Leaning Forward";
//                 } else if (fsr3 + fsr4 > fsr1 + fsr2) {
//                     status = "Leaning Backward";
//                 } else if (fsr1 + fsr3 > fsr2 + fsr4) {
//                     status = "Leaning Left";
//                 } else if (fsr2 + fsr4 > fsr1 + fsr3) {
//                     status = "Leaning Right";
//                 }

//                 setPostureStatus(status);

//                 // Set chart data
//                 setFsrData({
//                     labels: ["FSR1 (Front-Left)", "FSR2 (Front-Right)", "FSR3 (Back-Left)", "FSR4 (Back-Right)"],
//                     datasets: [
//                         {
//                             label: "FSR Pressure Distribution",
//                             data: fsrValues,
//                             backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
//                             hoverOffset: 10,
//                         }
//                     ]
//                 });
//             } catch (error) {
//                 console.error("Error fetching FSR data:", error);
//             }
//         };

//         fetchData();
//     }, [chairId]);

//     return (
//         <div>
//             <h2>FSR Pressure Distribution</h2>
//             {fsrData ? (
//                 <>
//                     <Pie data={fsrData} />
//                     <h3>Posture Status: {postureStatus}</h3>
//                 </>
//             ) : (
//                 <p>Loading chart...</p>
//             )}
//         </div>
//     );
// };

// export default PosturePieChart;


import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const PosturePieChart = () => {
  const [fsrValues, setFsrValues] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch FSR values from API
  const fetchFSRValues = async () => {
    try {
      const response = await fetch(
        "https://deep-blue-backend-1-tiy7.onrender.com/data/ALPHA"
      );
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const latestData = data[0];
        setFsrValues({
          fsr1: parseFloat(latestData.fsr1) || 0,
          fsr2: parseFloat(latestData.fsr2) || 0,
          fsr3: parseFloat(latestData.fsr3) || 0,
          fsr4: parseFloat(latestData.fsr4) || 0,
        });
        setLoading(false);
      } else {
        console.error("FSR values not found in API response:", data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching FSR data:", error);
      setLoading(false);
    }
  };

  // Fetch data on mount and every 5 seconds (for real-time updates)
  useEffect(() => {
    fetchFSRValues();
    const interval = setInterval(fetchFSRValues, 5000); // Auto-update every 5 seconds
    return () => clearInterval(interval); // Cleanup interval
  }, []);

  // Data for Pie Chart
  const pieData = fsrValues
    ? {
        labels: ["FSR1 (Front-Left)", "FSR2 (Front-Right)", "FSR3 (Back-Left)", "FSR4 (Back-Right)"],
        datasets: [
          {
            label: "FSR Pressure",
            data: [fsrValues.fsr1, fsrValues.fsr2, fsrValues.fsr3, fsrValues.fsr4],
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
            hoverOffset: 10,
          }
        ],
      }
    : null;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "400px", height: "400px" }}>
      <h2>FSR Pressure Distribution</h2>
      {loading ? (
        <p>Loading FSR Data...</p>
      ) : fsrValues && pieData ? (
        <Pie data={pieData} options={options} />
      ) : (
        <p>No FSR data available.</p>
      )}
    </div>
  );
};

export default PosturePieChart;
