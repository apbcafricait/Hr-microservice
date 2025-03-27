import { apiSlice } from './apiSlice';

export const organizationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: '/api/organisations',
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    getOrganisationById: builder.query({
    query: (id) => `/api/organisations/${id}`,
}),
    getOrganizations: builder.query({
      query: () => '/api/organisations',
      // Corrected transformResponse: Access the 'organisations' array
      transformResponse: (response) => response.data.organisations,
    }),
    updateOrganization: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/api/organisations/${id}`,
        method: 'PUT',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
    deleteOrganization: builder.mutation({
      query: (id) => ({
        url: `/api/organisations/${id}`,
        method: 'DELETE',
      }),
      transformResponse: (response) => response.data,
      transformErrorResponse: (response) => response.data,
    }),
  }),

  // Get a single organisation by id
 
});

export const {
  useCreateOrganizationMutation,
  useGetOrganizationsQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useGetOrganisationByIdQuery,
} = organizationSlice;
