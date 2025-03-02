import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AI.css';

const AIRecommendation = () => {
    const [sensorData, setSensorData] = useState([]);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_KEY = 'AIzaSyC-Mb6fH8gHNMP4iYSb6NBzym60jnD_lrc';
    const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    useEffect(() => {
        fetchSensorData();
    }, []);

    const fetchSensorData = async () => {
        try {
            const response = await fetch("http://localhost:5000/data");
            const data = await response.json();
            setSensorData(data);
            if (data.length > 0) {
                generateAIAnalysis(data);
            }
        } catch (error) {
            console.error("Error fetching sensor data:", error);
        }
    };

    const generateAIAnalysis = async (data) => {
        setLoading(true);
        try {
            // Process data for AI analysis
            const lastDay = data.slice(-24); // Last 24 readings
            const avgSittingDuration = lastDay.reduce((acc, curr) => acc + curr.sittingDuration, 0) / lastDay.length;
            const avgFSR = lastDay.reduce((acc, curr) => acc + curr.fsrReading, 0) / lastDay.length;

            const prompt = `Analyze this sitting behavior data and provide detailed recommendations in JSON format:
            {
                "behaviorAnalysis": {
                    "sittingPattern": "Analysis of sitting duration patterns",
                    "postureQuality": "Analysis of posture based on FSR readings",
                    "overallHealth": "Overall health impact assessment"
                },
                "recommendations": {
                    "immediate": ["List of immediate actions needed"],
                    "shortTerm": ["Short-term improvement suggestions"],
                    "longTerm": ["Long-term health recommendations"]
                },
                "healthRisks": ["Potential health risks based on the data"],
                "improvements": ["Areas showing improvement"],
                "customizedTips": ["Personalized tips based on the data"]
            }

            Sensor Data Summary:
            Average Sitting Duration: ${avgSittingDuration} minutes
            Average FSR Reading: ${avgFSR}
            Number of Readings: ${lastDay.length}
            Longest Sitting Duration: ${Math.max(...lastDay.map(d => d.sittingDuration))} minutes
            Lowest FSR Reading: ${Math.min(...lastDay.map(d => d.fsrReading))}`;

            const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            });

            const responseText = response.data.candidates[0].content.parts[0].text;
            const jsonStart = responseText.indexOf('{');
            const jsonEnd = responseText.lastIndexOf('}') + 1;
            const jsonStr = responseText.slice(jsonStart, jsonEnd);
            const parsedResponse = JSON.parse(jsonStr);
            setAnalysis(parsedResponse);
        } catch (error) {
            console.error('Error generating AI analysis:', error);
        }
        setLoading(false);
    };

    return (
        <div className="ai-recommendation-container">
            <button className="back-button" onClick={() => navigate('/dashboard')}>
                ← Back to Dashboard
            </button>

            <h1>AI-Powered Sitting Behavior Analysis</h1>

            {loading && (
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Analyzing your sitting behavior...</p>
                </div>
            )}

            {analysis && (
                <div className="analysis-container">
                    <div className="analysis-section behavior-analysis">
                        <h2>Behavior Analysis</h2>
                        <div className="analysis-card">
                            <h3>Sitting Pattern</h3>
                            <p>{analysis.behaviorAnalysis.sittingPattern}</p>
                        </div>
                        <div className="analysis-card">
                            <h3>Posture Quality</h3>
                            <p>{analysis.behaviorAnalysis.postureQuality}</p>
                        </div>
                        <div className="analysis-card">
                            <h3>Overall Health Impact</h3>
                            <p>{analysis.behaviorAnalysis.overallHealth}</p>
                        </div>
                    </div>

                    <div className="analysis-section recommendations">
                        <h2>Personalized Recommendations</h2>
                        <div className="timeline">
                            <div className="timeline-item">
                                <h3>Immediate Actions</h3>
                                <ul>
                                    {analysis.recommendations.immediate.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="timeline-item">
                                <h3>Short-term Goals</h3>
                                <ul>
                                    {analysis.recommendations.shortTerm.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="timeline-item">
                                <h3>Long-term Goals</h3>
                                <ul>
                                    {analysis.recommendations.longTerm.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="analysis-section health-insights">
                        <h2>Health Insights</h2>
                        <div className="insights-grid">
                            <div className="insight-card risks">
                                <h3>Potential Health Risks</h3>
                                <ul>
                                    {analysis.healthRisks.map((risk, index) => (
                                        <li key={index}>{risk}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="insight-card improvements">
                                <h3>Improvements Noticed</h3>
                                <ul>
                                    {analysis.improvements.map((improvement, index) => (
                                        <li key={index}>{improvement}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="analysis-section custom-tips">
                        <h2>Personalized Tips</h2>
                        <div className="tips-container">
                            {analysis.customizedTips.map((tip, index) => (
                                <div key={index} className="tip-card">
                                    <span className="tip-number">{index + 1}</span>
                                    <p>{tip}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIRecommendation; 