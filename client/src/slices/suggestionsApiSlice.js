import { apiSlice } from "./apiSlice";
import { SUGGESTIONS_URL } from "../Constants/constants";

export const suggestionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Fetch all suggestions with pagination and optional filtering by organisationId
    getAllSuggestions: builder.query({
      query: () => ({
        url: `${SUGGESTIONS_URL}/get-all-suggestions`,
        method: "GET",
         
      }),
    }),

    // Fetch a single suggestion by ID
    getSuggestion: builder.query({
      query: (id) => ({
        url: `${SUGGESTIONS_URL}/${id}`,
        method: "GET",
      }),
    }),

    // Create a new suggestion
    createSuggestion: builder.mutation({
      query: (body) => ({
        url: `${SUGGESTIONS_URL}/create-suggestion`,
        method: "POST",
        body,
      }),
    }),

    // Update an existing suggestion
    updateSuggestion: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${SUGGESTIONS_URL}/${id}`,
        method: "PUT",
        body,
      }),
    }),

    // Delete a suggestion
    deleteSuggestion: builder.mutation({
      query: (id) => ({
        url: `${SUGGESTIONS_URL}/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllSuggestionsQuery,
  useGetSuggestionQuery,
  useCreateSuggestionMutation,
  useUpdateSuggestionMutation,
  useDeleteSuggestionMutation,
} = suggestionsApiSlice;
