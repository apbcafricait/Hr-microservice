import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Plus, FileText, Users, ChevronDown, ArrowUpDown, X, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetAllClaimsQuery,
  useGetMyClaimsQuery,
  useGetClaimsByOrganisationQuery, 
  useSubmitClaimMutation,
  useAssignClaimMutation,
  useUpdateClaimStatusMutation
} from '../../../slices/claimsApiSlice';
import { useGetAllEmployeesQuery } from '../../../slices/employeeSlice';
import { useSelector } from 'react-redux';

const Claims = () => {
  const [activeTab, setActiveTab] = useState('employeeClaims');

  const tabs = [
    { id: 'submitClaim', label: 'Submit Claim', icon: Plus },
    { id: 'myClaims', label: 'My Claims', icon: FileText },
    { id: 'employeeClaims', label: 'Employee Claims', icon: Users },
    { id: 'assignClaim', label: 'Assign Claim', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex flex-wrap gap-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 bg-white hover:bg-gray-50 shadow-sm'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </motion.button>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {activeTab === 'submitClaim' && <SubmitClaimForm />}
          {activeTab === 'myClaims' && <MyClaimsPage />}
          {activeTab === 'employeeClaims' && <EmployeeClaimsPage />}
          {activeTab === 'assignClaim' && <AssignClaimPage />}
        </motion.div>
      </div>
    </div>
  );
};

/**
 * ClaimViewModal Component - ENHANCED WITH BETTER DEBUGGING AND VALIDATION
 */
const ClaimViewModal = ({ claim, isOpen, onClose, onStatusUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState(claim?.status || '');
  const [comment, setComment] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const [updateClaimStatus] = useUpdateClaimStatusMutation();

  useEffect(() => {
    if (claim) {
      setSelectedStatus(claim.status || '');
      setComment('');
    }
  }, [claim]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !comment.trim()) {
      toast.error('Please select a status and provide a comment');
      return;
    }

    // Validate that status is different from current
    if (selectedStatus === claim.status) {
      toast.warning('Please select a different status to update');
      return;
    }

    setIsUpdating(true);
    try {
      console.log('Updating claim status:', {
        claimId: claim.id,
        currentStatus: claim.status,
        newStatus: selectedStatus,
        comment: comment.trim()
      });

      const result = await updateClaimStatus({
        claimId: claim.id,
        status: selectedStatus,
        comment: comment.trim()
      }).unwrap();

      console.log('Status update result:', result);

      toast.success('Claim status updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      onStatusUpdate(); // Refresh the claims list
      onClose(); // Close the modal
    } catch (err) {
      console.error('Status update error:', err);
      
      // Enhanced error message handling
      let errorMessage = 'Failed to update claim status';
      if (err?.data?.message) {
        errorMessage += ': ' + err.data.message;
      } else if (err?.message) {
        errorMessage += ': ' + err.message;
      } else if (err?.status) {
        errorMessage += ` (HTTP ${err.status})`;
      }
      
      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen || !claim) return null;

  const statusOptions = [
    { value: 'CLAIM_SUBMITTED', label: 'Claim Submitted', color: 'bg-blue-100 text-blue-800' },
    { value: 'IN_REVIEW', label: 'In Review', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'ASSIGNED', label: 'Assigned', color: 'bg-purple-100 text-purple-800' },
    { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
    { value: 'REJECTED', label: 'Rejected', color: 'bg-red-100 text-red-800' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Claim Details & Status Update</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Claim Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reference ID</label>
              <p className="text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">{claim.referenceId}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
              <p className="text-gray-900">
                {claim.employee 
                  ? `${claim.employee.firstName} ${claim.employee.lastName}` 
                  : `Employee ID: ${claim.employeeId}`
                }
                {claim.employee?.email && (
                  <span className="text-sm text-gray-500 block">{claim.employee.email}</span>
                )}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
              <p className="text-gray-900">{claim.eventName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
              <p className="text-gray-900 font-semibold text-lg">
                {claim.currency} {claim.amount?.toLocaleString()}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <p className="text-gray-900">{new Date(claim.fromDate).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <p className="text-gray-900">{new Date(claim.toDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-md min-h-[60px]">
              {claim.description || 'No description provided'}
            </p>
          </div>

          {/* Comments (if any) */}
          {claim.comment && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Existing Comments</label>
              <p className="text-gray-900 bg-blue-50 p-3 rounded-md border-l-4 border-blue-400">
                {claim.comment}
              </p>
            </div>
          )}

          {/* Current Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                statusOptions.find(s => s.value === claim.status)?.color || 'bg-gray-100 text-gray-800'
              }`}
            >
              {statusOptions.find(s => s.value === claim.status)?.label || claim.status}
            </span>
          </div>

          {/* Status Update Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
              Update Status
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  disabled={isUpdating}
                >
                  <option value="">-- Select New Status --</option>
                  {statusOptions.map((status) => (
                    <option 
                      key={status.value} 
                      value={status.value}
                      disabled={status.value === claim.status}
                    >
                      {status.label} {status.value === claim.status ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Provide a reason for the status change..."
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Explain why you're changing the status (required for audit trail)
                </p>
              </div>

              {/* Preview of change */}
              {selectedStatus && selectedStatus !== claim.status && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Status Change Preview:</strong><br/>
                    From: <span className="font-mono">{claim.status}</span><br/>
                    To: <span className="font-mono">{selectedStatus}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500">
            Last updated: {claim.updatedAt ? new Date(claim.updatedAt).toLocaleString() : 'N/A'}
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              disabled={isUpdating}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={isUpdating || !selectedStatus || !comment.trim() || selectedStatus === claim.status}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {isUpdating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <span className="mr-1">✓</span>
                  Update Status
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * SearchBar Component
 */
const SearchBar = ({ title, onSearch }) => {
  const [filters, setFilters] = useState({
    referenceId: '',
    eventName: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      referenceId: '',
      eventName: '',
      status: '',
      fromDate: '',
      toDate: ''
    };
    setFilters(resetFilters);
    onSearch(resetFilters);
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reference Id</label>
            <input
              type="text"
              value={filters.referenceId}
              onChange={(e) => setFilters({ ...filters, referenceId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reference ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
            <input
              type="text"
              value={filters.eventName}
              onChange={(e) => setFilters({ ...filters, eventName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Type to filter..."
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="">-- Select --</option>
              <option value="CLAIM_SUBMITTED">Claim Submitted</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <ChevronDown className="absolute right-3 top-8 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

/**
 * ClaimsTable Component - UPDATED WITH VIEW FUNCTIONALITY
 */
const ClaimsTable = ({ data, isLoading, onAssign, onView }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading claims...</p>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-gray-600">No claims found</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      'CLAIM_SUBMITTED': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Claim Submitted' },
      'IN_REVIEW': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Review' },
      'ASSIGNED': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Assigned' },
      'APPROVED': { bg: 'bg-green-100', text: 'text-green-800', label: 'Approved' },
      'REJECTED': { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
    
    return (
      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <div className="text-gray-600">
          <strong>{data.length}</strong> Records Found
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {[
                'Reference Id', 
                'Employee', 
                'Event Name', 
                'Description', 
                'Currency', 
                'Amount', 
                'From Date', 
                'To Date', 
                'Status', 
                'Actions'
              ].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                  <div className="flex items-center">
                    {header}
                    <ArrowUpDown className="w-4 h-4 ml-1 opacity-50" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((claim) => (
              <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {claim.referenceId}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {claim.employee 
                    ? `${claim.employee.firstName} ${claim.employee.lastName}` 
                    : claim.employeeId 
                    ? `Employee ID: ${claim.employeeId}`
                    : 'N/A'
                  }
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {claim.eventName}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  <div className="max-w-xs truncate" title={claim.description}>
                    {claim.description || '-'}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {claim.currency}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {claim.amount?.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(claim.fromDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(claim.toDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {getStatusBadge(claim.status)}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => onView && onView(claim)}
                      className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    {onAssign && (
                      <button
                        onClick={() => onAssign(claim.id)}
                        className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        Assign
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * SubmitClaimForm Component
 */
const SubmitClaimForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    currency: 'KSH',
    amount: '',
    fromDate: '',
    toDate: '',
    employeeId: '',
  });

  const [submitClaim, { isLoading: isSubmitting }] = useSubmitClaimMutation();
  const { data: employeesData, isLoading: isEmployeesLoading, error: employeesError } = useGetAllEmployeesQuery();
  
  // Extract employees from the nested data structure
  const employees = employeesData?.data?.employees || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.employeeId || !formData.eventName || !formData.amount || !formData.fromDate || !formData.toDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (new Date(formData.fromDate) >= new Date(formData.toDate)) {
      toast.error('To Date must be after From Date');
      return;
    }

    try {
      const submissionData = {
        ...formData,
        employeeId: parseInt(formData.employeeId, 10),
        amount: parseFloat(formData.amount),
      };

      console.log('Submitting claim:', submissionData);
      
      await submitClaim(submissionData).unwrap();
      toast.success('Claim submitted successfully!', {
        position: 'top-right',
        autoClose: 3000,
      });
      
      // Reset form
      setFormData({
        eventName: '',
        description: '',
        currency: 'KSH',
        amount: '',
        fromDate: '',
        toDate: '',
        employeeId: '',
      });
    } catch (err) {
      console.error('Claim submission error:', err);
      toast.error('Failed to submit claim: ' + (err?.data?.message || err.message), {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  if (isEmployeesLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading employees...</p>
      </div>
    );
  }

  if (employeesError) {
    return (
      <div className="text-center py-4 text-red-600">
        Error loading employees: {employeesError?.data?.message || employeesError.message}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Create Claim Request</h2>
        <p className="text-sm text-gray-600 mt-1">Submit a new expense claim for processing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select Employee --</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {`${employee.firstName} ${employee.lastName} (${employee.email})`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-10 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Business Travel, Conference"
            required
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="KSH">KSH - Kenyan Shilling</option>
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
          </select>
          <ChevronDown className="absolute right-3 top-10 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.fromDate}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.toDate}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            min={formData.fromDate}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          placeholder="Provide additional details about the claim..."
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={() => setFormData({
            eventName: '',
            description: '',
            currency: 'KSH',
            amount: '',
            fromDate: '',
            toDate: '',
            employeeId: '',
          })}
          className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Claim
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/**
 * MyClaimsPage Component - UPDATED WITH VIEW MODAL
 */
const MyClaimsPage = () => {
  const [filters, setFilters] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Check if user is admin
  const isAdmin = userInfo?.role === 'admin';
  
  // Get organization ID for admin users
  const getOrganisationId = () => {
    if (userInfo?.organisationId) return userInfo.organisationId;
    if (userInfo?.user?.organisationId) return userInfo.user.organisationId;
    if (userInfo?.organisation?.id) return userInfo.organisation.id;
    if (userInfo?.organization?.id) return userInfo.organization.id;
    if (userInfo?.orgId) return userInfo.orgId;
    
    // TEMPORARY FIX: If user is admin and email matches, return Arsenal org ID
    if (userInfo?.role === 'admin' && userInfo?.email === 'aredook12@gmail.com') {
      return 2; // Arsenal organization ID
    }
    
    return null;
  };

  const organisationId = getOrganisationId();
  
  // Use different queries based on user role
  const { data, isLoading, error, refetch } = isAdmin 
    ? useGetClaimsByOrganisationQuery(organisationId, { skip: !organisationId })
    : useGetMyClaimsQuery();
  
  // Extract claims from the nested data structure
  const allClaims = data?.data?.claims || data?.claims || data || [];

  const filteredClaims = allClaims.filter(claim => {
    if (filters.referenceId && !claim.referenceId?.includes(filters.referenceId)) return false;
    if (filters.eventName && !claim.eventName?.toLowerCase().includes(filters.eventName.toLowerCase())) return false;
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.fromDate && new Date(claim.fromDate) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(claim.toDate) > new Date(filters.toDate)) return false;
    return true;
  });

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  
  if (error) return (
    <div className="text-center py-4 text-red-600">
      Error loading claims: {error?.data?.message || error.message}
      <button 
        onClick={() => refetch()} 
        className="block mx-auto mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <SearchBar title={isAdmin ? "Organization Claims" : "My Claims"} onSearch={setFilters} />
      {isAdmin && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-sm text-blue-700">
              <strong>Admin Mode:</strong> Showing organization claims | 
              <strong> Organization ID:</strong> {organisationId} | 
              <strong> Total:</strong> {allClaims.length} | 
              <strong> Filtered:</strong> {filteredClaims.length}
            </p>
            <button 
              onClick={() => refetch()} 
              className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      )}
      <ClaimsTable data={filteredClaims} isLoading={isLoading} onView={handleViewClaim} />
      
      <ClaimViewModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

/**
 * EmployeeClaimsPage Component - UPDATED WITH VIEW MODAL
 */
const EmployeeClaimsPage = () => {
  const [filters, setFilters] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Get organization ID from different possible sources
  const getOrganisationId = () => {
    // Check direct organisationId field
    if (userInfo?.organisationId) return userInfo.organisationId;
    
    // Check if it's nested in user object
    if (userInfo?.user?.organisationId) return userInfo.user.organisationId;
    
    // Check if it's in organisation object
    if (userInfo?.organisation?.id) return userInfo.organisation.id;
    
    // Check if admin has organization field
    if (userInfo?.organization?.id) return userInfo.organization.id;
    
    // For admin users, they might have their own org ID
    if (userInfo?.orgId) return userInfo.orgId;
    
    // TEMPORARY FIX: If user is admin and email matches, return Arsenal org ID
    if (userInfo?.role === 'admin' && userInfo?.email === 'aredook12@gmail.com') {
      return 2; // Arsenal organization ID
    }
    
    return null;
  };

  const organisationId = getOrganisationId();
  
  // Use organization-specific endpoint instead of getAllClaims
  const { data, isLoading, error, refetch } = useGetClaimsByOrganisationQuery(organisationId, {
    skip: !organisationId // Skip the query if no organisation ID
  });
  
  // Extract claims from the data structure (same as Employee Dashboard)
  const allClaims = data?.data?.claims || [];
  
  // Apply client-side filtering (same logic as before)
  const filteredClaims = allClaims.filter(claim => {
    if (filters.referenceId && !claim.referenceId?.includes(filters.referenceId)) return false;
    if (filters.eventName && !claim.eventName?.toLowerCase().includes(filters.eventName.toLowerCase())) return false;
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.fromDate && new Date(claim.fromDate) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(claim.toDate) > new Date(filters.toDate)) return false;
    return true;
  });

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    refetch();
  };

  useEffect(() => {
    if (organisationId) {
      refetch();
    }
  }, [refetch, organisationId]);

  if (!organisationId) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <h3 className="font-semibold text-lg">Organization ID Not Found</h3>
            <p className="text-sm mt-2">Unable to determine your organization. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  
  if (error) return (
    <div className="text-center py-4">
      <div className="text-red-600 mb-4">
        Error loading claims: {error?.data?.message || error.message}
      </div>
      <button 
        onClick={() => refetch()} 
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <SearchBar title="Employee Claims" onSearch={setFilters} />
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-blue-700">
            <strong>Organization:</strong> {organisationId} | 
            <strong> Total Claims:</strong> {allClaims.length} | 
            <strong> Filtered:</strong> {filteredClaims.length}
          </p>
          <button 
            onClick={() => refetch()} 
            className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
      <ClaimsTable data={filteredClaims} isLoading={isLoading} onView={handleViewClaim} />
      
      <ClaimViewModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

/**
 * AssignClaimPage Component - UPDATED WITH VIEW MODAL
 */
const AssignClaimPage = () => {
  const [filters, setFilters] = useState({});
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  
  // Get organization ID from different possible sources
  const getOrganisationId = () => {
    // Check direct organisationId field
    if (userInfo?.organisationId) return userInfo.organisationId;
    
    // Check if it's nested in user object
    if (userInfo?.user?.organisationId) return userInfo.user.organisationId;
    
    // Check if it's in organisation object
    if (userInfo?.organisation?.id) return userInfo.organisation.id;
    
    // Check if admin has organization field
    if (userInfo?.organization?.id) return userInfo.organization.id;
    
    // For admin users, they might have their own org ID
    if (userInfo?.orgId) return userInfo.orgId;
    
    // TEMPORARY FIX: If user is admin and email matches, return Arsenal org ID
    if (userInfo?.role === 'admin' && userInfo?.email === 'aredook12@gmail.com') {
      return 2; // Arsenal organization ID
    }
    
    return null;
  };

  const organisationId = getOrganisationId();
  
  // Use organization-specific endpoint
  const { data, isLoading, error, refetch } = useGetClaimsByOrganisationQuery(organisationId, {
    skip: !organisationId // Skip the query if no organisation ID
  });
  const [assignClaim, { isLoading: isAssigning }] = useAssignClaimMutation();
  
  // Extract claims from the data structure
  const allClaims = data?.data?.claims || [];

  // Apply client-side filtering
  const filteredClaims = allClaims.filter(claim => {
    if (filters.referenceId && !claim.referenceId?.includes(filters.referenceId)) return false;
    if (filters.eventName && !claim.eventName?.toLowerCase().includes(filters.eventName.toLowerCase())) return false;
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.fromDate && new Date(claim.fromDate) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(claim.toDate) > new Date(filters.toDate)) return false;
    return true;
  });

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setIsModalOpen(true);
  };

  const handleStatusUpdate = () => {
    refetch();
  };

  const handleAssign = async (claimId) => {
    try {
      const employeeId = prompt('Enter Employee ID to assign:');
      if (employeeId) {
        await assignClaim({ 
          claimId, 
          assignedToId: parseInt(employeeId, 10),
          comment: 'Assigned from admin dashboard'
        }).unwrap();
        
        toast.success('Claim assigned successfully!', {
          position: 'top-right',
          autoClose: 3000,
        });
        
        refetch();
      }
    } catch (err) {
      console.error('Assignment error:', err);
      toast.error('Failed to assign claim: ' + (err?.data?.message || err.message), {
        position: 'top-right',
        autoClose: 5000,
      });
    }
  };

  useEffect(() => {
    if (organisationId) {
      refetch();
    }
  }, [refetch, organisationId]);

  if (!organisationId) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <h3 className="font-semibold text-lg">Organization ID Not Found</h3>
            <p className="text-sm mt-2">Unable to determine your organization. Please contact support.</p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  
  if (error) return (
    <div className="text-center py-4">
      <div className="text-red-600 mb-4">
        Error loading claims: {error?.data?.message || error.message}
      </div>
      <button 
        onClick={() => refetch()} 
        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );

  return (
    <>
      <SearchBar title="Assign Claim" onSearch={setFilters} />
      <div className="mb-4 p-4 bg-purple-50 rounded-lg">
        <div className="flex justify-between items-center">
          <p className="text-sm text-purple-700">
            <strong>Assignment Mode:</strong> Click "Assign" on any claim to assign it to an employee
            (Organization: {organisationId})
          </p>
          <button 
            onClick={() => refetch()} 
            className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
      <ClaimsTable 
        data={filteredClaims} 
        isLoading={isLoading || isAssigning} 
        onAssign={handleAssign}
        onView={handleViewClaim}
      />
      
      <ClaimViewModal
        claim={selectedClaim}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
};

export default Claims;