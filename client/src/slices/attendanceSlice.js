import { apiSlice } from '../features/api/apiSlice';

export const attendanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    clockIn: builder.mutation({
      query: (data) => ({
        url: 'api/time-attendance/create',
        method: 'POST',
        body: data,
      }),
    }),
    clockOut: builder.mutation({
      query: (data) => ({
        url: 'api/time-attendance/clock-out/3',
        method: 'PUT',
        body: data,
      }),
    }),
  }),
});

export const { useClockInMutation, useClockOutMutation } = attendanceApiSlice;