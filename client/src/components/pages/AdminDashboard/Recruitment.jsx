import React, { useState, useEffect } from "react";
import {
  Calendar,
  Eye,
  Trash2,
  Download,
  ChevronDown,
  Search,
  RefreshCw,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import { useGetAllCandidatesQuery, useCreateCandidateMutation } from "../../../slices/recruitmentApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Vacancy from "../../pages/AdminDashboard/Vacancy";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("Candidates");
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedHiringManager, setSelectedHiringManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [keywords, setKeywords] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [methodOfApplication, setMethodOfApplication] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState({
    vacancy: "",
    candidateName: "",
    hiringManager: "",
    applicationDate: "",
    status: "",
  });

  const { data: candidates = [], isLoading, refetch } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();

  const handleReset = () => {
    setSelectedJobTitle("");
    setSelectedVacancy("");
    setSelectedHiringManager("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setKeywords("");
    setCandidateName("");
    setMethodOfApplication("");
  };

  const handleSearch = () => {
    console.log("Search triggered with filters:", {
      selectedJobTitle,
      selectedVacancy,
      selectedHiringManager,
      selectedStatus,
      dateFrom,
      dateTo,
      keywords,
      candidateName,
      methodOfApplication,
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setNewCandidate({
      vacancy: "",
      candidateName: "",
      hiringManager: "",
      applicationDate: "",
      status: "",
    });
  };

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCandidate(newCandidate).unwrap();
      toast.success("Candidate created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
      refetch(); // Refresh the candidate list
      closeModal();
    } catch (error) {
      toast.error("Failed to create candidate. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  if (isLoading) return <div className="text-center text-gray-500 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 shadow-sm mb-6 rounded-t-lg">
          <div className="flex items-center justify-start space-x-6 px-6 py-4">
            {["Candidates", "Vacancy"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-medium rounded-t-md transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white border-b-2 border-indigo-600"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md p-6"
        >
          {activeTab === "Candidates" ? (
            <>
              {/* Filter Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Candidates</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={openModal}
                    className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Candidate
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <div className="relative">
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={selectedJobTitle}
                        onChange={(e) => setSelectedJobTitle(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="qa">Senior QA Lead</option>
                        <option value="dev">Senior Developer</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Vacancy */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Vacancy</label>
                    <div className="relative">
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={selectedVacancy}
                        onChange={(e) => setSelectedVacancy(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="open">Open</option>
                        <option value="closed">Closed</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Hiring Manager */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Hiring Manager</label>
                    <div className="relative">
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={selectedHiringManager}
                        onChange={(e) => setSelectedHiringManager(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="manager1">Manager 1</option>
                        <option value="manager2">Manager 2</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="relative">
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                  {/* Candidate Name */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                    <input
                      type="text"
                      placeholder="Type for hints..."
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Keywords</label>
                    <input
                      type="text"
                      placeholder="Enter comma separated words..."
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>

                  {/* Method of Application */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Method of Application</label>
                    <div className="relative">
                      <select
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                        value={methodOfApplication}
                        onChange={(e) => setMethodOfApplication(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="online">Online</option>
                        <option value="referral">Referral</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                {/* Date of Application */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Application</label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <input
                      type="date"
                      className="w-full sm:w-auto rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="date"
                      className="w-full sm:w-auto rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center gap-2"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </motion.button>
                </div>
              </div>

              {/* Table Section */}
              <div className="mt-8">
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="w-4 p-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600"
                          />
                        </th>
                        {[
                          "Vacancy",
                          "Candidate",
                          "Hiring Manager",
                          "Date of Application",
                          "Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidates.map((item) => (
                        <motion.tr
                          key={item.id}
                          whileHover={{ backgroundColor: "#F9FAFB" }}
                          transition={{ duration: 0.2 }}
                        >
                          <td className="w-4 p-4">
                            <input
                              type="checkbox"
                              className="rounded border-gray-300 text-indigo-600"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.vacancy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.candidateName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.hiringManager}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.applicationDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex gap-3">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-indigo-500 hover:text-indigo-700"
                              >
                                <Eye className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-5 w-5" />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="text-gray-500 hover:text-gray-700"
                              >
                                <Download className="h-5 w-5" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <Vacancy />
          )}
        </motion.div>

        {/* Modal for Adding Candidate */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Candidate</h3>
              <form onSubmit={handleCandidateSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Vacancy</label>
                  <input
                    type="text"
                    value={newCandidate.vacancy}
                    onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Candidate Name</label>
                  <input
                    type="text"
                    value={newCandidate.candidateName}
                    onChange={(e) => setNewCandidate({ ...newCandidate, candidateName: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Hiring Manager</label>
                  <input
                    type="text"
                    value={newCandidate.hiringManager}
                    onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Application Date</label>
                  <input
                    type="date"
                    value={newCandidate.applicationDate}
                    onChange={(e) => setNewCandidate({ ...newCandidate, applicationDate: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={newCandidate.status}
                    onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
                    className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  >
                    <option value="">-- Select --</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {isCreating ? "Saving..." : "Save Candidate"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
};

export default Recruitment;