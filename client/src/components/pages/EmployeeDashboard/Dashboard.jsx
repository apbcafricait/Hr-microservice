import { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

// Sample data for bar chart
const barData = [
  { name: 'Mon', hours: 8 },
  { name: 'Tue', hours: 7.5 },
  { name: 'Wed', hours: 8 },
  { name: 'Thu', hours: 8.5 },
  { name: 'Fri', hours: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  const [pieDataLocation, setPieDataLocation] = useState([]);

  useEffect(() => {
    // Fetch country data from REST Countries API
    axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const countries = response.data.map(country => ({
          name: country.name.common,
          value: Math.floor(Math.random() * 500) + 100 // Random value for demonstration
        }));
        setPieDataLocation(countries);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
      });
  }, []);

  return (
    <div className="p-6">
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Time at Work</h2>
          <p>Punch In: --:-- --</p>
          <p>Punch Out: 01:19 PM (GMT 7)</p>
          <BarChart width={300} height={200} data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="hours" fill="#8884d8" />
          </BarChart>
        </section>
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">My Actions</h2>
          <ul>
            <li>(1) Pending Self Review</li>
            <li>(1) Candidate to Interview</li>
          </ul>
        </section>
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Quick Launch</h2>
          <ul className="grid grid-cols-2 gap-2">
            <li className="bg-blue-500 text-white p-2 rounded">Assign Leave</li>
            <li className="bg-blue-500 text-white p-2 rounded">Leave List</li>
            <li className="bg-blue-500 text-white p-2 rounded">Timesheets</li>
            <li className="bg-blue-500 text-white p-2 rounded">Apply Leave</li>
            <li className="bg-blue-500 text-white p-2 rounded">My Leave</li>
            <li className="bg-blue-500 text-white p-2 rounded">My Timesheet</li>
          </ul>
        </section>
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Employees on Leave Today</h2>
          <p>Shubh G</p>
          <p>Leave type: Maternity (09:00 - 17:00)</p>
          <p>Employee ID: 012345</p>
        </section>
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Employee Distribution by Sub Unit</h2>
          <PieChart width={300} height={200}>
            <Pie data={pieDataLocation} cx={150} cy={100} outerRadius={60} fill="#8884d8" dataKey="value">
              {pieDataLocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </section>
        <section className="bg-white p-4 shadow rounded">
          <h2 className="font-bold mb-2">Employee Distribution by Location</h2>
          <PieChart width={300} height={200}>
            <Pie data={pieDataLocation} cx={150} cy={100} outerRadius={60} fill="#8884d8" dataKey="value">
              {pieDataLocation.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
