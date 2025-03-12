import { LEAVE_TYPES } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const leaveTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all leave types
    getLeaveTypes: builder.query({
      query: ({ organisationId }) => {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        return {
          url: `${LEAVE_TYPES}?organisationId=${organisationId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["LeaveType"],
    }),

    // Fetch a single leave type by ID
    getLeaveType: builder.query({
      query: ({ id, organisationId }) => {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        return {
          url: `${LEAVE_TYPES}/${id}?organisationId=${organisationId}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["LeaveType"],
    }),

    // Create a new leave type
    createLeaveType: builder.mutation({
      query: (leaveTypeData) => {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        return {
          url: LEAVE_TYPES,
          method: "POST",
          body: leaveTypeData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["LeaveType"],
    }),

    // Update a leave type
    updateLeaveType: builder.mutation({
      query: ({ id, organisationId, ...updateData }) => {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        return {
          url: `${LEAVE_TYPES}/${id}?organisationId=${organisationId}`,
          method: "PUT",
          body: updateData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["LeaveType"],
    }),

    // Delete a leave type
    deleteLeaveType: builder.mutation({
      query: ({ id, organisationId }) => {
        const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

        return {
          url: `${LEAVE_TYPES}/${id}?organisationId=${organisationId}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["LeaveType"],
    }),
  }),
});

export const {
  useGetLeaveTypesQuery,
  useGetLeaveTypeQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation,
} = leaveTypeApiSlice;
