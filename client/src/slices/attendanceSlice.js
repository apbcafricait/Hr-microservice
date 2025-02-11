import { apiSlice } from './apiSlice'; 

export const attendanceApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        clockIn: builder.mutation({
            query: (data)=>({
                url: '/api//time-attendance/create',
                method: 'POST',
                body: data
            }),
        }),

        // clock out
    })
})

export const {useClockInMutation} = attendanceApiSlice;