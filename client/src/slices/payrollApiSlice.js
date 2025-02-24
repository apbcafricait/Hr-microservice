import { PAYROLL_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const payrollApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
       processPayrollforSingleEmployee: builder.mutation({
            query: ({ employeeId, monthYear }) => ({
                url: `${PAYROLL_URL}/process/employee/${employeeId}`,
                method: 'POST',
                body: { monthYear },
            }),

        }),
         processBulkPayroll: builder.mutation({
            query: ({ monthYear, organisationId }) => ({
                url: `${PAYROLL_URL}/process/bulk`, // Adjust URL as per your API
                method: 'POST',
                body: { monthYear, organisationId }, // Send directly in body
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
        }),
    }),
        getOrganisationSummaries: builder.query({
            query:(organisationId) =>({
                url: `${PAYROLL_URL}/summaries/organisation/${organisationId}`,
                method: "GET",
            })
        }),
        getDepartmentPayrollSummary: builder.query({
            query:(organisationId,departmentId) =>({
                url: `${PAYROLL_URL}/summaries/${organisationId}/${departmentId}`,
                method: "GET",
            })
        }),

    })
            
})

export const {
    useDownloadPayslipQuery,
    useGetEmployeePayrollHistoryQuery,
    useProcessBulkPayrollMutation,
    useProcessPayrollforSingleEmployeeMutation,
    useGetOrganisationSummariesQuery,
    useGetDepartmentPayrollSummaryQuery

}=payrollApiSlice
