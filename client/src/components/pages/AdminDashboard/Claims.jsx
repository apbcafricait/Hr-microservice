import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Plus, FileText, Users, ChevronDown, ArrowUpDown } from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  useGetAllClaimsQuery,
  useGetMyClaimsQuery,
  useSubmitClaimMutation,
  useAssignClaimMutation
} from '../../../slices/claimsApiSlice';
import { useGetAllEmployeesQuery } from '../../../slices/employeeSlice';

const Claims = () => {
  const [activeTab, setActiveTab] = useState('myClaims');

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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reference Id</label>
          <input
            type="text"
            value={filters.referenceId}
            onChange={(e) => setFilters({ ...filters, referenceId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none"
          >
            <option value="">-- Select --</option>
            <option value="Submitted">Submitted</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
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
          onClick={() => setFilters({ referenceId: '', eventName: '', status: '', fromDate: '', toDate: '' })}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
    </form>
  );
};

/**
 * ClaimsTable Component
 */
const ClaimsTable = ({ data, isLoading, onAssign }) => {
  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (!data?.length) return <div className="text-center py-4">No claims found</div>;

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">({data.length}) Records Found</div>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Submit Claim
        </button>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-y border-gray-200">
            {['Reference Id', 'Event Name', 'Description', 'Currency', 'From Date', 'To Date', 'Amount', 'Actions'].map((header) => (
              <th key={header} className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                <div className="flex items-center">
                  {header}
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((claim) => (
            <tr key={claim.id}>
              <td className="px-4 py-3 text-sm text-gray-600">{claim.id}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{claim.eventName}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{claim.description || '-'}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{claim.currency}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(claim.fromDate).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{new Date(claim.toDate).toLocaleDateString()}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{claim.amount.toLocaleString()}</td>
              <td className="px-4 py-3 text-sm">
                <button className="text-blue-600 hover:text-blue-700 mr-2">View</button>
                {onAssign && (
                  <button
                    onClick={() => onAssign(claim.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Assign
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * SubmitClaimForm Component
 * Modified to fetch employees and use a dropdown instead of a text input for employeeId.
 */
const SubmitClaimForm = () => {
  const [formData, setFormData] = useState({
    eventName: '',
    description: '',
    currency: 'KSH',
    amount: '',
    fromDate: '',
    toDate: '',
    employeeId: '', // Initial value as empty string for dropdown
  });

  const [submitClaim, { isLoading: isSubmitting }] = useSubmitClaimMutation();
  const { data: employees, isLoading: isEmployeesLoading, error: employeesError } = useGetAllEmployeesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert employeeId to integer before submission
      const submissionData = {
        ...formData,
        employeeId: parseInt(formData.employeeId, 10),
      };
      await submitClaim(submissionData).unwrap();
      toast.success('Claim submitted successfully!');
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
      toast.error('Failed to submit claim: ' + (err?.data?.message || err.message));
    }
  };

  if (isEmployeesLoading) return <div className="text-center py-4">Loading employees...</div>;
  if (employeesError) return <div className="text-center py-4 text-red-600">Error loading employees: {employeesError.message}</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6">Create Claim Request</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Employee*</label>
          <select
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">-- Select Employee --</option>
            {employees?.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name || `${employee.firstName} ${employee.lastName}`} {/* Adjust based on your employee data */}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-10 w-4 h-4 text-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Name*</label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency*</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md appearance-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="KSH">KSH</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
          <ChevronDown className="absolute right-3 top-10 w-4 h-4 text-gray-400" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amount*</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Date*</label>
          <input
            type="date"
            value={formData.fromDate}
            onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Date*</label>
          <input
            type="date"
            value={formData.toDate}
            onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
        >
          {isSubmitting ? 'Submitting...' : 'Create'}
        </button>
      </div>
    </form>
  );
};

/**
 * MyClaimsPage Component
 */
const MyClaimsPage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useGetMyClaimsQuery();
  const allClaims = Array.isArray(data) ? data : [];

  const filteredClaims = allClaims.filter(claim => {
    if (filters.referenceId && !claim.id?.includes(filters.referenceId)) return false;
    if (filters.eventName && !claim.eventName?.toLowerCase().includes(filters.eventName.toLowerCase())) return false;
    if (filters.status && claim.status !== filters.status) return false;
    if (filters.fromDate && new Date(claim.fromDate) < new Date(filters.fromDate)) return false;
    if (filters.toDate && new Date(claim.toDate) > new Date(filters.toDate)) return false;
    return true;
  });

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error loading claims: {error?.data?.message || error.message}</div>;

  return (
    <>
      <SearchBar title="My Claims" onSearch={setFilters} />
      <ClaimsTable data={filteredClaims} isLoading={isLoading} />
    </>
  );
};

/**
 * EmployeeClaimsPage Component
 */
const EmployeeClaimsPage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useGetAllClaimsQuery(filters);
  const allClaims = Array.isArray(data) ? data : [];

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error loading claims: {error?.data?.message || error.message}</div>;

  return (
    <>
      <SearchBar title="Employee Claims" onSearch={setFilters} />
      <ClaimsTable data={allClaims} isLoading={isLoading} />
    </>
  );
};

/**
 * AssignClaimPage Component
 */
const AssignClaimPage = () => {
  const [filters, setFilters] = useState({});
  const { data, isLoading, error } = useGetAllClaimsQuery(filters);
  const [assignClaim] = useAssignClaimMutation();
  const allClaims = Array.isArray(data) ? data : [];

  const handleAssign = async (claimId) => {
    try {
      const employeeId = prompt('Enter Employee ID to assign:');
      if (employeeId) {
        await assignClaim({ claimId, employeeId: parseInt(employeeId, 10) }).unwrap();
        toast.success('Claim assigned successfully!');
      }
    } catch (err) {
      toast.error('Failed to assign claim: ' + (err?.data?.message || err.message));
    }
  };

  if (isLoading) return <div className="text-center py-4 text-gray-600">Loading claims...</div>;
  if (error) return <div className="text-center py-4 text-red-600">Error loading claims: {error?.data?.message || error.message}</div>;

  return (
    <>
      <SearchBar title="Assign Claim" onSearch={setFilters} />
      <ClaimsTable data={allClaims} isLoading={isLoading} onAssign={handleAssign} />
    </>
  );
};

export default Claims;