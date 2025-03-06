import React, { useState,useEffect } from 'react';
import { format } from 'date-fns';
import { Loader2, Download, FileText, Users, UserCheck, Search } from 'lucide-react';
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
import { useGetEmployeeQuery, useGetOrganisationEmployeesQuery } from '../../../slices/employeeSlice';
import { useSelector } from 'react-redux';
import BulkPayrollModal from './BulkPayrollModal';
const Payroll = () => {
    const [selectedMonth, setSelectedMonth] = useState(format(new Date(), 'yyyy-MM'));
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showProcessModal, setShowProcessModal] = useState(false);
    const [showPDFViewer, setShowPDFViewer] = useState(false);
    const [currentPayslip, setCurrentPayslip] = useState(null);
    const [historySelectedEmployee, setHistorySelectedEmployee] = useState(null); 
    const { userInfo } = useSelector((state) => state.auth);
    const id = userInfo?.id;

    const { data: orgEmpData, isLoading: employeesLoading } = useGetEmployeeQuery(id);
    const organisationId = orgEmpData?.data.employee.organisation.id;

    const { data: payrollHistory, isLoading: historyLoading } = useGetEmployeePayrollHistoryQuery(
        historySelectedEmployee?.id,
        { skip: !historySelectedEmployee } // Only fetch when an employee is selected
    );

    const [processPayroll, { isLoading: processingPayroll }] =
        useProcessPayrollforSingleEmployeeMutation();

    const [processBulk, { isLoading: processingBulk }] =
        useProcessBulkPayrollMutation();
    
    const { data: summaryData } = useGetOrganisationSummariesQuery(organisationId);
    const {data:Employees } = useGetOrganisationEmployeesQuery(organisationId)
    // Payroll History States
    // Renamed to avoid conflict
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showBulkModal, setShowBulkModal] = useState(false);
    console.log(Employees)



    useEffect(() => {
        if (Employees?.data?.employees && !historySelectedEmployee) {
            setHistorySelectedEmployee(Employees.data.employees[0]);
        }
    }, [Employees, historySelectedEmployee]);

    // Filter employees based on search term
    const filteredEmployees = Employees?.data?.employees?.filter(employee =>
        `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    ) || [];

    const handleProcessPayroll = async (employeeId) => {
        const monthYear = selectedMonth.toString();
        console.log(monthYear, "monthyear")
        try {
            const result = await processPayroll({
                employeeId,
                monthYear, // Match Postman’s camelCase
            }).unwrap();
            console.log('Processing payroll with:', { employeeId, monthYear: selectedMonth });
            return result; // Return the result to the modal
        } catch (error) {
            console.error('Failed to process payroll:', error);
            throw error; // Re-throw to handle in modal
        }
    };

    const handleBulkProcess = async ({ monthYear, organisationId }) => {
        try {
            const result = await processBulk({ monthYear, organisationId }).unwrap();
            console.log('Bulk Process Result:', result);
            return result; // Return result to modal
        } catch (error) {
            console.error('Failed to process bulk payroll:', error);
            throw error;
        }
    };
    const baseUrl = window.location.hostname === "localhost"
        ? "http://localhost:8100"
        : "https://nexus.apbcafrica.com:8100";

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
                    onClick={() => setShowBulkModal(true)}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Users className="w-4 h-4 mr-2" />
                    Process Bulk Payroll
                </button>

                
            </div>
            

            {/* Summary Cards */}
            <PayrollSummary summaryData={summaryData} />
            {/* Employee Search for Payroll History */}
            <div className="mb-6 mt-6 text-center">
                <h2 className="text-xl font-semibold mb-2">Payroll History</h2>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    {showDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {employeesLoading ? (
                                <div className="p-2 text-gray-500">Loading employees...</div>
                            ) : filteredEmployees.length > 0 ? (
                                filteredEmployees.map(employee => (
                                    <div
                                        key={employee.id}
                                        onClick={() => {
                                            setHistorySelectedEmployee(employee);
                                            setSearchTerm(`${employee.firstName} ${employee.lastName}`);
                                            setShowDropdown(false);
                                        }}
                                        className="p-2 cursor-pointer hover:bg-gray-100"
                                    >
                                        {employee.firstName} {employee.lastName}
                                    </div>
                                ))
                            ) : (
                                <div className="p-2 text-gray-500">No employees found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Payroll Table */}
            <div className="bg-white rounded-lg shadow-md p-6">
                {historyLoading || !historySelectedEmployee ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : (
                    <PayrollTable
                        data={payrollHistory?.data?.payrolls || []}
                        onViewPayslip={(payslip) => {
                            setCurrentPayslip(payslip); // Assuming this is defined elsewhere
                            setShowPDFViewer(true); // Assuming this is defined elsewhere
                        }}
                    />
                )}
            </div>

            {/* Process Payroll Modal */}
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
            <BulkPayrollModal
                isOpen={showBulkModal}
                onClose={() => setShowBulkModal(false)}
                onProcess={handleBulkProcess}
                organisationId={organisationId}
            />
            {/* PDF Viewer Modal */}
            <PDFViewer
                isOpen={showPDFViewer}
                onClose={() => setShowPDFViewer(false)}
                pdfUrl={`${baseUrl}/uploads/payslips/${currentPayslip?.payslipPath.split('/').pop()}`}
            />
        </div>
    );
};

export default Payroll;