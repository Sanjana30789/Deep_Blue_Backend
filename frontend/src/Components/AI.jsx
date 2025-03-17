import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import "./AI.css";

export default function AskAI() {
  const [sensorData, setSensorData] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_KEY = "AIzaSyC-Mb6fH8gHNMP4iYSb6NBzym60jnD_lrc";
  const API_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

  // Fetch Data ONLY on Page Refresh
  useEffect(() => {
    fetchSensorData();
  }, []); // ✅ Runs only once when page loads

  const fetchSensorData = async () => {
    try {
      const response = await fetch("http://localhost:5000/data/HARSH");
      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const data = await response.json();
      setSensorData(Array.isArray(data) ? data : []);
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
      const avgSittingDuration =
        data.reduce((acc, curr) => acc + curr.sittingDuration, 0) /
        data.length;
      const avgFSR =
        (data.reduce(
          (acc, curr) => acc + (curr.fsr1 + curr.fsr2 + curr.fsr3 + curr.fsr4),
          0
        ) /
          data.length) /
        4;

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
        Average Sitting Duration: ${avgSittingDuration.toFixed(2)} minutes
        Average FSR Reading: ${avgFSR.toFixed(2)}
        Number of Readings: ${data.length}
        Longest Sitting Duration: ${Math.max(...data.map((d) => d.sittingDuration))} minutes
        Lowest FSR Reading: ${Math.min(
          ...data.map((d) => Math.min(d.fsr1, d.fsr2, d.fsr3, d.fsr4))
        )}`;

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
    doc.text("AI Smart Sitting Analysis", pageWidth / 2, 20, { align: "center" });
    
    // Add date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: "center" });
    
    // Set default font for content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    let yPosition = 40;
    
    // Add behavior analysis
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Behavior Analysis", margin, yPosition);
    yPosition += 10;
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.text(`Sitting Pattern: ${analysis.behaviorAnalysis.sittingPattern}`, margin, yPosition);
    yPosition += 10;
    
    // Split long text into multiple lines
    const wrapText = (text, maxWidth) => {
      const lines = doc.splitTextToSize(text, maxWidth);
      return lines;
    };
    
    const postureLines = wrapText(`Posture Quality: ${analysis.behaviorAnalysis.postureQuality}`, textWidth);
    doc.text(postureLines, margin, yPosition);
    yPosition += postureLines.length * 7;
    
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
    doc.text("Improvements Noticed:", margin, yPosition);
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
    
    // Add footer
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: "center" });
    }
    
    // Save the PDF
    doc.save("sitting-analysis-report.pdf");
  };

  return (
    <div className="ai-container">
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      <h1>🤖 AI Smart Sitting Analysis</h1>

      <div className="button-group">
        <button className="refresh-button" onClick={fetchSensorData}>
          🔄 Refresh & Analyze Data
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
          <p>Analyzing your sitting behavior...</p>
        </div>
      )}

      {analysis && (
        <div className="analysis-container">
          <div className="analysis-section">
            <h2>Behavior Analysis</h2>
            <p><strong>Sitting Pattern:</strong> {analysis.behaviorAnalysis.sittingPattern}</p>
            <p><strong>Posture Quality:</strong> {analysis.behaviorAnalysis.postureQuality}</p>
            <p><strong>Overall Health Impact:</strong> {analysis.behaviorAnalysis.overallHealth}</p>
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
            <h3>Improvements Noticed:</h3>
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