import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetAllEmployeesQuery, useGetOrganisationEmployeesQuery } from "../../../slices/employeeSlice";
import { useGetAllLeaveRequestsQuery } from "../../../slices/leaveApiSlice";
import { PieChart, Pie, Cell } from "recharts"; // Importing additional chart types
import { HiUsers, HiOutlineCash, HiOutlineClipboardList } from "react-icons/hi"; // Example icons from Lucide
import { useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { useSelector } from "react-redux";
const Dashboard = () => {
// Get organisations employees alone so we need to filter the logged in user :

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;

const { data: orgEmpData } = useGetEmployeeQuery(id)
  console.log(orgEmpData, "data needed")

  const organisationId = orgEmpData?.data.employee.organisation.id

console.log(organisationId, "org date")

  const { data: employees, error: employeesError, isLoading: employeesLoading } = useGetOrganisationEmployeesQuery(organisationId);

  const { data: leaveRequests, error: leaveError, isLoading: leaveLoading } = useGetAllLeaveRequestsQuery({
    page: 1,
    limit: 100,
  });

  const totalEmployees = employees?.data?.employees?.length || 0;
  const totalSalary = employees?.data?.employees?.reduce((acc, emp) => acc + parseFloat(emp.salary), 0) || 0;
  const totalLeaveRequests = leaveRequests?.data?.leaveRequests?.length || 0;

  // Prepare data for department salary distribution pie chart
  const departmentSalaryData = employees?.data?.employees?.reduce((acc, emp) => {
    const departmentName = emp.department?.name || "Unassigned"; // Handle cases where department is null
    acc[departmentName] = (acc[departmentName] || 0) + parseFloat(emp.salary);
    return acc;
  }, {}) || {}; // Ensure it's at least an empty object

  const departmentSalaryArray = Object.keys(departmentSalaryData).length > 0 ?
    Object.keys(departmentSalaryData).map(department => ({
      name: department,
      value: departmentSalaryData[department],
    })) : []; // Handle case where there are no departments

  const uniqueDepartments = new Set(employees?.data?.employees?.map(emp => emp.department?.name)).size || 0;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-700">Manager Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiUsers className="text-3xl text-blue-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Employees</h2>
            <p className="text-3xl font-bold text-blue-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : totalEmployees}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineCash className="text-3xl text-green-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Salary</h2>
            <p className="text-3xl font-bold text-green-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : `$${totalSalary.toLocaleString()}`}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-yellow-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Total Leave Requests</h2>
            <p className="text-3xl font-bold text-yellow-500">
              {leaveLoading ? "Loading..." : leaveError ? "Error" : totalLeaveRequests}
            </p>
          </div>
        </div>

        <div className="bg-white shadow-md p-4 rounded-lg flex items-center">
          <HiOutlineClipboardList className="text-3xl text-purple-500 mr-4" />
          <div>
            <h2 className="text-lg font-medium text-gray-600">Departments</h2>
            <p className="text-3xl font-bold text-purple-500">
              {employeesLoading ? "Loading..." : employeesError ? "Error" : uniqueDepartments}
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Department Salary Distribution */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Department Salary Distribution</h2>
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
                  <Cell key={`cell-${index}`} fill={getRandomColor()} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`$${value.toLocaleString()}`, "Salary"]}
                labelFormatter={(label) => label}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Salary Statistics */}
        <div className="bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-lg font-medium text-gray-600 mb-4">Employee Salary Statistics</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={employees?.data?.employees}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="firstName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="salary" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6">
        <h2 className="text-lg font-medium text-gray-600 mb-4">Quick Actions</h2>
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

// Function to generate a random color for pie chart segments
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export default Dashboard;