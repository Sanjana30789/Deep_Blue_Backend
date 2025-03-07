import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import './graph.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const DataAnalysis = () => {
    const navigate = useNavigate();
    const [analysisData, setAnalysisData] = useState({
        dailySitting: [],
        postureQuality: { goodPosture: 0, poorPosture: 0 },
        averageSittingTime: 0,
        postureAlerts: 0,
        breakCompliance: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/data');
                const data = await response.json();
                console.log('Fetched Data:', data); // Log fetched data
                const processedData = processData(data);
                setAnalysisData(processedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const processData = (data) => {
        const dailySitting = calculateDailySitting(data);
        const postureQuality = calculatePostureQuality(data);
        const averageSittingTime = calculateAverageSittingTime(data);
        const postureAlerts = countPostureAlerts(data);
        const breakCompliance = calculateBreakCompliance(data);

        return { dailySitting, postureQuality, averageSittingTime, postureAlerts, breakCompliance };
    };

    const calculateDailySitting = (data) => {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        return days.map(day => {
            const dayData = data.filter(item => item.day === day);
            return dayData.reduce((total, item) => total + item.sittingDuration, 0);
        });
    };

    const calculatePostureQuality = (data) => {
        const goodPosture = data.filter(item => item.fsr1 > 50 && item.fsr2 > 50).length;
        const poorPosture = data.length - goodPosture;
        return { goodPosture, poorPosture };
    };

    const calculateAverageSittingTime = (data) => {
        if (!data || data.length === 0) return 0;
        const totalSitting = data.reduce((acc, curr) => acc + curr.sittingDuration, 0);
        return Math.round((totalSitting / data.length) / 60 * 10) / 10; // Convert to hours
    };

    const countPostureAlerts = (data) => {
        return data.filter(item => item.fsr1 < 50 || item.fsr2 < 50).length;
    };

    const calculateBreakCompliance = (data) => {
        const totalReadings = data.length;
        const goodBreaks = data.filter(item => item.sittingDuration < 120).length;
        return Math.round((goodBreaks / totalReadings) * 100);
    };

    return (
        <div className='data-analysis'>
            <h1>Data Analysis</h1>
            <div className='charts'>
                <div className='chart-container'>
                    <h2>Daily Sitting Duration</h2>
                    <Line data={{
                        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        datasets: [{
                            label: 'Sitting Duration (min)',
                            data: analysisData.dailySitting,
                            borderColor: 'rgb(75, 192, 192)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            tension: 0.3,
                        }],
                    }} />
                </div>
                <div className='chart-container'>
                    <h2>Posture Quality</h2>
                    <Pie data={{
                        labels: ['Good Posture', 'Poor Posture'],
                        datasets: [{
                            data: [analysisData.postureQuality.goodPosture, analysisData.postureQuality.poorPosture],
                            backgroundColor: ['#10b981', '#ef4444'],
                        }],
                    }} />
                </div>
                <div className='chart-container'>
                    <h2>Average Sitting Time</h2>
                    <Bar data={{
                        labels: ['Average Sitting Time'],
                        datasets: [{
                            label: 'Sitting Time (hrs)',
                            data: [analysisData.averageSittingTime],
                            backgroundColor: 'rgba(99, 102, 241, 0.5)',
                        }],
                    }} />
                </div>
                <div className='chart-container'>
                    <h2>Posture Alerts</h2>
                    <Bar data={{
                        labels: ['Alerts'],
                        datasets: [{
                            label: 'Posture Alerts',
                            data: [analysisData.postureAlerts],
                            backgroundColor: 'rgb(255, 99, 132)',
                        }],
                    }} />
                </div>
                <div className='chart-container'>
                    <h2>Break Compliance</h2>
                    <Pie data={{
                        labels: ['Good Breaks', 'Bad Breaks'],
                        datasets: [{
                            data: [analysisData.breakCompliance, 100 - analysisData.breakCompliance],
                            backgroundColor: ['#10b981', '#ef4444'],
                        }],
                    }} />
                </div>
            </div>
        </div>
    );
};

export default DataAnalysis;
