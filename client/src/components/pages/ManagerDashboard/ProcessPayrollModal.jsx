import React, { useState } from 'react';
import { X, Search, Loader2 } from 'lucide-react';

const ProcessPayrollModal = ({
    isOpen,
    onClose,
    onProcess,
    setSelectedEmployee,
    selectedEmployee,
    selectedMonth,
    setSelectedMonth,
    Employees
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    // Separate month and year states
    const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12, default to current
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year

    console.log('Selected Employee:', selectedEmployee);
    console.log('Month:', month, 'Year:', year);

    if (!isOpen) return null;

    const employeeData = Array.isArray(Employees?.data?.employees) ? Employees.data.employees : [];
    const filteredEmployees = employeeData.filter(employee =>
        `${employee.firstName} ${employee.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    const handleProcess = async () => {
        if (!selectedEmployee || !month || !year) return;

        setLoading(true);
        setMessage(null);

        try {
            const result = await onProcess(selectedEmployee.id);
            console.log('API Response:', result);
            if (result.status === 'success') {
                setMessage({
                    type: 'success',
                    text: `Payroll processed successfully!`,
                });
              
            } else {
                const { payroll } = result.data;
                setMessage({
                    type: 'error',
                    text: `Oops! ${payroll.message}` || 'Unknown error occurred',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Failed to process payroll',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Process Individual Payroll</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Month and Year Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Month-Year
                    </label>
                    <input
                        type="month"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>

                {/* Employee Search */}
                <div className="mb-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search employee..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg pl-10 focus:ring-2 focus:ring-blue-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                    </div>
                </div>

                {/* Employee selection */}
                <div className="max-h-60 overflow-y-auto mb-4">
                    {employeeData.length === 0 ? (
                        <div className="p-2 text-gray-500">No employee data available</div>
                    ) : filteredEmployees.length > 0 ? (
                        filteredEmployees.map(employee => (
                            <div
                                key={employee.id}
                                onClick={() => setSelectedEmployee(employee)}
                                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedEmployee?.id === employee.id ? 'bg-blue-100' : ''
                                    }`}
                            >
                                {employee.firstName} {employee.lastName}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-gray-500">No employees found</div>
                    )}
                </div>

                {/* Message Display */}
                {message && (
                    <div
                        className={`mb-4 p-2 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleProcess}
                        disabled={!selectedEmployee || !month || !year || loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        Process Payroll
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProcessPayrollModal;