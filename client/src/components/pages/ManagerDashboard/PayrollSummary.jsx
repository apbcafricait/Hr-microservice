import React from 'react';
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { useGetOrganisationSummariesQuery, useGetDepartmentPayrollSummaryQuery } from '../../../slices/payrollApiSlice';
const SummaryCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
            <div className={`p-3 rounded-full ${color} bg-opacity-10 mr-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <div>
                <p className="text-sm text-gray-600">{title}</p>
                <p className="text-2xl font-semibold">{value}</p>
            </div>
        </div>
    </div>
);

const PayrollSummary = ({summaryData}) => {

   
    const totalDeductions = summaryData?.data?.totalDeductions
    const totalDeductionsSum =
        (totalDeductions?.paye) +
        (totalDeductions?.nssf) +
        (totalDeductions?.housingLevy);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
                title="Total Processed"
                value={summaryData?.data.processedPayrolls}
                icon={Users}
                color="text-blue-600"
            />
            <SummaryCard
                title="Total Amount"
                value={`KES ${summaryData?.data.totalGrossSalary.toLocaleString()}`}
                icon={DollarSign}
                color="text-green-600"
            />
            <SummaryCard
                title="Average Salary"
                value={`KES ${summaryData?.data.averageSalary.toLocaleString()}`}
                icon={TrendingUp}
                color="text-purple-600"
            />

            <SummaryCard
                title="Total Deductions"
                value={`KES ${totalDeductionsSum.toLocaleString()}`}
                icon={TrendingDown}
                color="text-red-600"
            />
        </div>
    );
};

export default PayrollSummary;