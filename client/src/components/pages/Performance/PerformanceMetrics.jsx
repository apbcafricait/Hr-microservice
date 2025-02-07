import React, { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const PerformanceMetrics = () => {
  const metricsData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales Targets',
        data: [120, 150, 170, 200],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Productivity',
        data: [80, 90, 85, 95],
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    return () => {
      // Cleanup Chart.js instance
      Chart.getChart('myChart')?.destroy();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4">Performance Metrics</h2>

      {/* Bar Chart */}
      <div className="mb-4">
        <Bar
          id="myChart"
          data={metricsData}
          options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Values',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Sales Targets and Productivity Metrics',
              },
            },
          }}
        />
      </div>

      {/* KPIs Table */}
      <h3 className="text-md font-semibold mb-2">Key Performance Indicators (KPIs)</h3>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
            <th className="py-2 px-4">Metric</th>
            <th className="py-2 px-4">Target</th>
            <th className="py-2 px-4">Actual</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-2 px-4">Sales Revenue</td>
            <td className="py-2 px-4">$500,000</td>
            <td className="py-2 px-4">$480,000</td>
            <td className="py-2 px-4 text-red-500">Below Target</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">Customer Satisfaction</td>
            <td className="py-2 px-4">90%</td>
            <td className="py-2 px-4">88%</td>
            <td className="py-2 px-4 text-red-500">Below Target</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">Productivity Rate</td>
            <td className="py-2 px-4">85%</td>
            <td className="py-2 px-4">82%</td>
            <td className="py-2 px-4 text-orange-500">Slightly Below</td>
          </tr>
          <tr className="border-b">
            <td className="py-2 px-4">Employee Turnover</td>
            <td className="py-2 px-4">10%</td>
            <td className="py-2 px-4">8%</td>
            <td className="py-2 px-4 text-green-500">On Target</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PerformanceMetrics;