import { LEAVE_TYPES } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const leaveTypeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all leave types
    getLeaveTypes: builder.query({
      query: ({ organisationId }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

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
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

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
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

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
  }),
});

export const {
  useGetLeaveTypesQuery,
  useGetLeaveTypeQuery,
  useCreateLeaveTypeMutation,
} = leaveTypeApiSlice;