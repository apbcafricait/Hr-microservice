import React, { useState, useMemo } from "react";
import {
  Calendar,
  Eye,
  Trash2,
  Download,
  Search,
  RefreshCw,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
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
import Vacancy from "../../pages/AdminDashboard/Vacancy";
import jsPDF from "jspdf";

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState("Candidates");
  const [vacancySearch, setVacancySearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);

  const [newCandidate, setNewCandidate] = useState({
    jobTitle: "",
    vacancy: "",
    hiringManager: "",
    status: "",
    candidateName: "",
    keywords: "",
    methodOfApplication: "",
    dateOfApplication: "",
    from: "",
    to: "",
    email: "",
    resume: null,
  });

  const { data: candidates = [], isLoading, refetch } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  // Memoized filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesVacancy = vacancySearch
        ? candidate.vacancy.toLowerCase().includes(vacancySearch.toLowerCase())
        : true;
      const matchesStatus = selectedStatus ? candidate.status === selectedStatus : true;
      const matchesDateRange =
        dateFrom && dateTo
          ? new Date(candidate.dateOfApplication) >= new Date(dateFrom) &&
            new Date(candidate.dateOfApplication) <= new Date(dateTo)
          : true;

      return matchesVacancy && matchesStatus && matchesDateRange;
    });
  }, [candidates, vacancySearch, selectedStatus, dateFrom, dateTo]);

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCandidates.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCandidates.length / recordsPerPage);

  const handleReset = () => {
    setVacancySearch("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setCurrentPage(1);
    toast.info("Filters reset!");
  };

  const handleSearch = () => {
    setCurrentPage(1);
    toast.info("Search applied!");
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const openModal = (candidate = null) => {
    if (candidate) {
      setIsEditMode(true);
      setEditCandidateId(candidate.id);
      setNewCandidate({
        ...candidate,
        dateOfApplication: formatDateForInput(candidate.dateOfApplication),
        resume: null,
      });
    } else {
      setIsEditMode(false);
      setEditCandidateId(null);
      setNewCandidate({
        jobTitle: "",
        vacancy: "",
        hiringManager: "",
        status: "",
        candidateName: "",
        keywords: "",
        methodOfApplication: "",
        dateOfApplication: "",
        from: "",
        to: "",
        email: "",
        resume: null,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditCandidateId(null);
  };

  const validateForm = () => {
    const requiredFields = ["jobTitle", "vacancy", "candidateName", "keywords", "methodOfApplication", "hiringManager", "status", "dateOfApplication", "from", "to", "email"];
    const missingFields = requiredFields.filter((field) => !newCandidate[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newCandidate.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    return true;
  };

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
      setCurrentPage(1);
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save candidate.");
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id).unwrap();
        toast.success("Candidate deleted successfully!");
        refetch();
        if (currentRecords.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete candidate.");
      }
    }
  };

  const handleDownloadCandidateDetails = (candidate) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Candidate Details", 20, 20);
    doc.setFontSize(12);
    doc.text(`Name: ${candidate.candidateName}`, 20, 40);
    doc.text(`Vacancy: ${candidate.vacancy}`, 20, 50);
    doc.text(`Hiring Manager: ${candidate.hiringManager}`, 20, 60);
    doc.text(`Application Date: ${formatDateForDisplay(candidate.dateOfApplication.split("T")[0])}`, 20, 70);
    doc.text(`Status: ${candidate.status}`, 20, 80);
    doc.text(`Email: ${candidate.email}`, 20, 90);
    doc.save(`${candidate.candidateName}_Details.pdf`);
    toast.success(`Downloaded details for ${candidate.candidateName}`);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      toast.info(`Navigated to page ${currentPage - 1}`);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      toast.info(`Navigated to page ${currentPage + 1}`);
    }
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = Number(e.target.value);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1);
    toast.info(`Set ${newRecordsPerPage} records per page`);
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
        {/* Tabs */}
        <div className="mb-6 glassmorphism rounded-xl p-4">
          <nav className="flex flex-wrap gap-2">
            {["Candidates", "Vacancy"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab ? "bg-teal-600 text-white" : "text-gray-600 hover:bg-teal-50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glassmorphism rounded-xl p-4 sm:p-6"
        >
          {activeTab === "Candidates" ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">Candidate Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal()}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center gap-2 text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Add Candidate
                </motion.button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy</label>
                  <input
                    value={vacancySearch}
                    onChange={(e) => setVacancySearch(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="Search by vacancy..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                  >
                    <option value="">All</option>
                    <option value="Active">Active</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex justify-end gap-3 mb-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </motion.button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-teal-50">
                    <tr>
                      {["Vacancy", "Candidate", "Manager", "Date", "Status", "Actions"].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                          No candidates found.
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50"
                        >
                          <td data-label="Vacancy" className="px-4 py-3 text-sm text-gray-900">
                            {item.vacancy}
                          </td>
                          <td data-label="Candidate" className="px-4 py-3 text-sm text-gray-900 font-medium">
                            {item.candidateName}
                          </td>
                          <td data-label="Manager" className="px-4 py-3 text-sm text-gray-600">
                            {item.hiringManager}
                          </td>
                          <td data-label="Date" className="px-4 py-3 text-sm text-gray-900">
                            {formatDateForDisplay(item.dateOfApplication.split("T")[0])}
                          </td>
                          <td data-label="Status" className="px-4 py-3">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${
                                item.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td data-label="Actions" className="px-4 py-3 flex gap-2">
                            <button
                              onClick={() => openModal(item)}
                              className="text-teal-600 hover:text-teal-800"
                              title="View/Edit"
                              aria-label="View or edit candidate"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteCandidate(item.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                              aria-label="Delete candidate"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDownloadCandidateDetails(item)}
                              className="text-teal-600 hover:text-teal-700"
                              title="Download PDF"
                              aria-label="Download candidate details"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                  <select
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    className="p-2 border border-gray-300 rounded-lg text-sm bg-white"
                  >
                    {[5, 10, 25, 50].map((num) => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                  <span className="text-sm text-gray-600">
                    Showing {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, filteredCandidates.length)} of {filteredCandidates.length}
                  </span>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <Vacancy />
          )}
        </motion.div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="glassmorphism rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {isEditMode ? "Edit Candidate" : "Add Candidate"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700" aria-label="Close modal">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCandidateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
                  <input
                    value={newCandidate.jobTitle}
                    onChange={(e) => setNewCandidate({ ...newCandidate, jobTitle: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., Software Development"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vacancy *</label>
                  <input
                    value={newCandidate.vacancy}
                    onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., senior Software developer"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name *</label>
                  <input
                    value={newCandidate.candidateName}
                    onChange={(e) => setNewCandidate({ ...newCandidate, candidateName: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., Joe Maina"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords *</label>
                  <input
                    value={newCandidate.keywords}
                    onChange={(e) => setNewCandidate({ ...newCandidate, keywords: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., Software development, Coding"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Method of Application *</label>
                  <select
                    value={newCandidate.methodOfApplication}
                    onChange={(e) => setNewCandidate({ ...newCandidate, methodOfApplication: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Online">Online</option>
                    <option value="In-person">In-person</option>
                    <option value="Email">Email</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Manager *</label>
                  <input
                    value={newCandidate.hiringManager}
                    onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., HR"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                  <select
                    value={newCandidate.status}
                    onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Active">Active</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date *</label>
                    <input
                      type="date"
                      value={newCandidate.from}
                      onChange={(e) => setNewCandidate({ ...newCandidate, from: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date *</label>
                    <input
                      type="date"
                      value={newCandidate.to}
                      onChange={(e) => setNewCandidate({ ...newCandidate, to: e.target.value })}
                      className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Application Date *</label>
                  <input
                    type="date"
                    value={newCandidate.dateOfApplication}
                    onChange={(e) => setNewCandidate({ ...newCandidate, dateOfApplication: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={newCandidate.email}
                    onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                    className="w-full p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-white"
                    placeholder="e.g., john.doe@example.com"
                    required
                  />
                </div>
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume</label>
                    <input
                      type="file"
                      onChange={(e) => setNewCandidate({ ...newCandidate, resume: e.target.files[0] })}
                      className="w-full p-2 rounded-lg border border-gray-300 text-sm bg-white"
                    />
                  </div>
                )}
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

export default Recruitment;