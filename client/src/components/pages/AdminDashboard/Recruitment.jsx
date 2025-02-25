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
    from: "", // Added to match JSON
    to: "",   // Added to match JSON
  });

  const { data: candidates = [], isLoading, refetch, error: queryError } = useGetAllCandidatesQuery();
  const [createCandidate, { isLoading: isCreating, error: createError }] = useCreateCandidateMutation();
  const [updateCandidate, { isLoading: isUpdating, error: updateError }] = useUpdateCandidateMutation();
  const [deleteCandidate, { isLoading: isDeleting, error: deleteError }] = useDeleteCandidateMutation();

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

  const formatDateForInput = (dateStr) => {
    // Convert DD-MM-YYYY or ISO (YYYY-MM-DD) to YYYY-MM-DD for input[type="date"]
    if (!dateStr) return "";
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0]; // ISO format
    }
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`; // Convert DD-MM-YYYY to YYYY-MM-DD
  };

  const formatDateForDisplay = (dateStr) => {
    // Convert YYYY-MM-DD to DD-MM-YYYY for display
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const openModal = (candidate = null) => {
    if (candidate) {
      setIsEditMode(true);
      setEditCandidateId(candidate.id);
      setNewCandidate({
        jobTitle: candidate.jobTitle || "",
        vacancy: candidate.vacancy || "",
        candidateName: candidate.candidateName || "",
        hiringManager: candidate.hiringManager || "",
        dateOfApplication: formatDateForInput(candidate.dateOfApplication),
        status: candidate.status || "",
        email: candidate.email || "",
        contactNumber: candidate.contactNumber || "",
        resume: null, // Not editable
        keywords: candidate.keywords || "",
        methodOfApplication: candidate.methodOfApplication || "",
        notes: candidate.notes || "",
        from: formatDateForInput(candidate.from || ""),
        to: formatDateForInput(candidate.to || ""),
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
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return false;
    }
    return true;
  };

  const handleCandidateSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("jobTitle", newCandidate.jobTitle);
    formData.append("vacancy", newCandidate.vacancy);
    formData.append("candidateName", newCandidate.candidateName);
    formData.append("hiringManager", newCandidate.hiringManager);
    formData.append("dateOfApplication", formatDateForDisplay(newCandidate.dateOfApplication)); // DD-MM-YYYY
    formData.append("status", newCandidate.status);
    formData.append("email", newCandidate.email);
    formData.append("contactNumber", newCandidate.contactNumber);
    if (newCandidate.resume) formData.append("resume", newCandidate.resume);
    formData.append("keywords", newCandidate.keywords);
    formData.append("methodOfApplication", newCandidate.methodOfApplication);
    formData.append("notes", newCandidate.notes);
    formData.append("from", formatDateForDisplay(newCandidate.from)); // DD-MM-YYYY
    formData.append("to", formatDateForDisplay(newCandidate.to));     // DD-MM-YYYY

    try {
      if (isEditMode) {
        console.log(formData, "data being sent")
      const response =  await updateCandidate({ id: editCandidateId, candidateData: newCandidate }).unwrap();
      console.log(response, "response when updating")  
      toast.success("Candidate updated successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      } else {
        
      const res =  await createCandidate(newCandidate).unwrap();
      console.log(res, "response when creating")
        toast.success("Candidate created successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
      refetch();
      closeModal();
    } catch (err) {
      const errorMessage = err?.data?.message || "Failed to save candidate. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const handleDeleteCandidate = async (id) => {
    if (window.confirm("Are you sure you want to delete this candidate?")) {
      try {
        await deleteCandidate(id).unwrap();
        toast.success("Candidate deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
        refetch();
      } catch (err) {
        const errorMessage = err?.data?.message || "Failed to delete candidate. Please try again.";
        toast.error(errorMessage, {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    }
  };

  const handleDownloadResume = (candidate) => {
    const resumeUrl = candidate.resumeUrl || "https://example.com/resume.pdf"; // Replace with actual logic
    window.open(resumeUrl, "_blank");
  };

  useEffect(() => {
    if (queryError || createError || updateError || deleteError) {
      const errorMessage =
        (queryError || createError || updateError || deleteError)?.data?.message ||
        "An error occurred. Please try again.";
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  }, [queryError, createError, updateError, deleteError]);

  if (isLoading) return <div className="text-center text-gray-500 p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 shadow-md mb-6 rounded-lg">
          <div className="flex items-center justify-start space-x-4 px-4 py-3">
            {["Candidates", "Vacancy"].map((tab) => (
              <motion.button
                key={tab}
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab ? "bg-blue-600 text-white shadow-inner" : "text-gray-700 hover:bg-blue-50"
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
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-lg shadow-xl p-4 sm:p-6 lg:p-8"
        >
          {activeTab === "Candidates" ? (
            <>
              {/* Filter Section */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 sm:mb-0">Candidate Management</h2>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#1E40AF" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="inline-flex items-center px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm font-medium shadow-md"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Candidate
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title</label>
                    <div className="relative">
                      <select
                        id="jobTitle"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        value={selectedJobTitle}
                        onChange={(e) => setSelectedJobTitle(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="Software Development">Software Development</option>
                        <option value="QA">Senior QA Lead</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="vacancy" className="block text-sm font-medium text-gray-700">Vacancy</label>
                    <div className="relative">
                      <select
                        id="vacancy"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        value={selectedVacancy}
                        onChange={(e) => setSelectedVacancy(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="senior Software developer">Senior Software Developer</option>
                        <option value="senior-qa-lead">Senior QA Lead</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="hiringManager" className="block text-sm font-medium text-gray-700">Hiring Manager</label>
                    <div className="relative">
                      <select
                        id="hiringManager"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        value={selectedHiringManager}
                        onChange={(e) => setSelectedHiringManager(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="HR">HR</option>
                        <option value="manager2">Manager 2</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
                    <div className="relative">
                      <select
                        id="status"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="Active">Active</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="candidateName" className="block text-sm font-medium text-gray-700">Candidate Name</label>
                    <input
                      id="candidateName"
                      type="text"
                      placeholder="Enter candidate name"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white shadow-sm"
                      value={candidateName}
                      onChange={(e) => setCandidateName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="keywords" className="block text-sm font-medium text-gray-700">Keywords</label>
                    <input
                      id="keywords"
                      type="text"
                      placeholder="e.g., skills, experience"
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white shadow-sm"
                      value={keywords}
                      onChange={(e) => setKeywords(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="method" className="block text-sm font-medium text-gray-700">Method of Application</label>
                    <div className="relative">
                      <select
                        id="method"
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        value={methodOfApplication}
                        onChange={(e) => setMethodOfApplication(e.target.value)}
                      >
                        <option value="">-- Select --</option>
                        <option value="Online">Online</option>
                        <option value="referral">Referral</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Date of Application</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <input
                        type="date"
                        className="w-full sm:w-48 rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white shadow-sm"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                      />
                      <span className="text-gray-500 hidden sm:inline">to</span>
                      <input
                        type="date"
                        className="w-full sm:w-48 rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm bg-white shadow-sm"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#E5E7EB" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 flex items-center gap-2 text-sm font-medium shadow-sm"
                    onClick={handleReset}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#1E40AF" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm font-medium shadow-md"
                    onClick={handleSearch}
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </motion.button>
                </div>
              </div>

              {/* Table Section */}
              <div className="mt-8 overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="w-12 p-4">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </th>
                      {["Vacancy", "Candidate", "Hiring Manager", "Date of Application", "Status", "Actions"].map(
                        (header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((item) => (
                      <motion.tr
                        key={item.id}
                        whileHover={{ backgroundColor: "#F9FAFB", scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                      >
                        <td className="w-12 p-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.vacancy}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.candidateName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.hiringManager}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateForDisplay(item.dateOfApplication.split("T")[0])}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                              item.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex gap-3">
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#2563EB" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(item)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#DC2626" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteCandidate(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, color: "#4A5568" }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDownloadResume(item)}
                              className="text-gray-600 hover:text-gray-800"
                            >
                              <Download className="h-4 w-4" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <Vacancy />
          )}
        </motion.div>

        {/* Modal for Adding/Editing Candidate */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-2 sm:px-0"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-white rounded-lg shadow-2xl p-4 sm:p-6 w-full sm:max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 p-2"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-lg font-bold text-gray-900 mb-4 sm:mb-6 border-b border-gray-200 pb-2">
                {isEditMode ? "Edit Candidate" : "Add New Candidate"}
              </h3>
              <form onSubmit={handleCandidateSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label htmlFor="candidateNameModal" className="block text-sm font-medium text-gray-700">
                      Full Name *
                    </label>
                    <input
                      id="candidateNameModal"
                      type="text"
                      value={newCandidate.candidateName}
                      onChange={(e) => setNewCandidate({ ...newCandidate, candidateName: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      placeholder="Enter candidate's full name"
                      required
                    />
                  </div>

                  {/* Job Title */}
                  <div className="space-y-2">
                    <label htmlFor="jobTitleModal" className="block text-sm font-medium text-gray-700">
                      Job Title *
                    </label>
                    <div className="relative">
                      <select
                        id="jobTitleModal"
                        value={newCandidate.jobTitle}
                        onChange={(e) => setNewCandidate({ ...newCandidate, jobTitle: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        required
                      >
                        <option value="">-- Select Job Title --</option>
                        <option value="Software Development">Software Development</option>
                        <option value="QA">Senior QA Lead</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Vacancy */}
                  <div className="space-y-2">
                    <label htmlFor="vacancyModal" className="block text-sm font-medium text-gray-700">
                      Vacancy *
                    </label>
                    <div className="relative">
                      <select
                        id="vacancyModal"
                        value={newCandidate.vacancy}
                        onChange={(e) => setNewCandidate({ ...newCandidate, vacancy: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        required
                      >
                        <option value="">-- Select Vacancy --</option>
                        <option value="senior Software developer">Senior Software Developer</option>
                        <option value="senior-qa-lead">Senior QA Lead</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Hiring Manager */}
                  <div className="space-y-2">
                    <label htmlFor="hiringManagerModal" className="block text-sm font-medium text-gray-700">
                      Hiring Manager *
                    </label>
                    <div className="relative">
                      <select
                        id="hiringManagerModal"
                        value={newCandidate.hiringManager}
                        onChange={(e) => setNewCandidate({ ...newCandidate, hiringManager: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        required
                      >
                        <option value="">-- Select Manager --</option>
                        <option value="HR">HR</option>
                        <option value="manager2">Manager 2</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Application Date */}
                  <div className="space-y-2">
                    <label htmlFor="applicationDateModal" className="block text-sm font-medium text-gray-700">
                      Application Date *
                    </label>
                    <input
                      id="applicationDateModal"
                      type="date"
                      value={newCandidate.dateOfApplication}
                      onChange={(e) => setNewCandidate({ ...newCandidate, dateOfApplication: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label htmlFor="statusModal" className="block text-sm font-medium text-gray-700">
                      Status *
                    </label>
                    <div className="relative">
                      <select
                        id="statusModal"
                        value={newCandidate.status}
                        onChange={(e) => setNewCandidate({ ...newCandidate, status: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        required
                      >
                        <option value="">-- Select Status --</option>
                        <option value="Active">Active</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="emailModal" className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      id="emailModal"
                      type="email"
                      value={newCandidate.email}
                      onChange={(e) => setNewCandidate({ ...newCandidate, email: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      placeholder="e.g., example@email.com"
                      required
                    />
                  </div>

                  {/* Contact Number */}
                  <div className="space-y-2">
                    <label htmlFor="contactNumberModal" className="block text-sm font-medium text-gray-700">
                      Contact Number *
                    </label>
                    <input
                      id="contactNumberModal"
                      type="tel"
                      value={newCandidate.contactNumber}
                      onChange={(e) => setNewCandidate({ ...newCandidate, contactNumber: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      placeholder="e.g., 123-456-7890"
                      required
                    />
                  </div>

                  {/* From Date */}
                  <div className="space-y-2">
                    <label htmlFor="fromModal" className="block text-sm font-medium text-gray-700">
                      From Date *
                    </label>
                    <input
                      id="fromModal"
                      type="date"
                      value={newCandidate.from}
                      onChange={(e) => setNewCandidate({ ...newCandidate, from: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      required
                    />
                  </div>

                  {/* To Date */}
                  <div className="space-y-2">
                    <label htmlFor="toModal" className="block text-sm font-medium text-gray-700">
                      To Date *
                    </label>
                    <input
                      id="toModal"
                      type="date"
                      value={newCandidate.to}
                      onChange={(e) => setNewCandidate({ ...newCandidate, to: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Method of Application */}
                  <div className="space-y-2">
                    <label htmlFor="methodOfApplicationModal" className="block text-sm font-medium text-gray-700">
                      Method of Application *
                    </label>
                    <div className="relative">
                      <select
                        id="methodOfApplicationModal"
                        value={newCandidate.methodOfApplication}
                        onChange={(e) => setNewCandidate({ ...newCandidate, methodOfApplication: e.target.value })}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-3 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 appearance-none text-sm bg-white shadow-sm"
                        required
                      >
                        <option value="">-- Select Method --</option>
                        <option value="Online">Online</option>
                        <option value="referral">Referral</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="space-y-2">
                    <label htmlFor="keywordsModal" className="block text-sm font-medium text-gray-700">
                      Keywords
                    </label>
                    <input
                      id="keywordsModal"
                      type="text"
                      value={newCandidate.keywords}
                      onChange={(e) => setNewCandidate({ ...newCandidate, keywords: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      placeholder="e.g., Software development, Coding"
                    />
                  </div>

                  {/* Resume (Add Mode Only) */}
                  {!isEditMode && (
                    <div className="space-y-2">
                      <label htmlFor="resumeModal" className="block text-sm font-medium text-gray-700">
                        Resume
                      </label>
                      <input
                        id="resumeModal"
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        onChange={(e) => setNewCandidate({ ...newCandidate, resume: e.target.files[0] })}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      />
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, TXT (max 1MB)</p>
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-2">
                    <label htmlFor="notesModal" className="block text-sm font-medium text-gray-700">
                      Notes
                    </label>
                    <textarea
                      id="notesModal"
                      value={newCandidate.notes}
                      onChange={(e) => setNewCandidate({ ...newCandidate, notes: e.target.value })}
                      className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-all duration-200 text-sm bg-white shadow-sm"
                      placeholder="Add any additional notes..."
                      rows="4"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-end gap-4 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#E5E7EB" }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 font-medium text-sm shadow-sm w-full sm:w-auto"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05, backgroundColor: "#1E40AF" }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 font-medium text-sm shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed w-full sm:w-auto"
                  >
                    {isCreating || isUpdating ? "Saving..." : isEditMode ? "Update Candidate" : "Save Candidate"}
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