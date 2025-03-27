import { MPESA_URL } from "../Constants/constants";
import { apiSlice } from "./apiSlice";


export const subscriptionApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) =>({
        makeStkPushRequest: builder.mutation({
            query:({ organisationId ,payload })=>({
            url: `${MPESA_URL}/stk-push-request/${organisationId}`,
            method: "POST",
            body: payload
            }),
            // Transform the response to include subscription info
            transformResponse: (response) => ({
                message: response.message,
                subscription: response.subscription
            }),

        }),
    })
})

export const {
    useMakeStkPushRequestMutation
}=subscriptionApiSlice;