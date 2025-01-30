import axios from 'axios'
import expressAsyncHandler from 'express-async-handler'
import {
  getAcessToken,
  getMpesaPassword,
  paymentVerification,
  reduceMpesaMetadata
} from '../utils/mpesaUtil.js'
import moment from 'moment'

export const makeStkPushRequest = expressAsyncHandler(async (req, res) => {
  try {
    // Get the access token first
    let { phoneNumber, amount } = req.body
    phoneNumber = parseFloat(phoneNumber)
    amount = parseFloat(amount)
    console.log(phoneNumber, amount, 'phone number and amount')

    const timestamp = moment().format('YYYYMMDDHHmmss')
    const password = getMpesaPassword(
      process.env.SHORT_CODE,
      process.env.MPESA_EXPRESS_PASSKEY,
      timestamp
    )
    console.log(password, 'password needed for payment')
    let token = await getAcessToken()
    console.log(token, 'token for request')
    const response = await axios.post(
      process.env.STK_LINK,

      {
        BusinessShortCode: process.env.SHORT_CODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phoneNumber,
        PartyB: process.env.SHORT_CODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.APP_DOMAIN}/mpesa/stk-push/callback`,
        AccountReference: 'BigManComputers Payment',
        TransactionDesc: 'BigManComputers Payment'
      },
      {
        headers: {
          Authorization: ` Bearer ${token}`
        }
      }
    )
    const CheckoutRequestID = response.data.CheckoutRequestID
    console.log('CheckoutRequestID', CheckoutRequestID)
    const paymentVerificationResponse = await paymentVerification(
      CheckoutRequestID
    )
    if (!paymentVerificationResponse || !paymentVerificationResponse.success) {
      res.status(400).json({
        message: 'There was an error completing your payment request'
      })
      // DB LOGIC
      console.log('error verifying payment')
    }
    if (paymentVerificationResponse.success) {
      // DB Logic
      console.log('Payment success')
      return res.status(200).json({
        message: 'Payment was successful'
      })
    }
  } catch (error) {
    console.log(`Error in making stk push request :${error}`)
    return res.status(500).json({
      message: 'There was an error in completing your payment request'
    })
  }
})

export const stkCallBackUrl = expressAsyncHandler(async (req, res) => {
  try {
    console.log('This callback function was called.....')
    console.log('################### MPESA CALLBACK ###############')
    console.log(req.body.Body)
    console.log('################### MPESA CALLBACK ###############')
    const mpesaDumpedData = req.body.Body.stkCallback.CallbackMetadata.Item
    const { Amount, PhoneNumber, MpesaReceiptNumber, TransactionDate } =
      reduceMpesaMetadata(mpesaDumpedData)
    console.log('Amount Paid', Amount)
    console.log('PhoneNumber Paying', PhoneNumber)
    console.log('Transaction Date', TransactionDate)
    console.log('Mpesa Receipt', MpesaReceiptNumber)
    // Transaction table update
  } catch (error) {
    console.log(`Error in Callback Function :${error}`)
    return res.status(500).json({ message: 'Error in callback function' })
  }
})
