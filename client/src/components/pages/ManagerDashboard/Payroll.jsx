import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, FileText, Users, UserCheck, Search,
  Calendar, FileSpreadsheet, RefreshCw, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  useDownloadPayslipQuery,
  useGetEmployeePayrollHistoryQuery,
  useProcessBulkPayrollMutation,
  useProcessPayrollforSingleEmployeeMutation
} from '../../../slices/payrollApiSlice';
import { useGetOrganisationSummariesQuery } from '../../../slices/payrollApiSlice';
import { useGetEmployeeQuery, useGetOrganisationEmployeesQuery } from '../../../slices/employeeSlice';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PayrollTable from './PayrollTable';
import PayrollSummary from './PayrollSummary';
import ProcessPayrollModal from './ProcessPayrollModal';
import BulkPayrollModal from './BulkPayrollModal';
import PDFViewer from './PDFViewer';
import { CSVLink } from 'react-csv';

// Utility function to prepare CSV data for summary with safe type checks
const prepareSummaryCSVData = (summaryData) => {
  if (!summaryData?.data) return [];
  const { totalGrossPay, totalNetPay, totalDeductions } = summaryData.data;
  // Convert totalDeductions to number or fallback to 0
  const deductions = typeof totalDeductions === 'number' && !isNaN(totalDeductions) ? totalDeductions : 0;
  return [{
    'Total Gross Pay': totalGrossPay ? `KES ${totalGrossPay.toFixed(2)}` : 'N/A',
    'Total Net Pay': totalNetPay ? `KES ${totalNetPay.toFixed(2)}` : 'N/A',
    'Total Deductions': deductions ? `KES ${deductions.toFixed(2)}` : 'N/A'
  }];
};

