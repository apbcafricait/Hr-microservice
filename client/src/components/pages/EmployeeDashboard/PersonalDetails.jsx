import { useState, useEffect } from "react";
import { useUpdateEmployeeMutation, useGetEmployeeQuery } from "../../../slices/employeeSlice";
import { useSelector } from "react-redux";
import EmployeeHeader from "../../Layouts/EmployeeHeader";

const PersonalDetails = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  console.log(id, 'id');

  const { 
    data: employeeResponse, 
    isLoading: isFetchingEmployee,
    isError,
    error 
  } = useGetEmployeeQuery(id, { skip: !id }); 
  
  console.log(employeeResponse, 'employee data');

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    position: "",
    dateOfBirth: "",
    employmentDate: "",
    salary: "",
    email: "",
    organisationName: "",
    role: ""
  });

  const [loading, setLoading] = useState(false);
  const [updateEmployee] = useUpdateEmployeeMutation();

  // Update form data when employee data is fetched
  useEffect(() => {
    if (employeeResponse?.data?.employee) {
      const { employee } = employeeResponse.data;
      setFormData({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        nationalId: employee.nationalId || "",
        position: employee.position || "",
        dateOfBirth: employee.dateOfBirth ? new Date(employee.dateOfBirth).toISOString().split('T')[0] : "",
        employmentDate: employee.employmentDate ? new Date(employee.employmentDate).toISOString().split('T')[0] : "",
        salary: employee.salary || "",
        email: employee.user?.email || "",
        organisationName: employee.organisation?.name || "",
        role: employee.user?.role || ""
      });
    }
  }, [employeeResponse]);

  const employeeId = employeeResponse?.data?.employee?.id;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // List of fields that shouldn't be edited
    const restrictedFields = ['email', 'position', 'employmentDate', 'organisationName', 'role'];
    
    if (restrictedFields.includes(name)) {
      return;
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Only include fields that have values in the payload
      const payload = {};
      
      if (formData.firstName) payload.firstName = formData.firstName;
      if (formData.lastName) payload.lastName = formData.lastName;
      if (formData.nationalId) payload.nationalId = formData.nationalId;
      if (formData.position) payload.position = formData.position;
      if (formData.dateOfBirth) payload.dateOfBirth = formData.dateOfBirth;
      if (formData.employmentDate) payload.employmentDate = formData.employmentDate;
      if (formData.salary) payload.salary = parseFloat(formData.salary);

      const response = await updateEmployee({ id: employeeId, payload }).unwrap();
      console.log(response);
      alert("Details Updated Successfully!");
    } catch (error) {
      console.error("Error updating employee:", error);
      alert("Failed to update details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isFetchingEmployee) {
    return (
      <div className="flex flex-col min-h-screen">
        <EmployeeHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-blue-600">Loading...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col min-h-screen">
        <EmployeeHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-red-600">Error: {error?.data?.message || 'Failed to fetch employee data'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <EmployeeHeader />
      
      {/* Main Content with Offset for Fixed Header */}
      <div className="pt-24 p-4 flex-1 flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
          <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
            Personal Details
          </h2>
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600">Organization: {formData.organisationName}</p>
            <p className="text-sm text-gray-600">Role: {formData.role}</p>
          </div>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">National ID</label>
                <input
                  type="text"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  disabled={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Date</label>
                <input
                  type="date"
                  name="employmentDate"
                  value={formData.employmentDate}
                  disabled={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  disabled={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled={true}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Saving..." : "Save Details"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;