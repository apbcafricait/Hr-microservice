import { RECRUITMENT_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";

export const recruitmentApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Candidates
    getAllCandidates: builder.query({
      query: () => ({
        url: `${RECRUITMENT_URL}/candidates`,
        method: "GET",
      }),
    }),
    getCandidate: builder.query({
      query: (id) => ({
        url: `${RECRUITMENT_URL}/candidates/${id}`,
        method: "GET",
      }),
    }),
    createCandidate: builder.mutation({
      query: (candidateData) => ({
        url: `${RECRUITMENT_URL}/candidates`,
        method: "POST",
        body: candidateData,
      }),
    }),
    updateCandidate: builder.mutation({
      query: ({ id, ...candidateData }) => ({
        url: `${RECRUITMENT_URL}/candidates/${id}`,
        method: "PUT",
        body: candidateData,
      }),
    }),
    deleteCandidate: builder.mutation({
      query: (id) => ({
        url: `${RECRUITMENT_URL}/candidates/${id}`,
        method: "DELETE",
      }),
    }),

    // Vacancies
    getAllVacancies: builder.query({
      query: () => ({
        url: `${RECRUITMENT_URL}/vacancies`,
        method: "GET",
      }),
    }),
    getVacancy: builder.query({
      query: (id) => ({
        url: `${RECRUITMENT_URL}/vacancies/${id}`,
        method: "GET",
      }),
    }),
    createVacancy: builder.mutation({
      query: (vacancyData) => ({
        url: `${RECRUITMENT_URL}/vacancies`,
        method: "POST",
        body: vacancyData,
      }),
    }),
    updateVacancy: builder.mutation({
      query: ({ id, ...vacancyData }) => ({
        url: `${RECRUITMENT_URL}/vacancies/${id}`,
        method: "PUT",
        body: vacancyData,
      }),
    }),
    deleteVacancy: builder.mutation({
      query: (id) => ({
        url: `${RECRUITMENT_URL}/vacancies/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllCandidatesQuery,
  useGetCandidateQuery,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useGetAllVacanciesQuery,
  useGetVacancyQuery,
  useCreateVacancyMutation,
  useUpdateVacancyMutation,
  useDeleteVacancyMutation,
} = recruitmentApiSlice;
