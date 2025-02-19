import { CONTACT_DETAILS_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const contactDetailsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all employee contacts with pagination and optional filtering by employeeId
    getAllEmployeeContacts: builder.query({
      query: ({ page = 1, limit = 10, employeeId }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        const queryParams = new URLSearchParams();
        if (page) queryParams.append("page", page);
        if (limit) queryParams.append("limit", limit);
        if (employeeId) queryParams.append("employeeId", employeeId);

        return {
          url: `${CONTACT_DETAILS_URL}?${queryParams.toString()}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ["ContactDetails"],
    }),

    // Create a new employee contact record
    createEmployeeContact: builder.mutation({
      query: (contactData) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${CONTACT_DETAILS_URL}`,
          method: "POST",
          body: contactData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["ContactDetails"],
    }),

    // Update an existing employee contact record
    updateEmployeeContact: builder.mutation({
      query: ({ id, updatedData }) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${CONTACT_DETAILS_URL}/${id}`,
          method: "PUT",
          body: updatedData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      },
      invalidatesTags: ["ContactDetails"],
    }),

    // Delete an employee contact record
    deleteEmployeeContact: builder.mutation({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const token = userInfo?.token;

        return {
          url: `${CONTACT_DETAILS_URL}/${id}`,
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ["ContactDetails"],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllEmployeeContactsQuery,
  useCreateEmployeeContactMutation,
  useUpdateEmployeeContactMutation,
  useDeleteEmployeeContactMutation,
} = contactDetailsApiSlice;