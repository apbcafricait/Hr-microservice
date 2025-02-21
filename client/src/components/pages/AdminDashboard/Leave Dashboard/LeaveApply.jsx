import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AssignLeave from "../../../pages/AdminDashboard/Leave Dashboard/AssignLeave";
import LeaveList from "./LeaveList";
import MyLeave from "../../AdminDashboard/Leave Dashboard/MyLeave";
import {
  useGetAllLeaveRequestsQuery,
  useCreateLeaveRequestMutation,
} from "../../../../slices/leaveApiSlice";
import { useSelector } from "react-redux";
import { useGetEmployeeQuery } from "../../../../slices/employeeSlice";

const LeaveApplication = () => {
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [comments, setComments] = useState("");
  const [activeTab, setActiveTab] = useState("apply");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);

  // RTK Query hooks
  const { data: leaveRequests, isLoading, refetch } = useGetAllLeaveRequestsQuery();
  const [createLeaveRequest, { isLoading: isCreateLoading, error: createError }] =
    useCreateLeaveRequestMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const employeeId = orgEmpData?.data.employee.id || 10;

  // Fetch leave types (dummy data for now)
  useEffect(() => {
    const dummyLeaveTypes = [
      { id: 1, type: "Annual Leave", balance: 14 },
      { id: 2, type: "Sick Leave", balance: 7 },
      { id: 3, type: "Personal Leave", balance: 5 },
    ];
    setLeaveTypes(dummyLeaveTypes);
  }, []);

  const calculateDuration = () => {
    if (fromDate && toDate) {
      const diffTime = Math.abs(toDate - fromDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = async () => {
    try {
      const newLeaveRequest = {
        employeeId,
        type: selectedLeaveType,
        startDate: fromDate?.toISOString(),
        endDate: toDate?.toISOString(),
        comments,
        duration: calculateDuration(),
      };
      const result = await createLeaveRequest(newLeaveRequest).unwrap();
      alert("Leave request created successfully!");
      resetForm();
      refetch();
    } catch (error) {
      console.error("Failed to create leave request:", error);
      alert("Failed to create leave request. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedLeaveType("");
    setFromDate(null);
    setToDate(null);
    setComments("");
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "myLeave":
        return <MyLeave />;
      case "leaveList":
        return <LeaveList />;
      case "assignLeave":
        return <AssignLeave />;
      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md p-6 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-8">
              Apply Leave
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="block w-full rounded-md border border-gray-300 py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white appearance-none"
                      value={selectedLeaveType}
                      onChange={(e) => setSelectedLeaveType(e.target.value)}
                    >
                      <option value="">Select Leave Type</option>
                      {leaveTypes.map((leave) => (
                        <option key={leave.id} value={leave.type}>
                          {leave.type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-3 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholderText="Select start date"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Balance
                  </label>
                  <div className="p-4 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <span className="text-xl font-semibold text-indigo-600">
                      {selectedLeaveType
                        ? leaveTypes.find((leave) => leave.type === selectedLeaveType)?.balance
                        : "0"}{" "}
                      Day(s)
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-3 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholderText="Select end date"
                    minDate={fromDate}
                  />
                </div>
              </div>
            </div>

            {/* Duration Display */}
            {fromDate && toDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 rounded-lg bg-indigo-50 text-indigo-700 font-medium"
              >
                Duration: {calculateDuration()} day(s)
              </motion.div>
            )}

            {/* Comments */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments
              </label>
              <textarea
                className="w-full p-3 rounded-md border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Enter any additional comments..."
              />
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-200"
                onClick={resetForm}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
                onClick={handleSubmit}
                disabled={isCreateLoading || !selectedLeaveType || !fromDate || !toDate}
              >
                {isCreateLoading ? "Submitting..." : "Submit Application"}
              </motion.button>
            </div>

            {/* Error Message */}
            {createError && (
              <div className="mt-4 text-red-500 text-sm">
                Error: {createError?.data?.message || "Failed to submit application."}
              </div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
 
    

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 py-4">
            {["apply", "myLeave", "leaveList", "assignLeave"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeTab === tab
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, " $1")}
              </motion.button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : (
          renderContent()
        )}
      </main>

      {/* Help Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-indigo-600 text-white shadow-lg flex items-center justify-center hover:bg-indigo-700 transition-colors duration-200"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      {/* Help Modal */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full shadow-lg"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  Help & Information
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelpModal(false)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>Need help with your leave application? Here's what to do:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Select your leave type from the dropdown.</li>
                  <li>Choose your start and end dates.</li>
                  <li>Add any relevant comments.</li>
                  <li>Click "Submit Application" to apply.</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LeaveApplication;