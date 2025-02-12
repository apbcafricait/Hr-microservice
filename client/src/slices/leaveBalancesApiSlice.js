import { LEAVE_BAL_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const leaveBalancesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch leave balance for a specific employee
    getLeaveBalance: builder.query({
      query: (employeeId) => `${LEAVE_BAL_URL}/${employeeId}`,
    }),

    // Create leave balance for an employee
    createLeaveBalance: builder.mutation({
      query: ({ employeeId, body }) => ({
        url: `${LEAVE_BAL_URL}/${employeeId}`,
        method: "POST",
        body,
      }),
    }),

    // Update leave balance for an employee
    updateLeaveBalance: builder.mutation({
      query: ({ employeeId, body }) => ({
        url: `${LEAVE_BAL_URL}/${employeeId}`,
        method: "PUT",
        body,
      }),
    }),

    // Deduct leave days from a specific type
    deductLeave: builder.mutation({
      query: ({ employeeId, leaveType, days }) => ({
        url: `${LEAVE_BAL_URL}/${employeeId}/deduct`,
        method: "POST",
        body: { leaveType, days },
      }),
    }),

    // Reset all annual leave balances
    resetAnnualLeave: builder.mutation({
      query: () => ({
        url: `${LEAVE_BAL_URL}/reset-annual`,
        method: "POST",
      }),
    }),

    // Fetch all leave balances with pagination and filtering
    getAllLeaveBalances: builder.query({
      query: ({ page = 1, limit = 10, organisationId = null }) => ({
        url: `${LEAVE_BAL_URL}`,
        method: "GET",
        params: { page, limit, organisationId },
      }),
    }),
  }),
});

export const {
  useGetLeaveBalanceQuery,
  useCreateLeaveBalanceMutation,
  useUpdateLeaveBalanceMutation,
  useDeductLeaveMutation,
  useResetAnnualLeaveMutation,
  useGetAllLeaveBalancesQuery,
} = leaveBalancesApiSlice;
