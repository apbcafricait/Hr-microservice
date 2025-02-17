import React from 'react';
import { Clock, Users, Calendar, ClipboardList, ChevronRight, Settings, Bell } from 'lucide-react';
import { PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  // Sample data for the pie chart
  const distributionData = [
    { name: 'Unassigned', value: 97.4, color: '#FF6B6B' },
    { name: 'Human Resources', value: 2.6, color: '#FFB067' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Time at Work Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-700 font-semibold flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time at Work
            </h2>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full" />
            </div>
            <div className="ml-3">
              <h3 className="text-orange-500 font-medium">Punched Out</h3>
              <p className="text-sm text-gray-500">Punched Out: Today at 11:10 AM</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
            <span>1h 5m Today</span>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-orange-500" />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600 mb-2">This Week</div>
            <div className="text-xs text-gray-500">Feb 17 - Feb 23</div>
            <div className="grid grid-cols-7 gap-2 mt-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center">
                  <div className={`h-24 w-full rounded ${i === 0 ? 'bg-orange-500' : 'bg-gray-100'}`} />
                  <span className="text-xs mt-1 text-gray-500">{day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* My Actions Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-gray-700 font-semibold flex items-center mb-6">
            <ClipboardList className="w-4 h-4 mr-2" />
            My Actions
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-red-500" />
              </div>
              <div className="ml-3">
                <span className="text-sm text-gray-600">(1) Pending Self Review</span>
              </div>
            </div>

            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div className="ml-3">
                <span className="text-sm text-gray-600">(1) Candidate to Interview</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Launch Card */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-gray-700 font-semibold flex items-center mb-6">
            <ChevronRight className="w-4 h-4 mr-2" />
            Quick Launch
          </h2>

          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Assign Leave', icon: Users },
              { title: 'Leave List', icon: ClipboardList },
              { title: 'Timesheets', icon: Clock },
              { title: 'Apply Leave', icon: Calendar },
              { title: 'My Leave', icon: Calendar },
              { title: 'My Timesheet', icon: Clock },
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                  <item.icon className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-xs text-gray-600 text-center">{item.title}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-gray-700 font-semibold flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Employee Distribution by Sub Unit
            </h2>
            <Settings className="w-4 h-4 text-gray-400" />
          </div>

          <div className="flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={distributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </div>

          <div className="flex justify-center gap-4 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;