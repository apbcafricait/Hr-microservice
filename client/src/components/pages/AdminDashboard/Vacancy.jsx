import React, { useState } from "react";
import {
  ChevronDown,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetAllVacanciesQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
} from "../../../slices/recruitmentApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Vacancies = () => {
  // State for filters
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedHiringManager, setSelectedHiringManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editVacancyId, setEditVacancyId] = useState(null);
  const [newVacancy, setNewVacancy] = useState({
    vacancy: "",
    jobTitle: "",
    hiringManager: "",
    status: "",
  });

  // API hooks
  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllVacanciesQuery();

  // Ensure vacanciesData is always an array
  const vacanciesData = Array.isArray(apiResponse?.data) ? apiResponse.data : [];

  const [createVacancy, { isLoading: isCreating }] = useCreateVacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdateVacancyMutation();
  const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();

  // Filtered vacancies based on selected filters
  const filteredVacancies = vacanciesData.filter((vacancy) => {
    return (
      (selectedJobTitle === "" || vacancy.jobTitle === selectedJobTitle) &&
      (selectedVacancy === "" || vacancy.vacancy === selectedVacancy) &&
      (selectedHiringManager === "" || vacancy.hiringManager === selectedHiringManager) &&
      (selectedStatus === "" || vacancy.status === selectedStatus)
    );
  });

  // Dynamic filter options
  const jobTitles = [...new Set(vacanciesData.map((vacancy) => vacancy.jobTitle))];
  const vacancies = [...new Set(vacanciesData.map((vacancy) => vacancy.vacancy))];
  const hiringManagers = [...new Set(vacanciesData.map((vacancy) => vacancy.hiringManager))];
  const statuses = [...new Set(vacanciesData.map((vacancy) => vacancy.status))];

  // Filter reset handler
  const handleReset = () => {
    setSelectedJobTitle("");
    setSelectedVacancy("");
    setSelectedHiringManager("");
    setSelectedStatus("");
  };

  // Search handler (client-side filtering)
  const handleSearch = () => {
    console.log("Search filters applied:", {
      selectedJobTitle,
      selectedVacancy,
      selectedHiringManager,
      selectedStatus,
    });
  };

  // Modal open/close handlers
  const openModal = (vacancy = null) => {
    if (vacancy) {
      setIsEditMode(true);
      setEditVacancyId(vacancy.id);
      setNewVacancy({
        vacancy: vacancy.vacancy || "",
        jobTitle: vacancy.jobTitle || "",
        hiringManager: vacancy.hiringManager || "",
        status: vacancy.status || "",
      });
    } else {
      setIsEditMode(false);
      setEditVacancyId(null);
      setNewVacancy({ vacancy: "", jobTitle: "", hiringManager: "", status: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditVacancyId(null);
    setNewVacancy({ vacancy: "", jobTitle: "", hiringManager: "", status: "" });
  };

  // Form validation
  const validateForm = () => {
    const requiredFields = ["vacancy", "jobTitle", "hiringManager", "status"];
    const missingFields = requiredFields.filter((field) => !newVacancy[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  // Submit handler for create/update
  const handleVacancySubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await updateVacancy({ id: editVacancyId, ...newVacancy }).unwrap();
        toast.success("Vacancy updated successfully!");
      } else {
        await createVacancy(newVacancy).unwrap();
        toast.success("Vacancy created successfully!");
      }
      refetch(); // Refresh the table data after mutation
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save vacancy.");
    }
  };

  // Delete handler
  const handleDeleteVacancy = async (id) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        await deleteVacancy(id).unwrap();
        toast.success("Vacancy deleted successfully!");
        refetch(); // Refresh the table data after deletion
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete vacancy.");
      }
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-teal-600 text-xl"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-xl">
          Error: {error?.data?.message || "Failed to load vacancies"}
        </div>
      </div>
    );
  }

  // Main UI
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-lg p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Vacancies</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2"
              onClick={() => openModal()}
            >
              <Plus className="h-4 w-4" />
              Add Vacancy
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Job Title</label>
              <select
                value={selectedJobTitle}
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                className="mt-1 w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                {jobTitles.map((title) => (
                  <option key={title} value={title}>
                    {title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Vacancy</label>
              <select
                value={selectedVacancy}
                onChange={(e) => setSelectedVacancy(e.target.value)}
                className="mt-1 w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                {vacancies.map((vacancy) => (
                  <option key={vacancy} value={vacancy}>
                    {vacancy}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hiring Manager</label>
              <select
                value={selectedHiringManager}
                onChange={(e) => setSelectedHiringManager(e.target.value)}
                className="mt-1 w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              >
                <option value="">All</option>
                {hiringManagers.map((manager) => (
                  <option key={manager} value={manager}>
                    {manager}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="mt-1 w-full p-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none"
                >
                  <option value="">All</option>
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 flex items-center gap-2"
              onClick={handleSearch}
            >
              <Search className="h-4 w-4" />
              Search
            </motion.button>
          </div>

          {/* Table */}
          <div>
            <div className="text-sm text-gray-600 mb-4">
              ({filteredVacancies.length}) Records Found
            </div>

            {filteredVacancies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No vacancies found.</div>
            ) : (
              <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-teal-50">
                    <tr>
                      <th className="p-3">
                        <input type="checkbox" className="rounded border-gray-300" />
                      </th>
                      {["Vacancy", "Job Title", "Hiring Manager", "Status", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVacancies.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "#F9FAFB" }}
                      >
                        <td className="p-3">
                          <input type="checkbox" className="rounded border-gray-300" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                          {item.vacancy || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {item.jobTitle || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                          {item.hiringManager || "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                              item.status?.toLowerCase() === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-teal-600 hover:text-teal-800"
                              onClick={() => openModal(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteVacancy(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  {isEditMode ? "Edit Vacancy" : "Add Vacancy"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleVacancySubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Vacancy *</label>
                  <input
                    value={newVacancy.vacancy}
                    onChange={(e) => setNewVacancy({ ...newVacancy, vacancy: e.target.value })}
                    className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Junior Account Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Job Title *</label>
                  <input
                    value={newVacancy.jobTitle}
                    onChange={(e) => setNewVacancy({ ...newVacancy, jobTitle: e.target.value })}
                    className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Account Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Hiring Manager *</label>
                  <input
                    value={newVacancy.hiringManager}
                    onChange={(e) =>
                      setNewVacancy({ ...newVacancy, hiringManager: e.target.value })
                    }
                    className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="e.g., Manager 1"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status *</label>
                  <select
                    value={newVacancy.status}
                    onChange={(e) => setNewVacancy({ ...newVacancy, status: e.target.value })}
                    className="mt-1 w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select</option>
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCreating || isUpdating ? "Saving..." : isEditMode ? "Update" : "Save"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      </div>
    </div>
  );
};

export default Vacancies;