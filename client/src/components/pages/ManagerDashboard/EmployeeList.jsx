import React, { useState, useMemo } from "react";
import AddEmployee from "./AddEmployee"; // Import the AddEmployee component
import { useGetAllEmployeesQuery } from "../../../slices/employeeSlice";

const EmployeeList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [positionFilter, setPositionFilter] = useState("");

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

  // Sorting Logic
  const sortedEmployees = useMemo(() => {
    let sorted = [...employeeList];

    if (sortField) {
      sorted.sort((a, b) => {
        let aValue = a[sortField] || "";
        let bValue = b[sortField] || "";

        if (sortField === "firstName") {
          aValue = `${a.firstName} ${a.lastName}`;
          bValue = `${b.firstName} ${b.lastName}`;
        }

        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });
    }

    return sorted;
  }, [employeeList, sortField, sortOrder]);

  // Filtering Logic
  const filteredEmployees = sortedEmployees.filter((emp) =>
    positionFilter ? emp.position === positionFilter : true
  );

  // Handle Sorting
  const handleSort = (field) => {
    setSortOrder(sortField === field && sortOrder === "asc" ? "desc" : "asc");
    setSortField(field);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      {/* Sorting & Filtering Controls */}
      <div className="flex justify-between items-center mb-4">
        <select
          className="border p-2 rounded"
          value={positionFilter}
          onChange={(e) => setPositionFilter(e.target.value)}
        >
          <option value="">All Positions</option>
          {[...new Set(employeeList.map((emp) => emp.position))].map(
            (position) => (
              <option key={position} value={position}>
                {position}
              </option>
            )
          )}
        </select>
      </div>

      {/* Employee Table */}
      <table className="w-full text-left border-collapse shadow-lg rounded-lg overflow-hidden">
        <thead className="bg-gray-200 text-gray-600 uppercase text-sm">
          <tr>
            <th
              className="p-4 border-b cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort("firstName")}
            >
              Name {sortField === "firstName" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-4 border-b cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort("position")}
            >
              Position {sortField === "position" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th
              className="p-4 border-b cursor-pointer hover:bg-gray-300"
              onClick={() => handleSort("email")}
            >
              Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th className="p-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No employees found.
              </td>
            </tr>
          ) : (
            filteredEmployees.map((employee, index) => (
              <tr
                key={employee.id}
                className={`border-b ${index % 2 === 0 ? "bg-gray-100" : "bg-white"} hover:bg-gray-200 transition`}
              >
                <td className="p-4">{`${employee.firstName} ${employee.lastName}`}</td>
                <td className="p-4">{employee.position || "N/A"}</td>
                <td className="p-4">{employee.user?.email || "N/A"}</td>
                <td className="p-4 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                    onClick={() => {
                      setSelectedEmployee(employee);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    onClick={() => setDeleteEmployee(employee)}
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

      {/* Delete Confirmation Modal */}
      {deleteEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Are you sure you want to delete {deleteEmployee.firstName} {deleteEmployee.lastName}?
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setDeleteEmployee(null)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => {
                  console.log("Deleting employee:", deleteEmployee.id);
                  setDeleteEmployee(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AddEmployee Form as a Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <AddEmployee employee={selectedEmployee} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
