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
                let weightHistory = [];
                
                data.forEach(item => {
                    item.history.forEach(h => {
                        weightHistory.push({
                            date: new Date(h.date), // Convert to Date object for sorting
                            formattedDate: new Date(h.date).toLocaleDateString(),
                            weight: h.weight
                        });
                    });
                });

                // Sort in descending order (latest date first)
                weightHistory.sort((a, b) => b.date - a.date);

                // Extract sorted labels and weights
                const sortedDates = weightHistory.map(item => item.formattedDate);
                const sortedWeights = weightHistory.map(item => item.weight);

                setChartData({
                    labels: sortedDates,
                    datasets: [{
                        label: "Average Weight (kg)",
                        data: sortedWeights,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                        barThickness: 50, // Fixed bar thickness to remove gaps
                        categoryPercentage: 1.0, // Removes spacing between bars
                        barPercentage: 1.0, // Makes bars full width
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
            {chartData ? (
                <Bar
                    data={chartData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                grid: { display: false },
                                ticks: { autoSkip: false } // Ensures no missing labels
                            },
                            y: {
                                beginAtZero: true
                            }
                        }
                    }}
                />
            ) : (
                <p>Loading chart...</p>
            )}
        </div>
    );
};

export default WeightHistogram;
