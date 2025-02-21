import React from 'react';
import { X } from 'lucide-react';

const PDFViewer = ({ isOpen, onClose, pdfUrl }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Payslip Preview</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="h-[calc(100%-4rem)]">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full rounded-lg"
                        title="Payslip Preview"
                    />
                </div>
            </div>
        </div>
    );
};

export default PDFViewer;
