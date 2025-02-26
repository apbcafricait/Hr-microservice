import React, { useState, useRef } from "react";
import { Plus, Upload, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useCreateEmployeeMutation } from "../../../../slices/employeeSlice";
import { useGetOrganizationsQuery } from "../../../../slices/organizationSlice";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    nationalId: "",
    dateOfBirth: "",
    position: "",
    employmentDate: "",
    salary: "",
    role: "",
    organisationId: "", // Changed to empty string to require selection
  });

  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const [createEmployee, { isLoading: isCreatingEmployee }] = useCreateEmployeeMutation();
  const { data: organizationsData, isLoading: isLoadingOrganizations, error: orgError } = useGetOrganizationsQuery();
  const organizations = organizationsData || [];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        toast.error("Please upload a JPG, PNG, or GIF file.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: 'bg-red-500 text-white',
        });
        return;
      }

      if (file.size > 1048576) {
        toast.error("File size must be less than 1MB.", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          className: 'bg-red-500 text-white',
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.organisationId) {
      toast.error("Please fill in all required fields.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        className: 'bg-red-500 text-white',
      });
      return;
    }

    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary) || 0, // Default to 0 if empty
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : "",
        employmentDate: formData.employmentDate ? new Date(formData.employmentDate).toISOString().split('T')[0] : "",
        organisationId: Number(formData.organisationId), // Ensure it's a number
      };

      const result = await createEmployee(employeeData).unwrap();
      console.log("Employee created successfully:", result);
      toast.success("Employee added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-green-500 text-white',
      });
      resetForm();
    } catch (error) {
      console.error("Failed to create employee:", error);
      toast.error(`Failed to add employee: ${error?.data?.message || error.message || 'Unknown error'}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        className: 'bg-red-500 text-white',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      nationalId: "",
      dateOfBirth: "",
      position: "",
      employmentDate: "",
      salary: "",
      role: "",
      organisationId: "",
    });
    setPreviewImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16 z-50"
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-100"
        >
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-indigo-900 tracking-tight">
              Add New Employee
            </h1>
            <motion.button
              whileHover={{ rotate: 90 }}
              onClick={resetForm}
              className="text-gray-400 hover:text-indigo-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-indigo-50 overflow-hidden shadow-md">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Upload className="h-10 w-10 text-indigo-400" />
                  </div>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  type="button"
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full p-2 text-white hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 shadow-md"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="h-5 w-5" />
                </motion.button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept=".jpg,.png,.gif"
                  onChange={handleImageUpload}
                />
              </div>
              <p className="text-center text-xs md:text-sm text-indigo-600 mt-3">
                Accepts JPG, PNG, GIF up to 1MB (Recommended: 200px × 200px)
              </p>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  National ID
                </label>
                <input
                  type="text"
                  placeholder="National ID"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>

            {/* Employment Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Position
                </label>
                <input
                  type="text"
                  placeholder="Position"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Employment Date
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.employmentDate}
                  onChange={(e) => setFormData({ ...formData, employmentDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Salary
                </label>
                <input
                  type="number"
                  placeholder="Salary"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Role
                </label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm appearance-none"
                  >
                    <option value="">Select Role</option>
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Organization and Login Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.organisationId}
                    onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm appearance-none"
                    required
                  >
                    <option value="">Select Organization</option>
                    {isLoadingOrganizations ? (
                      <option>Loading organizations...</option>
                    ) : orgError ? (
                      <option>Error loading organizations</option>
                    ) : (
                      organizations.map((org) => (
                        <option key={org.id} value={org.id}>
                          {org.name}
                        </option>
                      ))
                    )}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="employee@example.com"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 shadow-sm"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Required Field Note */}
            <div className="text-sm text-indigo-600">
              <span className="text-red-500">*</span> Required fields
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-x-0 sm:space-x-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={resetForm}
                className="px-6 py-3 border-2 border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 shadow-md font-semibold"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isCreatingEmployee || isLoadingOrganizations}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {isCreatingEmployee ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Saving...
                  </span>
                ) : (
                  "Save Employee"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddEmployee;