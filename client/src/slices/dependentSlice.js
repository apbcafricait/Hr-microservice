import { apiSlice } from "./apiSlice";
import { DEPENDENTS_URL } from "../Constants/constants";

// Define the endpoints for the Dependent API
export const dependentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all dependents for a specific employee
    getEmployeeDependents: builder.query({
      query: (employeeId) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${DEPENDENTS_URL}/employee/${employeeId}`, // Use DEPENDENTS_URL
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: (result, error, employeeId) => [
        { type: 'Dependent', id: employeeId },
      ],
    }),

    // Fetch a single dependent by ID
    getDependent: builder.query({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${DEPENDENTS_URL}/${id}`, // Use DEPENDENTS_URL
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      providesTags: ['Dependent'],
    }),

    // Create a new dependent
    createDependent: builder.mutation({
      query: (dependentData) => ({
        url: `${DEPENDENTS_URL}/`,
          method: "POST",
          body: dependentData,
    }),
  }),

    // Update a dependent
    updateDependent: builder.mutation({
      query: ({ id, dependentData }) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${DEPENDENTS_URL}/${id}`, // Use DEPENDENTS_URL
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: dependentData,
        };
      },
      invalidatesTags: ['Dependent'],
    }),

    // Delete a dependent
    deleteDependent: builder.mutation({
      query: (id) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        const token = userInfo?.token;

        return {
          url: `${DEPENDENTS_URL}/${id}`, // Use DEPENDENTS_URL
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
      invalidatesTags: ['Dependent'],
    }),
  }),
});

export const {
  useGetEmployeeDependentsQuery,
  useGetDependentQuery,
  useCreateDependentMutation,
  useUpdateDependentMutation,
  useDeleteDependentMutation,
} = dependentApiSlice;