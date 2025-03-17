import { REPORT_TO_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const reportsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all reports with pagination and optional filtering by employeeId or organisationId
    getAllReports: builder.query({
      query: ({ page = 1, limit = 10, employeeId, organisationId }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (employeeId) queryParams.append("employeeId", employeeId);
        if (organisationId) queryParams.append("organisationId", organisationId);

        return {
          url: `${REPORT_TO_URL}?${queryParams.toString()}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["Reports"],
    }),

    // Create a new report
    createReport: builder.mutation({
      query: (reportData) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${REPORT_TO_URL}`,
          method: "POST",
          body: reportData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Reports"],
    }),

    // Update an existing report
    updateReport: builder.mutation({
      query: ({ id, updatedData }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${REPORT_TO_URL}/${id}`,
          method: "PUT",
          body: updatedData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["Reports"],
    }),

    // Delete a report
    deleteReport: builder.mutation({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${REPORT_TO_URL}/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["Reports"],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllReportsQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportsApiSlice;
