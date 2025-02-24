import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Search, Plus, FileText, Users, ChevronDown, ArrowUpDown } from 'lucide-react';

const ClaimsPortal = () => {
  const [activeTab, setActiveTab] = useState('myClaims');

  const tabs = [
    { id: 'submitClaim', label: 'Submit Claim', icon: Plus },
    { id: 'myClaims', label: 'My Claims', icon: FileText },
    { id: 'employeeClaims', label: 'Employee Claims', icon: Users },
    { id: 'assignClaim', label: 'Assign Claim', icon: FileText }
  ];

  const TabContent = () => {
    switch (activeTab) {
      case 'submitClaim':
        return <SubmitClaimForm />;
      case 'myClaims':
        return <MyClaimsPage />;
      case 'employeeClaims':
        return <EmployeeClaimsPage />;
      case 'assignClaim':
        return <AssignClaimPage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-md ${
                activeTab === tab.id
                  ? 'bg-green-600 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              <span className="font-medium">{tab.label}</span>
            </motion.button>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <TabContent />
        </motion.div>
      </div>
    </div>
  );
};

const SearchBar = ({ title }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Reference Id</label>
          <input
            type="text"
            placeholder="Type for hints..."
            className="w-full px-3 py-2 border border-slate-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Event Name</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-slate-200 rounded-md appearance-none">
              <option>-- Select --</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Status</label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-slate-200 rounded-md appearance-none">
              <option>-- Select --</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">From Date</label>
          <input
            type="text"
            placeholder="yyyy-dd-mm"
            className="w-full px-3 py-2 border border-slate-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">To Date</label>
          <input
            type="text"
            placeholder="yyyy-dd-mm"
            className="w-full px-3 py-2 border border-slate-200 rounded-md"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-6">
        <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50">
          Reset
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Search
        </button>
      </div>
    </div>
  );
};

const ClaimsTable = ({ data }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="text-slate-600">(3) Records Found</div>
        <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Submit Claim
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">
                <div className="flex items-center">
                  Reference Id
                  <ArrowUpDown className="w-4 h-4 ml-1" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Event Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Description</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Currency</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Submitted Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            <tr>
              <td className="px-4 py-3 text-sm text-slate-600">2023071800000003</td>
              <td className="px-4 py-3 text-sm text-slate-600">Travel Allowance</td>
              <td className="px-4 py-3 text-sm text-slate-600">-</td>
              <td className="px-4 py-3 text-sm text-slate-600">Algerian Dinar</td>
              <td className="px-4 py-3 text-sm text-slate-600">2023-18-07</td>
              <td className="px-4 py-3 text-sm text-slate-600">Submitted</td>
              <td className="px-4 py-3 text-sm text-slate-600">7,300.32</td>
              <td className="px-4 py-3 text-sm text-blue-600 hover:text-blue-700">
                <button>View Details</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const MyClaimsPage = () => {
  return (
    <>
      <SearchBar title="My Claims" />
      <ClaimsTable />
    </>
  );
};

const EmployeeClaimsPage = () => {
  return (
    <>
      <SearchBar title="Employee Claims" />
      <ClaimsTable />
    </>
  );
};

const AssignClaimPage = () => {
  return (
    <>
      <SearchBar title="Assign Claim" />
      <ClaimsTable />
    </>
  );
};

const SubmitClaimForm = () => {
  return (
    <form className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-700 mb-6">Create Claim Request</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Employee Name*
          </label>
          <input
            type="text"
            placeholder="Type for hints..."
            className="w-full px-3 py-2 border border-slate-200 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Event*
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-slate-200 rounded-md appearance-none">
              <option>-- Select --</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">
            Currency*
          </label>
          <div className="relative">
            <select className="w-full px-3 py-2 border border-slate-200 rounded-md appearance-none">
              <option>-- Select --</option>
            </select>
            <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">
          Remarks
        </label>
        <textarea
          className="w-full px-3 py-2 border border-slate-200 rounded-md"
          rows={4}
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button type="button" className="px-4 py-2 border border-slate-200 text-slate-600 rounded-md hover:bg-slate-50">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
          Create
        </button>
      </div>
    </form>
  );
};

export default ClaimsPortal;