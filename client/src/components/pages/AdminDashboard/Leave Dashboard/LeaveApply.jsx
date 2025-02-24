import React, { useState, useEffect } from "react";
import { ChevronDown, HelpCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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

  const { data: leaveRequests, isLoading, refetch } = useGetAllLeaveRequestsQuery();
  const [createLeaveRequest, { isLoading: isCreateLoading, error: createError }] =
    useCreateLeaveRequestMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData } = useGetEmployeeQuery(id);
  const employeeId = orgEmpData?.data.employee.id || 10;

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
      console.log('Leave request created successfully:', result);
      toast.success('Leave request submitted successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored", // Enhanced styling
        className: 'bg-green-500 text-white', // Tailwind-like styling
      });
      resetForm();
      refetch();
    } catch (error) {
      console.error('Failed to create leave request:', error);
      toast.error('Failed to submit leave request. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored", // Enhanced styling
        className: 'bg-red-500 text-white', // Tailwind-like styling
      });
    }
  };

  const resetForm = () => {
    setSelectedLeaveType("");
    setFromDate(null);
    setToDate(null);
    setComments("");
  };

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
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 tracking-tight">
              Request Time Off
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      className="w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-white shadow-sm appearance-none"
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
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={fromDate}
                    onChange={(date) => setFromDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                    placeholderText="Select start date"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Balance
                  </label>
                  <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-center shadow-inner">
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
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    selected={toDate}
                    onChange={(date) => setToDate(date)}
                    dateFormat="MM/dd/yyyy"
                    className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm"
                    placeholderText="Select end date"
                    minDate={fromDate}
                  />
                </div>
              </div>
            </div>

            {fromDate && toDate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="mt-6 p-4 rounded-lg bg-indigo-50 text-indigo-700 font-medium shadow-sm"
              >
                Duration: {calculateDuration()} day(s)
              </motion.div>
            )}

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-300 text-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 shadow-sm resize-none"
                rows="4"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add any details or comments..."
              />
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-end gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white border-2 border-indigo-500 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-300 shadow-md font-semibold"
                onClick={resetForm}
              >
                Clear Form
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isCreateLoading || !selectedLeaveType || !fromDate || !toDate}
              >
                {isCreateLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Submit Request"
                )}
              </motion.button>
            </div>

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className="mt-16" // Ensures it’s not hidden under the nav
      />
      
      <nav className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-3 py-4">
            {["apply", "myLeave", "leaveList", "assignLeave"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : "text-indigo-600 hover:bg-indigo-50 border border-indigo-200"
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="text-center text-gray-600 text-lg animate-pulse">
            Loading your leave information...
          </div>
        ) : (
          renderContent()
        )}
      </main>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelpModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg flex items-center justify-center hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
      >
        <HelpCircle className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Quick Help Guide
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowHelpModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
              <div className="space-y-4 text-gray-600">
                <p className="text-sm">Here's how to request your leave:</p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Select your leave type</li>
                  <li>Pick start and end dates</li>
                  <li>Add optional comments</li>
                  <li>Submit your request</li>
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