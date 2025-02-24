import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const BulkPayrollModal = ({ isOpen, onClose, onProcess, organisationId }) => {
    const [monthYear, setMonthYear] = useState(''); // Local state for input
    const [message, setMessage] = useState(null); // Success/Error message
    const [loading, setLoading] = useState(false); // Loading state

    if (!isOpen) return null;

    const handleProcess = async () => {
        if (!monthYear) {
            setMessage({ type: 'error', text: 'Please select a month and year' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const result = await onProcess({ monthYear, organisationId });
            console.log('Bulk Process Response:', result);
            if (result.status === 'success') {
                setMessage({
                    type: 'success',
                    text: 'Bulk payroll processed successfully!',
                });
            } else {
                setMessage({
                    type: 'error',
                    text: result.message || 'Unknown error occurred',
                });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to process bulk payroll',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Process Bulk Payroll</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Month-Year Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Month-Year
                    </label>
                    <input
                        type="month"
                        value={monthYear}
                        onChange={(e) => setMonthYear(e.target.value)} // e.g., "2025-03"
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        required
                    />
                </div>

                {/* Message Display */}
                {message && (
                    <div
                        className={`mb-4 p-2 rounded text-sm ${message.type === 'success'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Buttons */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleProcess}
                        disabled={loading || !monthYear}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Process Bulk
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BulkPayrollModal;