import { EMPLOYEE_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const employeeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    
    // Fetch all employees
    getAllEmployees: builder.query({
      query: ({ page = 1, limit = 10, organisationId, search = '' }) => ({
        url: `${EMPLOYEE_URL}`,
        method: "GET",
        params: { page, limit, organisationId, search },
      }),
    }),

    // Fetch a single employee by ID
    getEmployee: builder.query({
      query: (id) => `${EMPLOYEE_URL}/${id}`,
    }),

    // Create a new employee
    createEmployee: builder.mutation({
      query: (body) => ({
        url: `${EMPLOYEE_URL}`,
        method: "POST",
        body,
      }),
    }),

    // Update an existing employee
    updateEmployee: builder.mutation({
      query: ({ id, body }) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // Delete an employee
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `${EMPLOYEE_URL}/${id}`,
        method: "DELETE",
      }),
    }),

    // Get employees by organisation
    getEmployeesByOrganisation: builder.query({
      query: (organisationId) => `${EMPLOYEE_URL}/organisation/${organisationId}`,
    }),

    // Get employee statistics
    getEmployeeStats: builder.query({
      query: (organisationId) => `${EMPLOYEE_URL}/stats/${organisationId}`,
    }),
  }),
});

export const {
  useGetAllEmployeesQuery,
  useGetEmployeeQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useGetEmployeesByOrganisationQuery,
  useGetEmployeeStatsQuery,
} = employeeApiSlice;
