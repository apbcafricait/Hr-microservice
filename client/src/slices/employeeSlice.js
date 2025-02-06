// src/redux/slices/employeeApiSlice.js
import { apiSlice } from './apiSlice';
import { EMPLOYEE_URL } from '../Constants/constants';

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all employees with pagination, filtering, and searching
    getAllEmployees: builder.query({
      query: ({ page = 1, limit = 10, organisationId, search = '' }) => ({
        url: `${EMPLOYEE_URL}`,
        method: 'GET',
        params: {
          page,
          limit,
          organisationId,
          search,
        },
      }),
      providesTags: ['Employee'],
      transformResponse: (response) => {
        return response.data;
      },
    }),

    // Fetch a single employee by ID
    getEmployee: builder.query({
      query: (id) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: 'GET',
      }),
      providesTags: ['Employee'],
    }),

    // Create a new employee
    createEmployee: builder.mutation({
      query: (newEmployee) => ({
        url: `${EMPLOYEE_URL}`,
        method: 'POST',
        body: newEmployee,
      }),
      invalidatesTags: ['Employee'],
    }),

    // Update an existing employee
    updateEmployee: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: 'PUT',
        body: updateData,
      }),
      invalidatesTags: ['Employee'],
    }),

    // Delete an employee
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employee'],
    }),

    // Get employees by organisation
    getEmployeesByOrganisation: builder.query({
      query: (organisationId) => ({
        url: `${EMPLOYEE_URL}/organisation/${organisationId}`,
        method: 'GET',
      }),
      providesTags: ['Employee'],
    }),

    // Get employee statistics
    getEmployeeStats: builder.query({
      query: (organisationId) => ({
        url: `${EMPLOYEE_URL}/stats/${organisationId}`,
        method: 'GET',
      }),
      providesTags: ['Employee'],
    }),
  }),
});

// Export hooks for each endpoint
export const {
  useGetAllEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesByOrganisationQuery,
  useGetEmployeeStatsQuery,
} = employeeApiSlice;