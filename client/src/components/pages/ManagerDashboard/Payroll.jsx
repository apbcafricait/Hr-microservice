import React, { useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Download, FileText, Users, UserCheck } from 'lucide-react';
import {
    useDownloadPayslipQuery,
    useGetEmployeePayrollHistoryQuery,
    useProcessBulkPayrollMutation,
    useProcessPayrollforSingleEmployeeMutation
} from '../../../slices/payrollApiSlice';
import PayrollTable from './PayrollTable';
import PayrollSummary from './PayrollSummary';
import ProcessPayrollModal from './ProcessPayrollModal';
import  PDFViewer  from './PDFViewer';
import { useGetOrganisationSummariesQuery } from '../../../slices/payrollApiSlice';
import { useGetEmployeeQuery } from '../../../slices/employeeSlice';
import { useSelector } from 'react-redux';
const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showPDFViewer, setShowPDFViewer] = useState(false);
    const [currentPayslip, setCurrentPayslip] = useState(null);

    const { userInfo } = useSelector((state) => state.auth);
    const id = userInfo?.id;

    const { data: orgEmpData } = useGetEmployeeQuery(id);
    const organisationId = orgEmpData?.data.employee.organisation.id;

    const { data: payrollHistory, isLoading: historyLoading } =
        useGetEmployeePayrollHistoryQuery(selectedEmployee?.id || 6);

    const [processPayroll, { isLoading: processingPayroll }] =
        useProcessPayrollforSingleEmployeeMutation();

    const [processBulk, { isLoading: processingBulk }] =
        useProcessBulkPayrollMutation();
    
    const { data: summaryData } = useGetOrganisationSummariesQuery(organisationId);
    
    console.log(summaryData)
    const handleProcessPayroll = async (employeeId) => {
        try {
            await processPayroll({
                employeeId,
                monthYear: selectedMonth
            }).unwrap();
            // Refresh data after processing
        } catch (error) {
            console.error('Failed to process payroll:', error);
        }
    };

    const handleBulkProcess = async () => {
       
        const dateFormart = "2023-08"
        console.log(dateFormart)
        try {
            await processBulk({
                monthYear: dateFormart,
                organisationId: 1 // Get from context/state
            }).unwrap();
            // Refresh data after processing
        } catch (error) {
            console.error('Failed to process bulk payroll:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                <p className="text-gray-600">Process and manage employee payrolls</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => setShowProcessModal(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={processingPayroll}
                >
                    {processingPayroll ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Process Individual Payroll
                </button>

                <button
                    onClick={handleBulkProcess}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    disabled={processingBulk}
                >
                    {processingBulk ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Users className="w-4 h-4 mr-2" />
                    )}
                    Process Bulk Payroll
                </button>

                <div className="flex items-center ml-auto">
                    <label className="mr-2 text-gray-700">Month:</label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Summary Cards */}
            <PayrollSummary summaryData={summaryData} />

            {/* Payroll Table */}
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                <h2 className="text-xl font-semibold mb-4">Payroll History</h2>
                {historyLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <PayrollTable
                        data={payrollHistory?.data?.payrolls || []}
                        onViewPayslip={(payslip) => {
                            setCurrentPayslip(payslip);
                            setShowPDFViewer(true);
                        }}
                    />
                )}
            </div>

            {/* Process Payroll Modal */}
            <ProcessPayrollModal
                isOpen={showProcessModal}
                onClose={() => setShowProcessModal(false)}
                onProcess={handleProcessPayroll}
                selectedMonth={selectedMonth}
            />

            {/* PDF Viewer Modal */}
            <PDFViewer
                isOpen={showPDFViewer}
                onClose={() => setShowPDFViewer(false)}
                pdfUrl={currentPayslip?.payslipPath}
            />
        </div>
    );
};

export default Payroll;