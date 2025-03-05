import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeightHistogram = ({ chairId }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/data/HARSH`);
                const { data } = response.data;

                // Extract historical weight data
                const dates = data.flatMap(item => item.history.map(h => h.date));
                const weights = data.flatMap(item => item.history.map(h => h.weight));

                setChartData({
                    labels: dates.map(date => new Date(date).toLocaleDateString()),
                    datasets: [{
                        label: "Weight (kg)",
                        data: weights,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                    }]
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [chairId]);

    return (
        <div>
            <h2>Weight vs Days Histogram</h2>
            {chartData ? <Bar data={chartData} options={{ responsive: true }} /> : <p>Loading chart...</p>}
        </div>
    );
};

export default WeightHistogram;