const Payroll = () => {
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [currentPayslip, setCurrentPayslip] = useState(null);
  const [historySelectedEmployee, setHistorySelectedEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedPayroll, setExpandedPayroll] = useState(null);

  const { userInfo } = useSelector((state) => state.auth);
  const id = userInfo?.id;
  const { data: orgEmpData, isLoading: employeesLoading, error: orgEmpError, refetch: refetchEmployee } = useGetEmployeeQuery(id);
  const organisationId = orgEmpData?.data?.employee?.organisation?.id;

  const { 
    data: payrollHistory, 
    isLoading: historyLoading, 
    error: historyError, 
    refetch: refetchPayrollHistory 
  } = useGetEmployeePayrollHistoryQuery(historySelectedEmployee?.id, { skip: !historySelectedEmployee });

  const [processPayroll, { isLoading: processingPayroll }] = useProcessPayrollforSingleEmployeeMutation();
  const [processBulk, { isLoading: processingBulk }] = useProcessBulkPayrollMutation();
  const { 
    data: summaryData, 
    isLoading: summaryLoading, 
    error: summaryError,
    refetch: refetchSummary 
  } = useGetOrganisationSummariesQuery(organisationId);
  const { 
    data: Employees, 
    isLoading: employeesListLoading, 
    error: employeesListError, 
    refetch: refetchEmployeesList 
  } = useGetOrganisationEmployeesQuery(organisationId);

  useEffect(() => {
    if (Employees?.data?.employees?.length > 0 && !historySelectedEmployee) {
      setHistorySelectedEmployee(Employees.data.employees[0]);
    }
  }, [Employees, historySelectedEmployee]);

  const filteredEmployees = Employees?.data?.employees?.filter(employee => 
    employee ? `${employee.firstName || ''} ${employee.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) : false
  ) || [];

  // Filter payrolls by status
  const filteredPayrolls = payrollHistory?.data?.payrolls?.filter(payroll => 
    statusFilter === 'All' || payroll.status === statusFilter
  ) || [];

  const handleProcessPayroll = async (employeeId) => {
    try {
      const result = await processPayroll({
        employeeId,
        monthYear: selectedMonth
      }).unwrap();
      toast.success('Payroll processed successfully');
      refetchPayrollHistory();
      refetchSummary();
      return result;
    } catch (error) {
      console.error('Failed to process payroll:', error);
      toast.error('Failed to process payroll');
      throw error;
    }
  };

  const handleBulkProcess = async ({ monthYear, organisationId }) => {
    try {
      const result = await processBulk({ monthYear, organisationId }).unwrap();
      toast.success('Bulk payroll processed successfully');
      refetchPayrollHistory();
      refetchSummary();
      return result;
    } catch (error) {
      console.error('Failed to process bulk payroll:', error);
      toast.error('Failed to process bulk payroll');
      throw error;
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([refetchEmployee(), refetchPayrollHistory(), refetchSummary(), refetchEmployeesList()]);
      toast.success('Data refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh data');
    }
  };

  // Format currency in KES
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || isNaN(amount)) return 'N/A';
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const baseUrl = window.location.hostname === "localhost"
    ? "http://localhost:8100"
    : "https://nexus.apbcafrica.com";

  // Dashboard stats with safe checks
  const totalPayrolls = filteredPayrolls.length || 0;
  const totalEmployees = Employees?.data?.employees?.length || 0;
  // Ensure totalDeductions is a number or fallback to 0
  const totalDeductions = typeof summaryData?.data?.totalDeductions === 'number' && !isNaN(summaryData?.data?.totalDeductions) 
    ? summaryData.data.totalDeductions 
    : 0;

  if (orgEmpError || employeesListError || historyError || summaryError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-lg shadow-xl border-l-4 border-red-500">
          <h3 className="text-red-500 font-poppins font-semibold text-lg mb-2">Error Loading Data</h3>
          <p className="text-gray-700 font-lato">We couldn't load payroll information. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (employeesLoading || employeesListLoading || summaryLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="p-6 rounded-xl bg-white/70 backdrop-blur-lg shadow-xl border border-white/30">
          <div className="flex flex-col items-center space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="text-gray-700 font-lato font-medium">Loading payroll data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 font-lato p-4 sm:p-6 lg:p-8">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700&family=Lato:wght@400;500&display=swap');
        body {
          font-family: 'Lato', sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Poppins', sans-serif;
        }
      `}</style>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900">Payroll Management</h1>
          <p className="text-gray-600 font-lato mt-4">Manage and process employee payrolls efficiently</p>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <motion.div
            className="bg-white/70 rounded-xl p-6 border border-white/30 shadow-xl backdrop-blur-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center gap-4">
              <Users size={32} className="text-indigo-600" />
              <div>
                <h3 className="text-lg font-poppins font-bold text-gray-900">Total Employees</h3>
                <p className="text-2xl font-poppins font-bold text-indigo-600">{totalEmployees}</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-white/70 rounded-xl p-6 border border-white/30 shadow-xl backdrop-blur-sm"
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="flex items-center gap-4">
              <FileText size={32} className="text-indigo-600" />
              <div>
                <h3 className="text-lg font-poppins font-bold text-gray-900">Total Payrolls & Deductions</h3>
                <p className="text-2xl font-poppins font-bold text-indigo-600">{totalPayrolls}</p>
                <p className="text-sm font-lato text-gray-600">Total Deductions: {formatCurrency(totalDeductions)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <motion.button
            onClick={() => setShowProcessModal(true)}
            className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={processingPayroll}
          >
            {processingPayroll ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <UserCheck className="w-5 h-5 mr-2" />
            )}
            Process Individual Payroll
          </motion.button>
          <motion.button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center px-6 py-3 bg-green-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-green-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            disabled={processingBulk}
          >
            <Users className="w-5 h-5 mr-2" />
            Process Bulk Payroll
          </motion.button>
          <CSVLink
            data={prepareSummaryCSVData(summaryData)}
            filename={`payroll-summary-${selectedMonth}.csv`}
            className="flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-teal-700 transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            Download Summary
          </CSVLink>
          <motion.button
            onClick={handleRefresh}
            className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-poppins font-semibold shadow-md hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Refresh Data
          </motion.button>
        </div>

        {/* Payroll Summary */}
        {summaryData && (
          <motion.div
            className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4">Payroll Summary</h2>
            <PayrollSummary summaryData={summaryData} />
          </motion.div>
        )}

        {/* Processed Employee Payrolls */}
        <motion.div
          className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-4">Processed Employee Payrolls</h2>
          {filteredPayrolls.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPayrolls.map(payroll => (
                <motion.div
                  key={payroll.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-md"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-poppins font-semibold text-gray-900">
                      {payroll.employee ? `${payroll.employee.firstName || 'N/A'} ${payroll.employee.lastName || ''}` : 'N/A'}
                    </h3>
                    <motion.button
                      onClick={() => setExpandedPayroll(expandedPayroll === payroll.id ? null : payroll.id)}
                      className="text-indigo-500"
                      whileHover={{ scale: 1.1 }}
                    >
                      {expandedPayroll === payroll.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </motion.button>
                  </div>
                  <p className="text-sm font-lato text-gray-600">Month: {format(new Date(payroll.monthYear), 'MMMM yyyy')}</p>
                  <p className="text-sm font-lato text-gray-600">Gross Pay: {formatCurrency(payroll.grossPay)}</p>
                  <p className="text-sm font-lato text-gray-600">Net Pay: {formatCurrency(payroll.netPay)}</p>
                  <AnimatePresence>
                    {expandedPayroll === payroll.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-2"
                      >
                        <p className="text-sm font-lato text-gray-600">Deductions: {formatCurrency(payroll.deductions || 0)}</p>
                        <p className="text-sm font-lato text-gray-600">Status: {payroll.status || 'N/A'}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 font-lato text-center">No payrolls processed for the selected month</p>
          )}
        </motion.div>

        {/* Employee Search and Payroll History */}
        <motion.div
          className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl p-6 mb-8 border border-white/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-poppins font-bold text-gray-900">Payroll History</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 font-lato"
            >
              <option value="All">All Statuses</option>
              <option value="Processed">Processed</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div className="relative max-w-md mb-6">
            <input
              type="text"
              placeholder="Search employee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-lato transition-all duration-300"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-1 bg-white/90 backdrop-blur-lg border border-white/30 rounded-xl shadow-lg max-h-60 overflow-y-auto"
                >
                  {employeesLoading ? (
                    <div className="p-3 text-gray-500 font-lato">Loading employees...</div>
                  ) : filteredEmployees.length > 0 ? (
                    filteredEmployees.map(employee => (
                      <motion.div
                        key={employee.id}
                        onClick={() => {
                          setHistorySelectedEmployee(employee);
                          setSearchTerm(`${employee.firstName || 'N/A'} ${employee.lastName || ''}`);
                          setShowDropdown(false);
                        }}
                        className="p-3 cursor-pointer hover:bg-indigo-100/50 font-lato transition-colors"
                        whileHover={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
                      >
                        {employee.firstName || 'N/A'} {employee.lastName || ''}
                      </motion.div>
                    ))
                  ) : (
                    <div className="p-3 text-gray-500 font-lato">No employees found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payroll Table */}
          <div className="overflow-x-auto">
            {historyLoading || !historySelectedEmployee ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              </div>
            ) : (
              <PayrollTable
                data={filteredPayrolls}
                onViewPayslip={(payslip) => {
                  setCurrentPayslip(payslip);
                  setShowPDFViewer(true);
                }}
              />
            )}
          </div>
        </motion.div>

        {/* Modals */}
        <AnimatePresence>
          {showProcessModal && (
            <ProcessPayrollModal
              isOpen={showProcessModal}
              onClose={() => setShowProcessModal(false)}
              onProcess={handleProcessPayroll}
              selectedEmployee={selectedEmployee}
              setSelectedEmployee={setSelectedEmployee}
              Employees={Employees}
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
            />
          )}
          {showBulkModal && (
            <BulkPayrollModal
              isOpen={showBulkModal}
              onClose={() => setShowBulkModal(false)}
              onProcess={handleBulkProcess}
              organisationId={organisationId}
            />
          )}
          {showPDFViewer && (
            <PDFViewer
              isOpen={showPDFViewer}
              onClose={() => setShowPDFViewer(false)}
              pdfUrl={`${baseUrl}/Uploads/payslips/${currentPayslip?.payslipPath.split('/').pop()}`}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Payroll;