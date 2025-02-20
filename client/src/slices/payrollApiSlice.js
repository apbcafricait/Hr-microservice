import { PAYROLL_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const payrollApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        processPayrollforSingleEmployee: builder.mutation({
                query: () =>({
                url: `${PAYROLL_URL}/process/process-payroll-for-single-employee`,
                method: "POST",
        }),

        }),
        processBulkPayroll: builder.mutation({
            query: () =>({
                url: `${PAYROLL_URL}/process/bulk`,
                method: "POST",
        }),

        }),
        getEmployeePayrollHistory: builder.query({
            query: (employeeId) =>({
                url: `${PAYROLL_URL}/employee/${employeeId}/history`,
                method: "GET",
        }),
        }),
        downloadPayslip: builder.query({
            query: (payrollId) =>({
                url: `${PAYROLL_URL}/download-payslip/${payrollId}`,
                method: "GET",
        })
    })
            
}),
})
export const {
    useDownloadPayslipQuery,
    useGetEmployeePayrollHistoryQuery,
    useProcessBulkPayrollMutation,
    useProcessPayrollforSingleEmployeeMutation

}=payrollApiSlice
