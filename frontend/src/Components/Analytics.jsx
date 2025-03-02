import React, { useState, useEffect } from 'react';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';
import './Analytics.css';
import { useNavigate } from 'react-router-dom';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export default function Analytics() {
  const navigate = useNavigate();
  const [analyticsData, setAnalyticsData] = useState({
    dailyStats: {},
    weeklyTrends: [],
    postureSummary: {},
    timeDistribution: {},
  });

  // Calculate daily score based on sitting duration and FSR readings
  const calculateDailyScore = (data) => {
    if (!data || data.length === 0) return 0;
    const today = new Date().toLocaleDateString();
    const todayData = data.filter(item => 
      new Date(item.timestamp).toLocaleDateString() === today
    );
    
    if (todayData.length === 0) return 0;
    
    const avgSitting = todayData.reduce((acc, curr) => acc + curr.sittingDuration, 0) / todayData.length;
    const avgFSR = todayData.reduce((acc, curr) => acc + curr.fsrReading, 0) / todayData.length;
    
    // Score calculation logic
    const sittingScore = Math.max(0, 100 - (avgSitting > 120 ? (avgSitting - 120) : 0));
    const postureScore = Math.min(100, (avgFSR / 4));
    
    return Math.round((sittingScore + postureScore) / 2);
  };

  // Calculate average sitting time
  const calculateAverageSittingTime = (data) => {
    if (!data || data.length === 0) return 0;
    const totalSitting = data.reduce((acc, curr) => acc + curr.sittingDuration, 0);
    return Math.round((totalSitting / data.length) / 60 * 10) / 10; // Convert to hours
  };

  // Count posture alerts
  const countPostureAlerts = (data) => {
    if (!data || data.length === 0) return 0;
    return data.filter(item => item.fsrReading < 50).length;
  };

  // Calculate break compliance
  const calculateBreakCompliance = (data) => {
    if (!data || data.length === 0) return 0;
    const totalReadings = data.length;
    const goodBreaks = data.filter(item => item.sittingDuration < 120).length;
    return Math.round((goodBreaks / totalReadings) * 100);
  };

  // Process weekly trends
  const processWeeklyTrends = (data) => {
    if (!data || data.length === 0) return Array(7).fill({ duration: 0, postureScore: 0 });
    
    const weekData = Array(7).fill().map(() => ({ duration: 0, postureScore: 0, count: 0 }));
    
    data.forEach(item => {
      const day = new Date(item.timestamp).getDay();
      weekData[day].duration += item.sittingDuration;
      weekData[day].postureScore += item.fsrReading;
      weekData[day].count++;
    });
    
    return weekData.map(day => ({
      duration: day.count ? Math.round(day.duration / day.count) : 0,
      postureScore: day.count ? Math.round(day.postureScore / day.count) : 0,
    }));
  };

  // Get posture chart data
  const getPostureChartData = (summary) => ({
    labels: ['Good Posture', 'Poor Posture'],
    datasets: [{
      data: [summary.good || 0, summary.poor || 0],
      backgroundColor: ['#10b981', '#ef4444'],
    }],
  });

  // Get time distribution data
  const getTimeDistributionData = (distribution) => ({
    labels: ['Morning', 'Afternoon', 'Evening'],
    datasets: [{
      label: 'Average Sitting Duration (mins)',
      data: [
        distribution.morning || 0,
        distribution.afternoon || 0,
        distribution.evening || 0,
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.5)',
    }],
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        const dailyStats = {
          score: calculateDailyScore(data),
          avgSittingTime: calculateAverageSittingTime(data),
          postureAlerts: countPostureAlerts(data),
          breakCompliance: calculateBreakCompliance(data),
        };

        const weeklyTrends = processWeeklyTrends(data);

        const postureSummary = {
          good: data.filter(item => item.fsrReading >= 50).length,
          poor: data.filter(item => item.fsrReading < 50).length,
        };

        const timeDistribution = {
          morning: 120,
          afternoon: 180,
          evening: 90,
        };

        setAnalyticsData({
          dailyStats,
          weeklyTrends,
          postureSummary,
          timeDistribution,
        });
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      }
    };

    fetchAnalyticsData();
    const interval = setInterval(fetchAnalyticsData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-container">
      <button 
        className="back-button" 
        onClick={() => navigate('/dashboard')}
      >
        ← Back to Dashboard
      </button>

      <h1>Sitting Analytics Dashboard</h1>
      
      <div className="analytics-grid">
        <div className="stat-card">
          <h3>Today's Sitting Score</h3>
          <div className="score-display">
            {analyticsData.dailyStats.score || 0}%
          </div>
        </div>

        <div className="chart-card">
          <h3>Weekly Sitting Patterns</h3>
          <Line 
            data={{
              labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
              datasets: [
                {
                  label: 'Sitting Duration',
                  data: analyticsData.weeklyTrends.map(t => t.duration),
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                },
                {
                  label: 'Posture Score',
                  data: analyticsData.weeklyTrends.map(t => t.postureScore),
                  borderColor: 'rgb(255, 99, 132)',
                  tension: 0.1,
                },
              ],
            }} 
            options={lineOptions}
          />
        </div>

        <div className="chart-card">
          <h3>Posture Quality Distribution</h3>
          <Pie data={getPostureChartData(analyticsData.postureSummary)} options={pieOptions} />
        </div>

        <div className="chart-card">
          <h3>Hourly Activity Distribution</h3>
          <Bar data={getTimeDistributionData(analyticsData.timeDistribution)} options={barOptions} />
        </div>

        <div className="metrics-grid">
          <MetricCard
            title="Average Sitting Time"
            value={`${analyticsData.dailyStats.avgSittingTime || 0} hrs`}
            trend="+5%"
          />
          <MetricCard
            title="Posture Alerts"
            value={analyticsData.dailyStats.postureAlerts || 0}
            trend="-2"
          />
          <MetricCard
            title="Break Compliance"
            value={`${analyticsData.dailyStats.breakCompliance || 0}%`}
            trend="+12%"
          />
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ title, value, trend }) => (
  <div className="metric-card">
    <h4>{title}</h4>
    <div className="metric-value">{value}</div>
    <div className={`trend ${trend.startsWith('+') ? 'positive' : 'negative'}`}>
      {trend}
    </div>
  </div>
);

const lineOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
    title: { display: false },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'right' },
  },
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'top' },
  },
}; 
