import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Histogram() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchWeightData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data/HARSH");
        if (!response.ok) throw new Error("Failed to fetch data");
        
        const data = await response.json();
        const sensorArray = Array.isArray(data) ? data : data.data;
        if (!Array.isArray(sensorArray)) {
          console.error("Invalid data format", sensorArray);
          return;
        }
        
        // Grouping by day and calculating the average weight
        const weightMap = {};
        sensorArray.forEach((entry) => {
          const date = new Date(entry.timestamp).toLocaleDateString();
          if (!weightMap[date]) {
            weightMap[date] = { totalWeight: 0, count: 0 };
          }
          weightMap[date].totalWeight += entry.weight;
          weightMap[date].count += 1;
        });

        const labels = Object.keys(weightMap);
        const avgWeights = labels.map((date) =>
          weightMap[date].totalWeight / weightMap[date].count
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Average Weight (kg)",
              data: avgWeights,
              backgroundColor: "rgba(54, 162, 235, 0.5)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching weight data:", error);
      }
    };

    fetchWeightData();
  }, []);

  return (
    <div>
      <h2>📊 Average Weight vs Day</h2>
      {chartData ? <Bar data={chartData} /> : <p>Loading chart...</p>}
    </div>
  );
}
