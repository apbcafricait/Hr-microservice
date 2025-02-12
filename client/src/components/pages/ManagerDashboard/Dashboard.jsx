// Dashboard.jsx
import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", Employees: 12, Leaves: 2 },
  { name: "Feb", Employees: 14, Leaves: 3 },
  { name: "Mar", Employees: 15, Leaves: 1 },
  { name: "Apr", Employees: 16, Leaves: 4 },
];

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Manager Dashboard</h1>
      </header>

      {/* Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600">Total Employees</h2>
          <p className="text-3xl font-bold text-blue-500">25</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600">Pending Leave Requests</h2>
          <p className="text-3xl font-bold text-red-500">4</p>
        </div>
        <div className="bg-white shadow-md p-4 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600">Ongoing Recruitments</h2>
          <p className="text-3xl font-bold text-green-500">2</p>
        </div>
      </section>

      {/* Charts and Activity */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee and Leave Statistics */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Employee and Leave Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="Employees" fill="#3b82f6" />
              <Bar dataKey="Leaves" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Recent Activity</h2>
          <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between">
              <span>deacy odhiambo requested leave</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>david Wainaina  was promoted</span>
              <span className="text-sm text-gray-500">1 day ago</span>
            </li>
            <li className="py-2 flex justify-between">
              <span>Recruitment started for "Sales Manager"</span>
              <span className="text-sm text-gray-500">3 days ago</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Quick Actions */}


      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow">
            Add Employee
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg shadow">
            Approve Leave
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg shadow">
            Start Recruitment
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
