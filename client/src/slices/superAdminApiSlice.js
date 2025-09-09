import { apiSlice } from './apiSlice'

export const superAdminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    saListOrganisations: builder.query({
      query: () => ({ url: '/super-admin/organisations', credentials: 'include' }),
      providesTags: ['sa-organisations']
    }),
    saGetOrganisation: builder.query({
      query: (id) => ({ url: `/super-admin/organisations/${id}`, credentials: 'include' }),
    }),
    saUpdateSubscription: builder.mutation({
      query: ({ id, body }) => ({
        url: `/super-admin/organisations/${id}/subscription`,
        method: 'PATCH',
        body,
        credentials: 'include'
      }),
      invalidatesTags: ['sa-organisations']
    }),
    saCancelSubscription: builder.mutation({
      query: (id) => ({
        url: `/super-admin/organisations/${id}/subscription/cancel`,
        method: 'POST',
        credentials: 'include'
      }),
      invalidatesTags: ['sa-organisations']
    }),
    saListUsers: builder.query({
      query: () => ({ url: '/super-admin/users', credentials: 'include' }),
      providesTags: ['sa-users']
    }),
    saUpdateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/super-admin/users/${id}/role`,
        method: 'PATCH',
        body: { role },
        credentials: 'include'
      }),
      invalidatesTags: ['sa-users']
    }),
    saUpdateUserStatus: builder.mutation({
      query: ({ id, is_active }) => ({
        url: `/super-admin/users/${id}/status`,
        method: 'PATCH',
        body: { is_active },
        credentials: 'include'
      }),
      invalidatesTags: ['sa-users']
    })
  })
})

export const {
  useSaListOrganisationsQuery,
  useSaGetOrganisationQuery,
  useSaUpdateSubscriptionMutation,
  useSaCancelSubscriptionMutation,
  useSaListUsersQuery,
  useSaUpdateUserRoleMutation,
  useSaUpdateUserStatusMutation
} = superAdminApiSlice

