import React, { useState } from 'react';
import { Calendar, ChevronDown, X, Check, AlertCircle } from 'lucide-react';
import { Popover } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const AssignLeave = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    leaveType: '',
    fromDate: '',
    toDate: '',
    comments: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-indigo-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-indigo-900">Assign Leave</h1>
            <motion.button 
              whileHover={{ rotate: 90 }}
              className="text-gray-400 hover:text-indigo-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Employee Name */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-indigo-900">
                Employee Name<span className="text-red-500 ml-1">*</span>
              </label>
              <input
                type="text"
                placeholder="Start typing employee name..."
                value={formData.employeeName}
                onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
              />
            </div>

            {/* Leave Type and Balance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-900">
                  Leave Type<span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                  >
                    <option value="">Select Leave Type</option>
                    <option value="annual">Annual Leave</option>
                    <option value="sick">Sick Leave</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-3.5 w-5 h-5 text-indigo-400" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-indigo-900">
                  Leave Balance
                </label>
                <div className="px-4 py-3 border-2 border-indigo-100 rounded-lg bg-indigo-50 text-indigo-700 font-medium">
                  12.00 Day(s)
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Popover className="relative">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  From Date<span className="text-red-500 ml-1">*</span>
                </label>
                <Popover.Button className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-left flex justify-between items-center">
                  {formData.fromDate || 'Select date'}
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
                  <input
                    type="date"
                    value={formData.fromDate}
                    onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                    className="w-full"
                  />
                </Popover.Panel>
              </Popover>

              <Popover className="relative">
                <label className="block text-sm font-semibold text-indigo-900 mb-2">
                  To Date<span className="text-red-500 ml-1">*</span>
                </label>
                <Popover.Button className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200 text-left flex justify-between items-center">
                  {formData.toDate || 'Select date'}
                  <Calendar className="w-5 h-5 text-indigo-400" />
                </Popover.Button>
                <Popover.Panel className="absolute z-10 mt-2 bg-white rounded-lg shadow-lg p-4 border border-indigo-100">
                  <input
                    type="date"
                    value={formData.toDate}
                    onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                    className="w-full"
                  />
                </Popover.Panel>
              </Popover>
            </div>

            {/* Comments */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-indigo-900">
                Comments
              </label>
              <textarea
                rows={4}
                value={formData.comments}
                onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                className="w-full px-4 py-3 border-2 border-indigo-100 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all duration-200"
                placeholder="Add any additional notes here..."
              />
            </div>

            {/* Required Text and Submit Button */}
            <div className="flex justify-between items-center pt-6">
              <p className="text-sm text-indigo-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Required fields are marked with *
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium transition-all duration-200"
              >
                Assign Leave
              </motion.button>
            </div>
          </form>

          {/* Success Message */}
          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center"
              >
                <Check className="w-5 h-5 mr-2" />
                Leave successfully assigned!
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AssignLeave;