import { apiSlice } from '../slices/apiSlice';

export const attendanceSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    clockIn: builder.mutation({
      query: (data) => ({
        url: 'api/time-attendance/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, data) => [{ type: 'Attendance', id: data.employeeId }],
    }),
    clockOut: builder.mutation({
      query: (attendanceId) => ({
        url: `api/time-attendance/clock-out/${attendanceId}`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, attendanceId) => [
        { type: 'Attendance', id: 'LIST' }, // Broad invalidation; adjust if employeeId is available
      ],
    }),
    getAttendanceRecords: builder.query({
      query: (organisationId) => `api/time-attendance/organisation/${organisationId}`,
      providesTags: ['Attendance'],
    }),
    getAttedanceOfEmployee: builder.query({
      query: (employeeId) => `api/time-attendance/${employeeId}`,
      method: 'GET',
      providesTags: (result, error, employeeId) => [{ type: 'Attendance', id: employeeId }],
    }),
  }),
});

export const {
  useClockInMutation,
  useClockOutMutation,
  useGetAttendanceRecordsQuery,
  useGetAttedanceOfEmployeeQuery,
} = attendanceSlice;