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
      query: (attendanceId) => ({
        url: `api/time-attendance/clock-out/${attendanceId}`,
        method: 'PUT',
      }),
    }),
    getAttendanceRecords: builder.query({
      query: (organisationId) => `api/time-attendance/organisation/${organisationId}`,
    }),
    getAttedanceOfEmployee: builder.query({
      query: (employeeId) => `api/time-attendance/${employeeId}`,
      method: 'GET',
    })
  }),
});

export const { 
  useClockInMutation, 
  useClockOutMutation, 
  useGetAttendanceRecordsQuery, 
  useGetAttedanceOfEmployeeQuery 
} = attendanceSlice;