import { LEAVE_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all leave requests
    getAllLeaveRequests: builder.query({
      query: ({ page = 1, limit = 10, employeeId = null }) => ({
        url: `${LEAVE_URL}`,
        method: "GET",
        params: { page, limit, employeeId },
      }),
    }),

    // Fetch a single leave request by ID
    getLeaveRequest: builder.query({
      query: (id) => `${LEAVE_URL}/${id}`,
    }),

    // Create a new leave request
    createLeaveRequest: builder.mutation({
      query: (body) => ({
        url: `${LEAVE_URL}`,
        method: "POST",
        body,
      }),
    }),

    // Update an existing leave request
    updateLeaveRequest: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${LEAVE_URL}/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // Delete a leave request
    deleteLeaveRequest: builder.mutation({
      query: (id) => ({
        url: `${LEAVE_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllLeaveRequestsQuery,
  useGetLeaveRequestQuery,
  useCreateLeaveRequestMutation,
  useUpdateLeaveRequestMutation,
  useDeleteLeaveRequestMutation,
} = leaveApiSlice;
