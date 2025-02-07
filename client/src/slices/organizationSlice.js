import { apiSlice } from './apiSlice';

export const organizationSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrganization: builder.mutation({
      query: (data) => ({
        url: '/api/organisations', // Make sure this matches your backend endpoint
        method: 'POST',
        body: {
          name: data.name,
          subdomain: data.subdomain,
          mpesaPhone: data.mpesaPhone,
          managerEmail: data.managerEmail
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      transformResponse: (response) => {
        return response.data;
      },
      transformErrorResponse: (response) => {
        return response.data;
      },
    }),
    getOrganizations: builder.query({
      query: () => '/api/organisations',
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { 
  useCreateOrganizationMutation,
  useGetOrganizationsQuery 
} = organizationSlice;