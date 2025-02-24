import { apiSlice } from '../slices/apiSlice';

export const attendanceSlice = apiSlice.injectEndpoints({
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
    getAttendanceRecords: builder.query({
      query: (organisationId) => `api/time-attendance/organisation/${organisationId}`,
    }),
  }),
});

export const { useClockInMutation, useClockOutMutation, useGetAttendanceRecordsQuery } = attendanceSlice;