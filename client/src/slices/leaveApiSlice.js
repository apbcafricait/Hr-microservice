import { LEAVE_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const leaveApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllLeaveRequests: builder.query({
      query: () => ({
          url: `${LEAVE_URL}/get-all-leave-requests`,
          method: "GET",
    }),
    }),

    // Fetch a single leave request by ID
    getLeaveRequest: builder.query({
      query: (id) => ({
        url: `${LEAVE_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Create a new leave request
    createLeaveRequest: builder.mutation({
      query: (body) => ({
        url: `${LEAVE_URL}/create-leave-request`,
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
