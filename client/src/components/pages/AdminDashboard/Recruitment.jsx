import React, { useState } from "react";
import {
  ChevronDown,
  Trash2,
  Edit2,
  Search,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useGetAllCandidatesQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
} from "../../../slices/recruitmentApiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import jsPDF from "jspdf";

const Recruitment = () => {
  // State for filters
  const [selectedJobTitle, setSelectedJobTitle] = useState("");
  const [selectedVacancy, setSelectedVacancy] = useState("");
  const [selectedHiringManager, setSelectedHiringManager] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [candidateName, setCandidateName] = useState("");

  // State for modal and form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [newCandidate, setNewCandidate] = useState({
    jobTitle: "",
    vacancy: "",
    candidateName: "",
    hiringManager: "",
    dateOfApplication: "",
    status: "",
    email: "",
    contactNumber: "",
    resume: null,
    keywords: "",
    methodOfApplication: "",
    notes: "",
  });

  // API hooks
  const { data: candidates = [], isLoading, refetch } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  // Pagination
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = candidates.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(candidates.length / recordsPerPage);

  // Filter candidates based on selected filters
  const filteredCandidates = candidates.filter((candidate) => {
    return (
      (selectedJobTitle === "" || candidate.jobTitle.includes(selectedJobTitle)) &&
      (selectedVacancy === "" || candidate.vacancy.includes(selectedVacancy)) &&
      (selectedHiringManager === "" || candidate.hiringManager.includes(selectedHiringManager)) &&
      (selectedStatus === "" || candidate.status === selectedStatus) &&
      (candidateName === "" || candidate.candidateName.includes(candidateName)) &&
      (dateFrom === "" || new Date(candidate.dateOfApplication) >= new Date(dateFrom)) &&
      (dateTo === "" || new Date(candidate.dateOfApplication) <= new Date(dateTo))
    );
  });

  // Reset filters
  const handleReset = () => {
    setSelectedJobTitle("");
    setSelectedVacancy("");
    setSelectedHiringManager("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setCandidateName("");
    setCurrentPage(1);
  };

  // Search handler
  const handleSearch = () => {
    setCurrentPage(1);
  };

  // Open modal for adding/editing candidates
  const openModal = (candidate = null) => {
    if (candidate) {
      setIsEditMode(true);
      setEditCandidateId(candidate.id);
      setNewCandidate({
        ...candidate,
        dateOfApplication: candidate.dateOfApplication.split("T")[0],
      });
    } else {
      setIsEditMode(false);
      setEditCandidateId(null);
      setNewCandidate({
        jobTitle: "",
        vacancy: "",
        candidateName: "",
        hiringManager: "",
        dateOfApplication: "",
        status: "",
        email: "",
        contactNumber: "",
        resume: null,
        keywords: "",
        methodOfApplication: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditCandidateId(null);
  };

  // Validate form
  const validateForm = () => {
    const requiredFields = [
      "candidateName",
      "jobTitle",
      "vacancy",
      "hiringManager",
      "dateOfApplication",
      "status",
      "email",
      "contactNumber",
    ];
    const missingFields = requiredFields.filter((field) => !newCandidate[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    return true;
  };

  // Submit handler for create/update
  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (isEditMode) {
        await updateCandidate({ id: editCandidateId, candidateData: newCandidate }).unwrap();
        toast.success("Candidate updated successfully!");
      } else {
        await createCandidate(newCandidate).unwrap();
        toast.success("Candidate created successfully!");
      }
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save candidate.");
    }
  };

  // Delete candidate
  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id).unwrap();
        toast.success("Candidate deleted successfully!");
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete candidate.");
      }
    }
  };

  // Download candidate details as PDF
  const handleDownloadCandidateDetails = (candidate) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Candidate Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${candidate.candidateName}`, 20, 30);
    doc.text(`Job Title: ${candidate.jobTitle}`, 20, 40);
    doc.text(`Vacancy: ${candidate.vacancy}`, 20, 50);
    doc.text(`Hiring Manager: ${candidate.hiringManager}`, 20, 60);
    doc.text(`Application Date: ${candidate.dateOfApplication.split("T")[0]}`, 20, 70);
    doc.text(`Status: ${candidate.status}`, 20, 80);
    doc.text(`Email: ${candidate.email}`, 20, 90);
    doc.text(`Contact Number: ${candidate.contactNumber}`, 20, 100);
    doc.save(`${candidate.candidateName}_Details.pdf`);
  };

  // Pagination handlers
  const goToPreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handleRecordsPerPageChange = (e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Candidate Management</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => openModal()}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Candidate
          </motion.button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
            <input
              value={selectedJobTitle}
              onChange={(e) => setSelectedJobTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Search by job title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy</label>
            <input
              value={selectedVacancy}
              onChange={(e) => setSelectedVacancy(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Search by vacancy..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager</label>
            <input
              value={selectedHiringManager}
              onChange={(e) => setSelectedHiringManager(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Search by hiring manager..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
            >
              <option value="">All</option>
              <option value="Active">Active</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Candidate Name</label>
            <input
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              placeholder="Search by name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="flex space-x-4">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-end space-x-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reset
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSearch}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"
          >
            <Search className="h-5 w-5 mr-2" />
            Search
          </motion.button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vacancy
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Candidate
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCandidates
                .slice(indexOfFirstRecord, indexOfLastRecord)
                .map((item) => (
                  <motion.tr
                    key={item.id}
                    whileHover={{ backgroundColor: "#F9FAFB" }}
                    className="transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vacancy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.candidateName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.hiringManager}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.dateOfApplication.split("T")[0]}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => openModal(item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDeleteCandidate(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        onClick={() => handleDownloadCandidateDetails(item)}
                        className="text-teal-600 hover:text-teal-800"
                      >
                        <Download className="h-5 w-5" />
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <select
              value={recordsPerPage}
              onChange={handleRecordsPerPageChange}
              className="p-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-blue-500"
            >
              {[5, 10, 25, 50].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredCandidates.length)} of {filteredCandidates.length}
            </span>
          </div>
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 bg-white shadow-sm"
            >
              <ChevronLeft className="h-5 w-5" />
            </motion.button>
            <span className="px-4 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-sm">
              Page {currentPage} of {totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 bg-white shadow-sm"
            >
              <ChevronRight className="h-5 w-5" />
            </motion.button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-800">
                  {isEditMode ? "Edit Candidate" : "Add Candidate"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleCandidateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      value={newCandidate.candidateName}
                      onChange={(e) => setNewCandidate({ ...newCandidate, candidateName: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      value={newCandidate.jobTitle}
                      onChange={(e) => setNewCandidate({ ...newCandidate, jobTitle: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy *</label>
                    <input
                      value={newCandidate.vacancy}
                      onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager *</label>
                    <input
                      value={newCandidate.hiringManager}
                      onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Date *</label>
                    <input
                      type="date"
                      value={newCandidate.dateOfApplication}
                      onChange={(e) => setNewCandidate({ ...newCandidate, dateOfApplication: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      value={newCandidate.status}
                      onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Active">Active</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      value={newCandidate.email}
                      onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      value={newCandidate.contactNumber}
                      onChange={(e) => setNewCandidate({ ...newCandidate, contactNumber: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                  <input
                    value={newCandidate.keywords}
                    onChange={(e) => setNewCandidate({ ...newCandidate, keywords: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <input
                      type="file"
                      onChange={(e) => setNewCandidate({ ...newCandidate, resume: e.target.files[0] })}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newCandidate.notes}
                    onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    rows="4"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 bg-white shadow-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 shadow-md"
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

export default Recruitment;