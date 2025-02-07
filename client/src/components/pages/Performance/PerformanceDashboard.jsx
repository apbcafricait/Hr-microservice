import React from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const PerformanceDashboard = () => {
  // Sample data for performance ratings and top performers
  const overallPerformanceRating = 4.2; // Example average rating
  
  const topPerformers = [
    { name: 'Alice Johnson', rating: 4.9 },
    { name: 'Bob Smith', rating: 4.7 },
    { name: 'Charlie Brown', rating: 4.6 },
  ];

  const areasNeedingImprovement = [
    { area: 'Customer Satisfaction', score: 2.8 },
    { area: 'Project Timeliness', score: 3.1 },
    { area: 'Team Collaboration', score: 3.5 },
  ];

  // Data for Top Performers Bar Chart
  const topPerformersData = {
    labels: topPerformers.map(performer => performer.name),
    datasets: [{
      label: 'Performance Ratings',
      data: topPerformers.map(performer => performer.rating),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
    }],
  };

  // Data for Areas Needing Improvement Pie Chart
  const areasData = {
    labels: areasNeedingImprovement.map(area => area.area),
    datasets: [{
      label: 'Scores',
      data: areasNeedingImprovement.map(area => area.score),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(255, 205, 86, 0.6)',
      ],
    }],
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Performance Dashboard</h2>

      {/* Overall Performance Rating */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Overall Performance Rating</h3>
        <p className="text-2xl font-bold">{overallPerformanceRating} / 5.0</p>
      </div>

      {/* Top Performers Bar Chart */}
      <div className="mb-4">
        <h3 className="text-md font-semibold">Top Performers</h3>
        <Bar data={topPerformersData} options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rating',
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Top Performers Performance Ratings',
            },
          },
        }} />
      </div>

      {/* Areas Needing Improvement Pie Chart */}
      <div>
        <h3 className="text-md font-semibold">Areas Needing Improvement</h3>
        <div style={{ width: '300px', height: '300px' }}> {/* Set the size here */}
          <Pie data={areasData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Scores in Areas Needing Improvement',
              },
            },
          }} />
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;