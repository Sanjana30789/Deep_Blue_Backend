import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import "./AI.css";

export default function SittingDurationAnalysis() {
  const [sensorData, setSensorData] = useState([]);
  const [user, setUser] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Gemini API key - Replace with your actual key in production
  const API_KEY = "YOUR_GEMINI_API_KEY";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  // Fetch user data and sensor data on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found, user not logged in.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/auth/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const userData = await response.json();
      if (response.ok) {
        setUser(userData);
        if (userData?.chair_id) {
          fetchSensorData(userData.chair_id);
        }
      } else {
        console.error("Error fetching user:", userData.msg);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const fetchSensorData = async (chair_id) => {
    setLoading(true);
    try {
      // Fetch sensor data for the user's chair
      const response = await fetch(`http://localhost:5000/data/${chair_id}`);
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      const sensorArray = Array.isArray(data) ? data : data.data;
      setSensorData(sensorArray);

      // Fetch chair settings
      const chairResponse = await fetch(`http://localhost:5000/api/chair/chair-data/${chair_id}`);
      if (!chairResponse.ok) throw new Error(`Chair API Error: ${chairResponse.status}`);

      const chairData = await chairResponse.json();
      
      // Generate AI analysis once we have both sensor data and chair settings
      if (sensorArray.length > 0) {
        generateAIAnalysis(sensorArray, chairData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const generateAIAnalysis = async (data, chairData) => {
    try {
      // Calculate key metrics for analysis
      const avgSittingDuration = data.reduce((acc, curr) => acc + curr.sittingDuration, 0) / data.length;
      const maxSittingDuration = Math.max(...data.map(d => d.sittingDuration));
      const totalSittingTime = data.reduce((acc, curr) => acc + curr.sittingDuration, 0);
      const sittingThreshold = chairData?.sitting_threshold || 60; // Default to 60 minutes if not available
      const relaxationTime = chairData?.relaxation_time || 5; // Default to 5 minutes if not available
      
      // Count times sitting threshold was exceeded
      const thresholdExceeded = data.filter(d => d.sittingDuration > sittingThreshold).length;
      
      // Calculate sitting pattern metrics
      const consecutiveLongSessions = data.reduce((count, curr, index, arr) => {
        if (index > 0 && curr.sittingDuration > sittingThreshold && arr[index-1].sittingDuration > sittingThreshold) {
          return count + 1;
        }
        return count;
      }, 0);

      const prompt = `Analyze this sitting duration data and provide detailed recommendations in JSON format:
        {
            "behaviorAnalysis": {
                "sittingPattern": "Detailed analysis of sitting duration patterns and habits",
                "breakFrequency": "Analysis of break patterns and frequency",
                "overallHealth": "Impact on overall health based on sitting patterns"
            },
            "recommendations": {
                "immediate": ["List of immediate actions needed to improve sitting habits"],
                "shortTerm": ["Short-term improvement suggestions for better sitting habits"],
                "longTerm": ["Long-term health recommendations related to sitting time"]
            },
            "healthRisks": ["Potential health risks based on observed sitting duration"],
            "improvements": ["Areas where sitting habits could be improved"],
            "customizedTips": ["Personalized tips based on the sitting duration data"]
        }

        Sitting Data Summary:
        Average Sitting Duration: ${avgSittingDuration.toFixed(2)} minutes
        Maximum Sitting Duration: ${maxSittingDuration} minutes
        Total Sitting Time: ${totalSittingTime} minutes
        Sitting Threshold Setting: ${sittingThreshold} minutes
        Relaxation Time Setting: ${relaxationTime} minutes
        Number of Times Threshold Exceeded: ${thresholdExceeded}
        Consecutive Long Sessions: ${consecutiveLongSessions}
        Number of Data Points: ${data.length}
        
        Focus primarily on the sitting duration pattern, not posture or weight.`;

      const response = await axios.post(`${API_URL}?key=${API_KEY}`, {
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      });

      // Extract and parse JSON from response
      const responseText = response.data.candidates[0].content.parts[0].text;
      const jsonStart = responseText.indexOf("{");
      const jsonEnd = responseText.lastIndexOf("}") + 1;
      const jsonStr = responseText.slice(jsonStart, jsonEnd);
      const parsedResponse = JSON.parse(jsonStr);
      
      setAnalysis(parsedResponse);
    } catch (error) {
      console.error("Error generating AI analysis:", error);
    }
    setLoading(false);
  };

  const downloadPDF = () => {
    if (!analysis) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - 2 * margin;
    
    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Sitting Duration Analysis Report", pageWidth / 2, 20, { align: "center" });
    
    // Add date and user info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: "center" });
    if (user?.name) {
      doc.text(`User: ${user.name}`, pageWidth / 2, 40, { align: "center" });
    }
    
    // Set default font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPosition = 50;
    
    // Add behavior analysis
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Sitting Behavior Analysis", margin, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    
    // Split long text into multiple lines
    const wrapText = (text, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      return lines;
    };
    
    const patternLines = wrapText(`Sitting Pattern: ${analysis.behaviorAnalysis.sittingPattern}`, textWidth);
    doc.text(patternLines, margin, yPosition);
    yPosition += patternLines.length * 7;
    
    const breakLines = wrapText(`Break Frequency: ${analysis.behaviorAnalysis.breakFrequency}`, textWidth);
    doc.text(breakLines, margin, yPosition);
    yPosition += breakLines.length * 7;
    
    const healthLines = wrapText(`Overall Health Impact: ${analysis.behaviorAnalysis.overallHealth}`, textWidth);
    doc.text(healthLines, margin, yPosition);
    yPosition += healthLines.length * 7 + 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add recommendations
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Personalized Recommendations", margin, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Immediate Actions:", margin, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.recommendations.immediate.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Short-Term Goals:", margin, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.recommendations.shortTerm.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Long-Term Goals:", margin, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.recommendations.longTerm.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add health insights
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Health Insights", margin, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Potential Health Risks:", margin, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.healthRisks.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    yPosition += 5;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Improvement Opportunities:", margin, yPosition);
    yPosition += 8;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.improvements.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    yPosition += 10;
    
    // Check if we need a new page
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Add personalized tips
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Personalized Tips", margin, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    analysis.customizedTips.forEach(item => {
      const itemLines = wrapText(`• ${item}`, textWidth);
      doc.text(itemLines, margin, yPosition);
      yPosition += itemLines.length * 7;
    });
    
    // Add footer with page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }
    
    // Save the PDF
    doc.save("sitting-duration-analysis.pdf");
  };

  const formatDuration = (minutes) => {
    if (!minutes || minutes < 0) return "00:00";
    
    const hrs = Math.floor(minutes / 60);
    const mins = Math.floor(minutes % 60);
    
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
  };

  return (
    <div className="ai-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>🪑 Sitting Duration Analysis</h1>

      <div className="button-group">
        <button className="refresh-button" onClick={() => fetchUserData()}>
          🔄 Refresh Analysis
        </button>
        
        {analysis && (
          <button className="pdf-button" onClick={downloadPDF}>
            📄 Download as PDF
          </button>
        )}
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Analyzing your sitting duration patterns...</p>
        </div>
      )}

      {analysis && (
        <div className="analysis-container">
          <div className="analysis-section">
            <h2>Sitting Behavior Analysis</h2>
            <p><strong>Sitting Pattern:</strong> {analysis.behaviorAnalysis.sittingPattern}</p>
            <p><strong>Break Frequency:</strong> {analysis.behaviorAnalysis.breakFrequency}</p>
            <p><strong>Health Impact:</strong> {analysis.behaviorAnalysis.overallHealth}</p>
          </div>

          <div className="analysis-section">
            <h2>Your Sitting Stats</h2>
            {sensorData.length > 0 && (
              <>
                <p><strong>Average Sitting Duration:</strong> {formatDuration(sensorData.reduce((acc, curr) => acc + curr.sittingDuration, 0) / sensorData.length)}</p>
                <p><strong>Longest Session:</strong> {formatDuration(Math.max(...sensorData.map(d => d.sittingDuration)))}</p>
                <p><strong>Total Sitting Time:</strong> {formatDuration(sensorData.reduce((acc, curr) => acc + curr.sittingDuration, 0))}</p>
                <p><strong>Sessions Recorded:</strong> {sensorData.length}</p>
              </>
            )}
          </div>

          <div className="analysis-section">
            <h2>Personalized Recommendations</h2>
            <h3>Immediate Actions:</h3>
            <ul>
              {analysis.recommendations.immediate.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Short-Term Goals:</h3>
            <ul>
              {analysis.recommendations.shortTerm.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <h3>Long-Term Goals:</h3>
            <ul>
              {analysis.recommendations.longTerm.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-section">
            <h2>Health Insights</h2>
            <h3>Potential Health Risks:</h3>
            <ul>
              {analysis.healthRisks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
            <h3>Improvement Opportunities:</h3>
            <ul>
              {analysis.improvements.map((improvement, index) => (
                <li key={index}>{improvement}</li>
              ))}
            </ul>
          </div>

          <div className="analysis-section">
            <h2>Personalized Tips</h2>
            <ul>
              {analysis.customizedTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}