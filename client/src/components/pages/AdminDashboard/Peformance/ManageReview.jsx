import React, { useState } from "react";
import {
  ChevronDown,
  Calendar,
  HelpCircle,
  Plus,
  ChevronUp,
  X,
  Eye,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EmployeeTracker from "../Peformance/EmployeeTracker";
import {
  useGetAllPerformanceReviewsQuery,
  useCreatePerformanceReviewMutation,
} from "../../../../slices/performanceApiSlice"; // Update this path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PerformanceReviewPage = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedJob, setSelectedJob] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedInclude, setSelectedInclude] = useState("Current Employees Only");
  const [activeTab, setActiveTab] = useState("manageReviews");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeeName, setEmployeeName] = useState("");
  const [reviewerName, setReviewerName] = useState("");

  const [newReview, setNewReview] = useState({
    employeeId: "",
    jobTitle: "",
    reviewStatus: "pending",
    reviewer: "",
    fromDate: "",
    toDate: "",
    reviewMessage: "",
  });

  const {
    data: reviewsData,
    isLoading,
    error,
    refetch,
  } = useGetAllPerformanceReviewsQuery();
  console.log(reviewsData, "reviewes data")

  const [createPerformanceReview, { isLoading: isCreating }] = useCreatePerformanceReviewMutation();

  // Ensure reviews is always an array
  const reviews = Array.isArray(reviewsData) ? reviewsData : [];
  console.log(reviews, "reviews")

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleReset = () => {
    setSelectedJob("");
    setSelectedStatus("");
    setSelectedInclude("Current Employees Only");
    setEmployeeName("");
    setReviewerName("");
  };

  const handleSearch = () => {
    console.log("Search triggered with filters:", {
      selectedJob,
      selectedStatus,
      selectedInclude,
      employeeName,
      reviewerName,
    });
  };

  const openModal = () => {
    setNewReview({
      employeeId: "",
      jobTitle: "",
      reviewStatus: "pending",
      reviewer: "",
      fromDate: "",
      toDate: "",
      reviewMessage: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await createPerformanceReview(newReview).unwrap();
      toast.success("Review created successfully!", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      refetch();
      closeModal();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create review", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
        <div className="max-w-7xl mx-auto text-center text-red-600">
          Error loading reviews: {error?.data?.message || "Unknown error"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 bg-white rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center justify-between border-b border-gray-200"
        >
          <div className="flex flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-0">
            {[
              { id: "manageReviews", label: "Manage Reviews" },
              { id: "employeeTrackers", label: "Employee Trackers" },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-inner"
                    : "text-gray-700 bg-gray-100 hover:bg-indigo-50"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cursor-pointer"
          >
            <HelpCircle className="h-5 w-5 text-indigo-500 hover:text-indigo-700" />
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {activeTab === "manageReviews" ? (
            <motion.div
              key="manageReviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl overflow-hidden"
            >
              {/* Header */}
              <div
                className="p-4 md:p-6 flex items-center justify-between bg-indigo-50 cursor-pointer border-b border-gray-200"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <h2 className="text-xl md:text-2xl font-bold text-indigo-800">
                  Manage Performance Reviews
                </h2>
                {isExpanded ? (
                  <ChevronUp className="h-6 w-6 text-indigo-500" />
                ) : (
                  <ChevronDown className="h-6 w-6 text-indigo-500" />
                )}
              </div>

              {/* Filter Form */}
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 md:p-6 bg-white"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Employee Name
                      </label>
                      <input
                        type="text"
                        value={employeeName}
                        onChange={(e) => setEmployeeName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                        placeholder="Search employees..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                      </label>
                      <div className="relative">
                        <select
                          value={selectedJob}
                          onChange={(e) => setSelectedJob(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                        >
                          <option value="">-- Select --</option>
                          <option value="Software Developer">Software Developer</option>
                          <option value="Designer">Designer</option>
                          <option value="Manager">Manager</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Review Status
                      </label>
                      <div className="relative">
                        <select
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                        >
                          <option value="">-- Select --</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="in-progress">In Progress</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Include
                      </label>
                      <div className="relative">
                        <select
                          value={selectedInclude}
                          onChange={(e) => setSelectedInclude(e.target.value)}
                          className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                        >
                          <option value="Current Employees Only">Current Employees Only</option>
                          <option value="All Employees">All Employees</option>
                          <option value="Former Employees">Former Employees</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Reviewer
                      </label>
                      <input
                        type="text"
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                        placeholder="Search reviewers..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                          onChange={(e) => setNewReview({ ...newReview, fromDate: e.target.value })}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                          onChange={(e) => setNewReview({ ...newReview, toDate: e.target.value })}
                        />
                        <Calendar className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row justify-end gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleReset}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors duration-200 shadow-sm"
                    >
                      Reset
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSearch}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200 shadow-sm"
                    >
                      Search
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Add Button and Table */}
              <div className="p-4 md:p-6 bg-gray-50">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openModal}
                  className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors duration-200 shadow-md"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Review</span>
                </motion.button>

                <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-indigo-50">
                      <tr>
                        <th className="w-8 p-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        {[
                          "Employee ID",
                          "Job Title",
                          "Review Period",
                          "Reviewer",
                          "Review Status",
                          "Actions",
                        ].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-xs font-medium text-indigo-800 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {isLoading ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                            Loading...
                          </td>
                        </tr>
                      ) : reviewsData?.data?.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                            No Records Found
                          </td>
                        </tr>
                      ) : (
                        reviewsData?.data.map((review) => (
                          <motion.tr
                            key={review.employeeId}
                            whileHover={{ backgroundColor: "#F9FAFB" }}
                            transition={{ duration: 0.2 }}
                          >
                            <td className="w-8 p-4">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">{review.employeeId}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">{review.jobTitle}</td>
                            <td className="px-4 py-4 text-sm text-gray-700">
                              {formatDateForDisplay(review.fromDate)} - {formatDateForDisplay(review.toDate)}
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-700">{review.reviewer}</td>
                            <td className="px-4 py-4 text-sm">
                              <span
                                className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                                  review.reviewStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : review.reviewStatus === "completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {review.reviewStatus}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex gap-3">
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-indigo-600 hover:text-indigo-800"
                                >
                                  <Eye className="h-4 w-4" />
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </motion.button>
                              </div>
                            </td>
                          </motion.tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="employeeTrackers"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl p-4 md:p-6"
            >
              <h2 className="text-xl md:text-2xl font-bold text-indigo-800 mb-6">
                Employee Trackers
              </h2>
              <EmployeeTracker />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-indigo-800">Add New Performance Review</h3>
                <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employee ID *
                  </label>
                  <input
                    type="text"
                    value={newReview.employeeId}
                    onChange={(e) => setNewReview({ ...newReview, employeeId: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={newReview.jobTitle}
                    onChange={(e) => setNewReview({ ...newReview, jobTitle: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Status *
                  </label>
                  <select
                    value={newReview.reviewStatus}
                    onChange={(e) => setNewReview({ ...newReview, reviewStatus: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reviewer *
                  </label>
                  <input
                    type="text"
                    value={newReview.reviewer}
                    onChange={(e) => setNewReview({ ...newReview, reviewer: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={newReview.fromDate}
                    onChange={(e) => setNewReview({ ...newReview, fromDate: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Date *
                  </label>
                  <input
                    type="date"
                    value={newReview.toDate}
                    onChange={(e) => setNewReview({ ...newReview, toDate: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Message
                  </label>
                  <textarea
                    value={newReview.reviewMessage}
                    onChange={(e) => setNewReview({ ...newReview, reviewMessage: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                    rows="4"
                    placeholder="Enter review comments..."
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 shadow-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isCreating}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 shadow-sm"
                  >
                    {isCreating ? "Saving..." : "Save Review"}
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

export default PerformanceReviewPage;