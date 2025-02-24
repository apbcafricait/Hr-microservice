import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useGetOrganisationEmployeesQuery, useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useGetAllLeaveRequestsOfOrganisationQuery } from '../../../slices/leaveApiSlice';
import { useGetAttendanceRecordsQuery } from '../../../slices/attendanceSlice';
import { HiUsers, HiOutlineCash, HiOutlineClipboardList } from 'react-icons/hi';
import { useSelector } from 'react-redux';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const Dashboard = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const organisationId = orgEmpData?.data.employee.organisation.id;
  const employeeId = orgEmpData?.data.employee.id;

  const { data: employees, error: employeesError, isLoading: employeesLoading } = useGetOrganisationEmployeesQuery(organisationId);
  const { data: leaveRequests, error: leaveError, isLoading: leaveLoading } = useGetAllLeaveRequestsOfOrganisationQuery(employeeId);
  const { data: attendanceData, error: attendanceError, isLoading: attendanceLoading, refetch } = useGetAttendanceRecordsQuery(organisationId);

  const totalEmployees = employees?.data?.employees?.length || 0;
  const totalSalary = employees?.data?.employees?.reduce((acc, emp) => acc + parseFloat(emp.salary), 0) || 0;
  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.length || 0;
  const uniqueDepartments = new Set(employees?.data?.employees?.map(emp => emp.department?.name)).size || 0;

  const departmentSalaryData = employees?.data?.employees?.reduce((acc, emp) => {
    const departmentName = emp.department?.name || "Unassigned";
    acc[departmentName] = (acc[departmentName] || 0) + parseFloat(emp.salary);
    return acc;
  }, {}) || {};
  const departmentSalaryArray = Object.keys(departmentSalaryData).length > 0 ?
    Object.keys(departmentSalaryData).map(department => ({
      name: department,
      value: departmentSalaryData[department],
    })) : [];

  // Process attendance data
  const today = new Date().toISOString().split('T')[0];
  const todaysAttendance = attendanceData?.filter(record => record.date === today) || [];
  const employeesClockedInToday = new Set(todaysAttendance.map(record => record.employeeId)).size;
  const pastWeekDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();
  const attendanceByDay = pastWeekDates.map(date => {
    const recordsOnDate = attendanceData?.filter(record => record.date === date) || [];
    const uniqueEmployees = new Set(recordsOnDate.map(record => record.employeeId)).size;
    return { date, count: uniqueEmployees };
  });

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-700">Welcome, {userInfo.name}</h1>
        <p className="text-lg text-gray-500">Manager Dashboard</p>
      </header>

      <section className="mb-8">
        <button
          onClick={refetch}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow transition duration-300"
        >
          Refresh Data
        </button>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <HiUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Total Employees</h2>
            <p className="text-3xl font-bold text-blue-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : totalEmployees}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <HiOutlineCash className="text-3xl text-green-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Total Salary</h2>
            <p className="text-3xl font-bold text-green-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : `$${totalSalary.toLocaleString()}`}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-yellow-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Total Leave Requests</h2>
            <p className="text-3xl font-bold text-yellow-500">
              {leaveLoading ? "Loading..." : leaveError ? "Error" : totalLeaveRequests}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-purple-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Departments</h2>
            <p className="text-3xl font-bold text-purple-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : uniqueDepartments}
            </p>
          </div>
        </div>
        <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-teal-500 mr-4" />
          <div>
            <h2 className="text-xl font-semibold text-gray-600">Clocked In Today</h2>
            <p className="text-3xl font-bold text-teal-500">
              {attendanceLoading ? "Loading..." : attendanceError ? "Error" : employeesClockedInToday}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Department Salary Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentSalaryArray}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentSalaryArray.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Salary"]} labelFormatter={(label) => label} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-600 mb-4">Employee Salary Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={employees?.data?.employees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="firstName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill={COLORS[0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        {!attendanceLoading && !attendanceError && (
          <div className="bg-white shadow-lg p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-600 mb-4">Attendance Over Past Week</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attendanceByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke={COLORS[1]} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105">
            Add Employee
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105">
            Approve Leave
          </button>
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-lg shadow transition duration-300 transform hover:scale-105">
            Start Recruitment
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;