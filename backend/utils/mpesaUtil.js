import axios from 'axios'
import moment from 'moment'
function usernamePassBase64 (consumer_key, consumer_secret) {
  const base64 = Buffer.from(`${consumer_key}:${consumer_secret}`).toString(
    'base64'
  )
  return base64
}

export function getMpesaPassword (shortCode, passKey, timestamp) {
  let password = Buffer.from(shortCode + passKey + timestamp).toString('base64')
  return password
}

export const reduceMpesaMetadata = metadata =>
  metadata.reduce((result, entry) => {
    const { Name, Value } = entry
    result[Name] = Value
    return result
  }, {})

export const paymentVerification = async CheckoutRequestID => {
  console.log('Payment verification started...')
  let attempts = 0;
  const maxAttempts = 5; // Reduce to 5 attempts to avoid rate limiting
  
  while (attempts < maxAttempts) {
    // Wait longer between attempts to avoid rate limiting
    if (attempts > 0) {
      await new Promise(resolve => setTimeout(resolve, 12000)); // Wait 12 seconds between attempts
    }
    try {
      const timestamp = moment().format('YYYYMMDDHHmmss')
      const password = getMpesaPassword(
        process.env.SHORT_CODE,
        process.env.MPESA_EXPRESS_PASSKEY,
        timestamp
      )
      let token = await getAcessToken()
      const response = await axios.post(
        process.env.STK_PUSH_QUERY,
        {
          BusinessShortCode: process.env.SHORT_CODE,
          Password: password,
          Timestamp: timestamp,
          CheckoutRequestID: CheckoutRequestID
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      console.log('Query Response', response.data)
      
      if (response.data.ResponseCode === '0') {
        // ResultCode 0 means success
        if (response.data.ResultCode === '0') {
          console.log('Payment successful')
          return { success: true, data: response.data }
        }
        // ResultCode 4999 means pending
        else if (response.data.ResultCode === '4999') {
          console.log('Payment still pending...')
          attempts++
        }
        // Any other ResultCode is a failure
        else {
          return { success: false, data: response.data.ResultDesc }
        }
      }
    } catch (error) {
      console.log('Error in payment verification:', error.response?.data || error.message)
      attempts++
    }
    await new Promise(resolve => setTimeout(resolve, 3000)) // Wait 3 seconds between attempts
  }
  
  // If we reach here, the transaction is still pending after all attempts
  return { 
    success: false, 
    pending: true, 
    data: 'Transaction is still being processed. Please check your phone for the STK push prompt and complete the payment.'
  }
}

export const getAcessToken = async () => {
  try {
    // get the auth token
    const auth = usernamePassBase64(
      process.env.CONSUMER_KEY,
      process.env.CONSUMER_SECRET
    )

    const response = await axios.get(
      process.env.AUTH_LINK,

      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${auth}`
        }
      }
    )
    return response.data.access_token
  } catch (error) {
    console.log(`There was an error in genarating acces_token:${error}`)
  }
}
