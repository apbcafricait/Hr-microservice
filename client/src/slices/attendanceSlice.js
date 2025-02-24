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
        url: `api/time-attendance/clock-out/${data.employeeId}`,
        method: 'PUT',
        body: data,
      }),
    }),
    getAttendanceRecords: builder.query({
      query: (employeeId) => ({
        url: `api/time-attendance/employee/${employeeId}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceRecordsQuery,
} = attendanceSlice;
