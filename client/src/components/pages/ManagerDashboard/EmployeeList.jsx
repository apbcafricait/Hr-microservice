import React, { useState } from "react";
import AddEmployee from "./AddEmployee"; // Import the AddEmployee component
import { useGetAllEmployeesQuery  } from "../../../slices/employeeSlice";

const EmployeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Items per page
  const [showForm, setShowForm] = useState(false); // State to show/hide the form
  const [selectedEmployee, setSelectedEmployee] = useState(null); // State for selected employee

  const { data: employees, error, isLoading } = useGetAllEmployeesQuery({
    page: currentPage,
    limit,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching employees:", error);
    return (
      <p className="text-red-500">
        Error fetching employees.{" "}
        <button onClick={() => window.location.reload()}>Retry</button>
      </p>
    );
  }

  const employeeList = Array.isArray(employees?.data?.employees)
    ? employees.data.employees
    : [];
  const totalPages = employees?.data?.totalPages || 1;

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee); // Set the employee to edit
    setShowForm(true); // Show the AddEmployee form
  };

  const handleCloseForm = () => {
    setSelectedEmployee(null); // Clear the selected employee
    setShowForm(false); // Hide the form
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Position</th>
            <th className="p-3">Email</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {employeeList.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-3 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          ) : (
            employeeList.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-100">
                <td className="p-3">{`${employee.firstName} ${employee.lastName}`}</td>
                <td className="p-3">{employee.position || "N/A"}</td>
                <td className="p-3">{employee.user?.email || "N/A"}</td>
                <td className="p-3">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                    onClick={() => handleEditClick(employee)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => console.log("Delete employee:", employee.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* AddEmployee Form as a Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddEmployee
              employee={selectedEmployee} // Pass the employee to edit
              onClose={handleCloseForm} // Close the form
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
