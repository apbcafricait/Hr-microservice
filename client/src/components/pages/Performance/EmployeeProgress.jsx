import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const EmployeeProgress = () => {
  // Sample data for performance ratings over time
  const performanceData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Performance Rating',
        data: [3, 4, 2, 5, 4, 5],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Employee Progress</h2>

      {/* Goals and Achievements Section */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-2">Goals and Achievements</h3>
        <ul className="list-disc pl-5">
          <li>Complete Project X by the end of Q1</li>
          <li>Improve customer satisfaction score to 90%</li>
          <li>Attend 2 professional development workshops</li>
        </ul>
      </div>

      {/* Performance Review Timeline */}
      <h3 className="text-md font-semibold mb-2">Performance Rating Over Time</h3>
      <Line
        data={performanceData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Rating',
              },
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Performance Ratings (1-5)',
            },
          },
        }}
      />
    </div>
  );
};

export default EmployeeProgress;