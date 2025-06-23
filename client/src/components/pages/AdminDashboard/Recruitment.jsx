import React, { useState, useEffect } from "react";
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
  const [hiringManagerSearch, setHiringManagerSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  const [newCandidate, setNewCandidate] = useState({
    vacancy: "",
    candidateName: "",
    hiringManager: "",
    dateOfApplication: "",
    status: "",
    email: "",
    contactNumber: "",
    resume: null,
    from: "",
    to: "",
  });

  const { data: candidates = [], isLoading, refetch } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  // Filter logic
  useEffect(() => {
    const filtered = candidates.filter((candidate) => {
      const matchesVacancy = vacancySearch
        ? candidate.vacancy.toLowerCase().includes(vacancySearch.toLowerCase())
        : true;
      const matchesHiringManager = hiringManagerSearch
        ? candidate.hiringManager.toLowerCase().includes(hiringManagerSearch.toLowerCase())
        : true;
      const matchesStatus = selectedStatus ? candidate.status === selectedStatus : true;
      const matchesCandidateName = candidateName
        ? candidate.candidateName.toLowerCase().includes(candidateName.toLowerCase())
        : true;
      const matchesDateRange =
        dateFrom && dateTo
          ? new Date(candidate.dateOfApplication) >= new Date(dateFrom) &&
            new Date(candidate.dateOfApplication) <= new Date(dateTo)
          : true;

      return (
        matchesVacancy &&
        matchesHiringManager &&
        matchesStatus &&
        matchesCandidateName &&
        matchesDateRange
      );
    });
    setFilteredCandidates(filtered);
    setCurrentPage(1);
  }, [
    candidates,
    vacancySearch,
    hiringManagerSearch,
    selectedStatus,
    candidateName,
    dateFrom,
    dateTo,
  ])
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCandidates.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCandidates.length / recordsPerPage);

  const handleReset = () => {
    setVacancySearch("");
    setHiringManagerSearch("");
    setSelectedStatus("");
    setDateFrom("");
    setDateTo("");
    setCandidateName("");
    setCurrentPage(1);
    toast.info("Filters reset!", { theme: "light" });
  };

  const handleSearch = () => {
    setCurrentPage(1);
    toast.info("Search applied!", { theme: "light" });
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
        vacancy: "",
        candidateName: "",
        hiringManager: "",
        dateOfApplication: "",
        status: "",
        email: "",
        contactNumber: "",
        resume: null,
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
      "hiringManager",
      "dateOfApplication",
      "status",
      "email",
      "contactNumber",
      "from",
      "to",
    ];
    const missingFields = requiredFields.filter((field) => !newCandidate[field]);
    if (missingFields.length > 0) {
      toast.error(`Please fill in: ${missingFields.join(", ")}`, { theme: "light" });
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
        toast.success("Candidate updated successfully!", { theme: "light" });
      } else {
        await createCandidate(newCandidate).unwrap();
        toast.success("Candidate created successfully!", { theme: "light" });
      }
      refetch();
      setCurrentPage(1);
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save candidate.", { theme: "light" });
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id).unwrap();
        toast.success("Candidate deleted successfully!", { theme: "light" });
        refetch();
        if (currentRecords.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete candidate.", { theme: "light" });
      }
    }
  };

  const handleDownloadCandidateDetails = (candidate) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(55, 65, 81);
    doc.text("Candidate Details", 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${candidate.candidateName}`, 20, 40);
    doc.text(`Vacancy: ${candidate.vacancy}`, 20, 50);
    doc.text(`Hiring Manager: ${candidate.hiringManager}`, 20, 60);
    doc.text(`Application Date: ${formatDateForDisplay(candidate.dateOfApplication.split("T")[0])}`, 20, 70);
    doc.text(`Status: ${candidate.status}`, 20, 80);
    doc.text(`Email: ${candidate.email}`, 20, 90);
    doc.text(`Contact Number: ${candidate.contactNumber}`, 20, 100);
    doc.save(`${candidate.candidateName}_Details.pdf`);
    toast.success(`Downloaded details for ${candidate.candidateName}`, { theme: "light" });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      toast.info(`Navigated to page ${currentPage - 1}`, { theme: "light" });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      toast.info(`Navigated to page ${currentPage + 1}`, { theme: "light" });
    }
  };

  const handleRecordsPerPageChange = (e) => {
    const newRecordsPerPage = Number(e.target.value);
    setRecordsPerPage(newRecordsPerPage);
    setCurrentPage(1);
    toast.info(`Set ${newRecordsPerPage} records per page`, { theme: "light" });
  };

  if (isLoading) return <div className="text-center py-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tabs */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <nav className="flex flex-wrap gap-2 p-4">
            {["Candidates", "Vacancy"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex-1 sm:flex-none px-6 py-3 text-sm font-semibold rounded-lg transition-colors ${
                  activeTab === tab
                    ? "bg-indigo-800 text-white shadow-md"
                    : "text-gray-700 hover:bg-indigo-100"
                }`}
                onClick={() => {
                  setActiveTab(tab);
                  toast.info(`Switched to ${tab} tab`, { theme: "light" });
                }}
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
          className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
        >
          {activeTab === "Candidates" ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Candidate Management</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openModal()}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 transition-colors shadow-md text-sm sm:text-base"
                >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Add Candidate
                </motion.button>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy</label>
                  <input
                    value={vacancySearch}
                    onChange={(e) => setVacancySearch(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    placeholder="Search by vacancy..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager</label>
                  <input
                    value={hiringManagerSearch}
                    onChange={(e) => setHiringManagerSearch(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    placeholder="Search by manager..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
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
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    placeholder="Search by name..."
                  />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 mb-6 sm:mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm sm:text-base"
                >
                  <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Reset
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSearch}
                  className="flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
                >
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Search
                </motion.button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-indigo-50">
                    <tr>
                      {["Vacancy", "Candidate", "Manager", "Date", "Status", "Actions"].map((header) => (
                        <th
                          key={header}
                          className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentRecords.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                          No candidates found.
                        </td>
                      </tr>
                    ) : (
                      currentRecords.map((item) => (
                        <motion.tr
                          key={item.id}
                          whileHover={{ backgroundColor: "#F9FAFB" }}
                          className="transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">{item.vacancy}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.candidateName}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-700">{item.hiringManager}</td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDateForDisplay(item.dateOfApplication.split("T")[0])}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
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
                          <td className="px-4 sm:px-6 py-3 sm:py-4 whitespace-nowrap flex gap-2 sm:gap-4">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => openModal(item)}
                              className="text-indigo-600 hover:text-indigo-800"
                              title="View/Edit"
                            >
                              <Eye className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDeleteCandidate(item.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={() => handleDownloadCandidateDetails(item)}
                              className="text-teal-600 hover:text-teal-700"
                              title="Download PDF"
                            >
                              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                <div className="flex items-center gap-3">
                  <select
                    value={recordsPerPage}
                    onChange={handleRecordsPerPageChange}
                    className="p-2 border border-gray-200 rounded-lg bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-md text-sm"
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
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.button>
                  <span className="px-3 sm:px-4 py-2 text-sm text-gray-700 bg-white rounded-lg shadow-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800">
                  {isEditMode ? "Edit Candidate" : "Add Candidate"}
                </h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              <div onSubmit={handleCandidateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      value={newCandidate.candidateName}
                      onChange={(e) => setNewCandidate({ ...newCandidate, candidateName: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Vacancy *</label>
                    <input
                      value={newCandidate.vacancy}
                      onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Hiring Manager *</label>
                    <input
                      value={newCandidate.hiringManager}
                      onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Application Date *</label>
                    <input
                      type="date"
                      value={newCandidate.dateOfApplication}
                      onChange={(e) => setNewCandidate({ ...newCandidate, dateOfApplication: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                    <select
                      value={newCandidate.status}
                      onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
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
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
                    <input
                      type="tel"
                      value={newCandidate.contactNumber}
                      onChange={(e) => setNewCandidate({ ...newCandidate, contactNumber: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">From Date *</label>
                    <input
                      type="date"
                      value={newCandidate.from}
                      onChange={(e) => setNewCandidate({ ...newCandidate, from: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">To Date *</label>
                    <input
                      type="date"
                      value={newCandidate.to}
                      onChange={(e) => setNewCandidate({ ...newCandidate, to: e.target.value })}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                      required
                    />
                  </div>
                </div>
                {!isEditMode && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resume</label>
                    <input
                      type="file"
                      onChange={(e) => setNewCandidate({ ...newCandidate, resume: e.target.files[0] })}
                      className="w-full p-3 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm"
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 bg-white shadow-sm transition-all duration-200 hover:shadow-md text-sm sm:text-base"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCandidateSubmit}
                    disabled={isCreating || isUpdating}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-800 text-white rounded-lg hover:bg-indigo-900 disabled:bg-gray-400 shadow-md transition-all duration-200 hover:shadow-lg text-sm sm:text-base"
                  >
                    {isCreating || isUpdating ? "Saving..." : isEditMode ? "Update" : "Save"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        <ToastContainer position="top-right" autoClose={3000} theme="light" />
      </div>
    </div>
  );
};
export default Recruitment;