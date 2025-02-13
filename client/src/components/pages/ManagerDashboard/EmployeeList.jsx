import React from "react";
import { useGetAllEmployeesQuery } from "../../../slices/employeeSlice";

const EmployeeList = () => {
  const { data: employees, error, isLoading } = useGetAllEmployeesQuery({ page: 1, limit: 10 });

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching employees:", error);
    return <p className="text-red-500">Error fetching employees</p>;
  }
  console.log("API Response:", employees);
  // Extract employee list
  const employeeList = Array.isArray(employees?.data?.employees) ? employees.data.employees : [];

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
  {employeeList.length === 0 ? (
    <tr>
      <td colSpan="3" className="p-3 text-center text-gray-500">
        No employees found.
      </td>
    </tr>
  ) : (
    employeeList.map((employee) => (
      <tr key={employee.id} className="border-b hover:bg-gray-100">
        <td className="p-3">{`${employee.firstName} ${employee.lastName}`}</td>
        <td className="p-3">{employee.position}</td>
        <td className="p-3">{employee.user.email }</td>
      </tr>
    ))
  )}
</tbody>

      </table>
    </div>
  );
};

export default EmployeeList;
