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
    sittingDurationData: { labels: [], durations: [] },
  });

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();

        const sittingDurationData = {
          labels: data.map(item => new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
          durations: data.map(item => item.sittingDuration),
        };

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
          sittingDurationData,
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

        <div className="chart-card">
          <h3>Sitting Duration vs Time</h3>
          <Line 
            data={{
              labels: analyticsData.sittingDurationData.labels,
              datasets: [
                {
                  label: 'Sitting Duration (mins)',
                  data: analyticsData.sittingDurationData.durations,
                  borderColor: 'rgb(54, 162, 235)',
                  backgroundColor: 'rgba(54, 162, 235, 0.5)',
                  tension: 0.1,
                },
              ],
            }}
            options={lineOptions}
          />
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
