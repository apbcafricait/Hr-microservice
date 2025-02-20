import React from 'react';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';

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

const PayrollSummary = ({ data }) => {
    const summaryData = {
        totalProcessed: data?.payrolls.length || 0,
        totalAmount: data?.payrolls?.reduce((acc, curr) => acc + curr.grossSalary, 0) || 0,
        averageSalary: data?.payrolls?.length
            ? (data.payrolls.reduce((acc, curr) => acc + curr.grossSalary, 0) / data.payrolls.length)
            : 0,
        monthProcessed: data?.payrolls?.[0]?.monthYear
            ? new Date(data.payrolls[0].monthYear).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : '-'
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SummaryCard
                title="Total Processed"
                value={summaryData.totalProcessed}
                icon={Users}
                color="text-blue-600"
            />
            <SummaryCard
                title="Total Amount"
                value={`KES ${summaryData.totalAmount.toLocaleString()}`}
                icon={DollarSign}
                color="text-green-600"
            />
            <SummaryCard
                title="Average Salary"
                value={`KES ${summaryData.averageSalary.toLocaleString()}`}
                icon={TrendingUp}
                color="text-purple-600"
            />
            <SummaryCard
                title="Last Processed"
                value={summaryData.monthProcessed}
                icon={Calendar}
                color="text-orange-600"
            />
        </div>
    );
};

export default PayrollSummary;