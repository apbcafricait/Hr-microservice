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
    from: "",
    to: "",
  });

  const { data: candidates = [], isLoading, refetch } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = candidates.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(candidates.length / recordsPerPage);

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
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.includes("T") ? dateStr.split("T")[0] : dateStr.split("-").reverse().join("-");
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
        from: formatDateForInput(candidate.from || ""),
        to: formatDateForInput(candidate.to || ""),
        resume: null,
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
        from: "",
        to: "",
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
    const requiredFields = [
      "candidateName",
      "vacancy",
      "email",
      "dateOfApplication",
      "status",
      "contactNumber",
      "jobTitle",
      "hiringManager",
      "methodOfApplication",
      "from",
      "to",
    ];
    const missingFields = requiredFields.filter((field) => !newCandidate[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`);
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
    doc.setTextColor(33, 150, 243); // Blue color
    doc.text("Candidate Details", 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Name: ${candidate.candidateName}`, 20, 40);
    doc.text(`Job Title: ${candidate.jobTitle}`, 20, 50);
    doc.text(`Vacancy: ${candidate.vacancy}`, 20, 60);
    doc.text(`Hiring Manager: ${candidate.hiringManager}`, 20, 70);
    doc.text(`Application Date: ${formatDateForDisplay(candidate.dateOfApplication.split("T")[0])}`, 20, 80);
    doc.text(`Status: ${candidate.status}`, 20, 90);
    doc.text(`Email: ${candidate.email}`, 20, 100);
    doc.text(`Contact Number: ${candidate.contactNumber}`, 20, 110);
    doc.text(`Method of Application: ${candidate.methodOfApplication}`, 20, 120);
    doc.text(`Keywords: ${candidate.keywords || "N/A"}`, 20, 130);
    doc.text(`Notes: ${candidate.notes || "N/A"}`, 20, 140);

    doc.save(`${candidate.candidateName}_Details.pdf`);
  };

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
        {/* Tabs */}
        <div className="mb-8 bg-white rounded-xl shadow-lg">
          <nav className="flex space-x-2 p-4">
            {["Candidates", "Vacancy"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-blue-100"
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
          className="bg-white rounded-xl shadow-lg p-8"
        >
          {activeTab === "Candidates" ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Candidate Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal()}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Add Candidate
                </motion.button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <select
                    value={selectedJobTitle}
                    onChange={(e) => setSelectedJobTitle(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  >
                    <option value="">All</option>
                    <option value="Software Development">Software Development</option>
                    <option value="QA">Senior QA Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy</label>
                  <select
                    value={selectedVacancy}
                    onChange={(e) => setSelectedVacancy(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  >
                    <option value="">All</option>
                    <option value="senior Software developer">Senior Software Developer</option>
                    <option value="senior-qa-lead">Senior QA Lead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager</label>
                  <select
                    value={selectedHiringManager}
                    onChange={(e) => setSelectedHiringManager(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                  >
                    <option value="">All</option>
                    <option value="HR">HR</option>
                    <option value="manager2">Manager 2</option>
                  </select>
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
                    <option value="rejected">Rejected</option>
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
                    {currentRecords.map((item) => (
                      <motion.tr
                        key={item.id}
                        whileHover={{ backgroundColor: "#F9FAFB" }}
                        className="transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vacancy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.candidateName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.hiringManager}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateForDisplay(item.dateOfApplication.split("T")[0])}
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
                            <Eye className="h-5 w-5" />
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
                    Showing {indexOfFirstRecord + 1} - {Math.min(indexOfLastRecord, candidates.length)} of {candidates.length}
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
            </>
          ) : (
            <Vacancy />
          )}
        </motion.div>

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
                    <select
                      value={newCandidate.jobTitle}
                      onChange={(e) => setNewCandidate({ ...newCandidate, jobTitle: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    >
                      <option value="">Select</option>
                      <option value="Software Development">Software Development</option>
                      <option value="QA">Senior QA Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy *</label>
                    <select
                      value={newCandidate.vacancy}
                      onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    >
                      <option value="">Select</option>
                      <option value="senior Software developer">Senior Software Developer</option>
                      <option value="senior-qa-lead">Senior QA Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager *</label>
                    <select
                      value={newCandidate.hiringManager}
                      onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    >
                      <option value="">Select</option>
                      <option value="HR">HR</option>
                      <option value="manager2">Manager 2</option>
                    </select>
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
                      <option value="rejected">Rejected</option>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
                    <input
                      type="date"
                      value={newCandidate.from}
                      onChange={(e) => setNewCandidate({ ...newCandidate, from: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
                    <input
                      type="date"
                      value={newCandidate.to}
                      onChange={(e) => setNewCandidate({ ...newCandidate, to: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Method of Application *</label>
                  <select
                    value={newCandidate.methodOfApplication}
                    onChange={(e) => setNewCandidate({ ...newCandidate, methodOfApplication: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm"
                    required
                  >
                    <option value="">Select</option>
                    <option value="Online">Online</option>
                    <option value="referral">Referral</option>
                  </select>
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