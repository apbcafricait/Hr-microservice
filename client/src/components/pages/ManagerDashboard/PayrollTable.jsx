import React, { useState } from 'react';
import { format } from 'date-fns';
import { Eye, Download, ChevronLeft, ChevronRight } from 'lucide-react';

const PayrollTable = ({ data, onViewPayslip }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Adjust as needed

    // Calculate pagination
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Month
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gross Salary
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deductions
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Net Salary
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((payroll) => (
                            <tr key={payroll.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {format(new Date(payroll.monthYear), 'MMMM yyyy')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    KES {payroll.grossSalary.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-600">
                                        <div>PAYE: KES {payroll.deductions.paye.toLocaleString()}</div>
                                        <div>SHIF: KES {payroll.deductions.shif.toLocaleString()}</div>
                                        <div>NSSF: KES {payroll.deductions.nssf.amount.toLocaleString()}</div>
                                        <div>Housing: KES {payroll.deductions.housingLevy.toLocaleString()}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    KES {payroll.netSalary.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => onViewPayslip(payroll)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => window.open(`/api/payroll/download/${payroll.id}`)}
                                            className="text-green-600 hover:text-green-900"
                                        >
                                            <Download className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        
            {/* Updated Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-4 flex justify-between items-center text-sm font-medium">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                    >
                        <ChevronLeft className="w-5 h-5 mr-2" />
                        Previous
                    </button>
                    <span className="px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full shadow-sm">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                    >
                        Next
                        <ChevronRight className="w-5 h-5 ml-2" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default PayrollTable;