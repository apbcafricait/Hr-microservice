import React from "react";
import { useGetAllEmployeesQuery } from "../../../slices/employeeSlice";

const EmployeeList = () => {
  const { data: employees, error, isLoading } = useGetAllEmployeesQuery({ page: 1, limit: 10 });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error fetching employees</p>;

  // Safely extract employees list
  const employeeList = employees?.data || []; // Use the actual property structure if nested

  if (!Array.isArray(employeeList) || employeeList.length === 0) {
    return (
      <p className="text-gray-500 text-center">No employees found.</p>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Position</th>
            <th className="p-3">Email</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.map((employee) => (
            <tr key={employee.id} className="border-b hover:bg-gray-100">
              <td className="p-3">{`${employee.firstName} ${employee.lastName}`}</td>
              <td className="p-3">{employee.position}</td>
              <td className="p-3">{employee.email || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
