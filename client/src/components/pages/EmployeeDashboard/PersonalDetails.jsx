import { useState } from "react";
import { useCreateEmployeeMutation } from "../../../slices/employeeSlice";

const PersonalDetails = () => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    employeeId: "",
    position: "",
    dateOfBirth: "",
    employmentDate: "",
    nationality: "",
    email: "",
    organisationId: 1,
  });

  const [personalDetails, setPersonalDetails] = useState({
    employmentDate: "",
    salary: "",
  });

  const [loading, setLoading] = useState(false);

  // Redux mutation hook
  const [createEmployee] = useCreateEmployeeMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Update the correct state dynamically based on the field name
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (name === "salary") {
      setPersonalDetails((prevDetails) => ({
        ...prevDetails,
        salary: value,
      }));
    }
  };
  

  const handleSave = async () => {
    setLoading(true);
    try {
      // Combine formData and personalDetails
      const payload = {
        ...formData,
        ...personalDetails,
      };

      // Call createEmployee mutation
      const response = await createEmployee(payload).unwrap();
      console.log("Employee created successfully:", response);

      alert("Details Saved Successfully!");
    } catch (error) {
      console.error("Error creating employee:", error);
      alert("Failed to save details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl">
        <h2 className="text-2xl font-semibold text-center text-blue-600 mb-6">
          Personal Details
        </h2>
        <form>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                placeholder="Enter first name"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                placeholder="Enter last name"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee National ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                placeholder="Enter ID"
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
    onChange={handleChange}
    disabled={true} // Restricts the employee from editing
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-gray-200 cursor-not-allowed"
    placeholder="Position is set by the organization"
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
    value={formData.employmentDate} // Ensure this is pointing to formData
    onChange={handleChange} // Corrected handleChange
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
  />
</div>

<div>
  <label className="block text-sm font-medium text-gray-700">Salary</label>
  <select
    name="salary"
    value={personalDetails.salary || ""}
    onChange={handleChange}
    disabled={true} // Restricts the employee from editing
    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-200 cursor-not-allowed"
  >
    <option value="">-- Select Salary Range --</option>
    <option value="0-20000">0 - 20,000</option>
    <option value="20001-50000">20,001 - 50,000</option>
    <option value="50001-100000">50,001 - 100,000</option>
    <option value="100001-200000">100,001 - 200,000</option>
    <option value="200001+">200,001 and above</option>
  </select>
</div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="text"
                name="email"
                value={formData.email}
                placeholder="Enter email address"
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? "Saving..." : "Save Details"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalDetails;
