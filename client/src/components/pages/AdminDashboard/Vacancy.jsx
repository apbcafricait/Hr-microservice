import React, { useState, useMemo } from "react";
import { Trash2, Edit2, Search, RefreshCw, Plus, X } from "lucide-react";
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
  const { data: apiResponse, isLoading, isError, error, refetch } = useGetAllVacanciesQuery();
  const vacanciesData = Array.isArray(apiResponse?.data) ? apiResponse.data : [];
  const [createVacancy, { isLoading: isCreating }] = useCreateVacancyMutation();
  const [updateVacancy, { isLoading: isUpdating }] = useUpdateVacancyMutation();
  const [deleteVacancy, { isLoading: isDeleting }] = useDeleteVacancyMutation();

  // Memoized filtered vacancies
  const filteredVacancies = useMemo(() => {
    return vacanciesData.filter((vacancy) => {
      return (
        (selectedJobTitle === "" || vacancy.jobTitle === selectedJobTitle) &&
        (selectedHiringManager === "" || vacancy.hiringManager === selectedHiringManager) &&
        (selectedStatus === "" || vacancy.status === selectedStatus)
      );
    });
  }, [vacanciesData, selectedJobTitle, selectedHiringManager, selectedStatus]);

  // Dynamic filter options
  const jobTitles = [...new Set(vacanciesData.map((vacancy) => vacancy.jobTitle))];
  const hiringManagers = [...new Set(vacanciesData.map((vacancy) => vacancy.hiringManager))];
  const statuses = [...new Set(vacanciesData.map((vacancy) => vacancy.status))];

  // Handlers
  const handleReset = () => {
    setSelectedJobTitle("");
    setSelectedHiringManager("");
    setSelectedStatus("");
    toast.info("Filters reset!");
  };

  const handleSearch = () => {
    toast.info("Search applied!");
  };

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

  const validateForm = () => {
    const requiredFields = ["vacancy", "jobTitle", "hiringManager", "status"];
    const missingFields = requiredFields.filter((field) => !newVacancy[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

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
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save vacancy.");
    }
  };

  const handleDeleteVacancy = async (id) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      try {
        await deleteVacancy(id).unwrap();
        toast.success("Vacancy deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete vacancy.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="text-teal-600 text-lg font-inter"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-red-600 text-lg font-inter">
          Error: {error?.data?.message || "Failed to load vacancies"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6 px-4 sm:px-6 lg:px-8 font-inter">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Inter:wght@400;500&display=swap');
          h2, h3 {
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
          }
          body, input, select, button {
            font-family: 'Inter', sans-serif;
          }
          .glassmorphism {
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          @media (max-width: 640px) {
            table {
              display: block;
            }
            tr {
              display: block;
              margin-bottom: 1rem;
              border: 1px solid #e5e7eb;
              border-radius: 0.5rem;
              padding: 1rem;
            }
            td {
              display: block;
              text-align: left;
            }
            td:before {
              content: attr(data-label);
              font-weight: 500;
              display: block;
              margin-bottom: 0.25rem;
            }
          }
        `}
      </style>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glassmorphism rounded-xl p-4 sm:p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Vacancies</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 text-sm"
              onClick={() => openModal()}
            >
              <Plus className="h-4 w-4" />
              Add Vacancy
            </motion.button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <select
                value={selectedJobTitle}
                onChange={(e) => setSelectedJobTitle(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager</label>
              <select
                value={selectedHiringManager}
                onChange={(e) => setSelectedHiringManager(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
              >
                <option value="">All</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-2"
              onClick={handleReset}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-2"
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
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-teal-50">
                    <tr>
                      {["Vacancy", "Job Title", "Hiring Manager", "Status", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
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
                        className="hover:bg-gray-50"
                      >
                        <td data-label="Vacancy" className="px-4 py-3 text-sm text-gray-900">
                          {item.vacancy || "N/A"}
                        </td>
                        <td data-label="Job Title" className="px-4 py-3 text-sm text-gray-700">
                          {item.jobTitle || "N/A"}
                        </td>
                        <td data-label="Hiring Manager" className="px-4 py-3 text-sm text-gray-700">
                          {item.hiringManager || "N/A"}
                        </td>
                        <td data-label="Status" className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                              item.status?.toLowerCase() === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status || "N/A"}
                          </span>
                        </td>
                        <td data-label="Actions" className="px-4 py-3 text-sm">
                          <div className="flex gap-3">
                            <button
                              className="text-teal-600 hover:text-teal-800"
                              onClick={() => openModal(item)}
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800"
                              onClick={() => handleDeleteVacancy(item.id)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
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
              className="glassmorphism rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {isEditMode ? "Edit Vacancy" : "Add Vacancy"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleVacancySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy *</label>
                  <input
                    value={newVacancy.vacancy}
                    onChange={(e) => setNewVacancy({ ...newVacancy, vacancy: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., Junior Account Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    value={newVacancy.jobTitle}
                    onChange={(e) => setNewVacancy({ ...newVacancy, jobTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., Account Assistant"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager *</label>
                  <input
                    value={newVacancy.hiringManager}
                    onChange={(e) => setNewVacancy({ ...newVacancy, hiringManager: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., John Doe"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={newVacancy.status}
                    onChange={(e) => setNewVacancy({ ...newVacancy, status: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
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
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-400 text-sm"
                  >
                    {isCreating || isUpdating ? "Saving..." : isEditMode ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
    </div>
  );
};

export default Vacancies;