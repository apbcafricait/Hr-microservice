import axios from 'axios'
import expressAsyncHandler from 'express-async-handler'
import {
  getAcessToken,
  getMpesaPassword,
  paymentVerification,
  reduceMpesaMetadata
} from '../utils/mpesaUtil.js'
import moment from 'moment'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()




export const makeStkPushRequest = expressAsyncHandler(async (req, res) => {
  try {
    // Get the access token first
    const {organisationId} = req.params
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
        AccountReference: 'Nexus Subscription',
        TransactionDesc: 'Nexus Subscription'
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
      // Check if the transaction is pending
      if (paymentVerificationResponse?.pending) {
        return res.status(202).json({
          status: 'pending',
          message: paymentVerificationResponse.data,
          checkoutRequestId: CheckoutRequestID
        })
      }
      // If not pending, then it's an error
      return res.status(400).json({
        status: 'error',
        message: 'There was an error completing your payment request'
      })
    }

  if (paymentVerificationResponse.success) {
  // Calculate subscription end date (30 days from now)
  const subscriptionEndDate = new Date()
  subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30)

  // Update organization subscription status and end date
  const updatedOrganisation = await prisma.organisation.update({
    where: {
      id: parseInt(organisationId) 
    },
    data: {
      subscriptionStatus: 'active',
      subscriptionEndDate: subscriptionEndDate
    }
  })
// Log to debug
console.log('Updated Organisation:', updatedOrganisation)

// Fetch the creator manually using createdBy
const creator = await prisma.users.findUnique({
  where: {
    id: updatedOrganisation.createdBy
  }
})

// Log creator to debug
console.log('Creator:', creator)



  // Calculate days remaining
  const now = new Date()
  const daysRemaining = Math.ceil(
    (subscriptionEndDate - now) / (1000 * 60 * 60 * 24)
  )
  // Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Send styled email with subscription details
const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #003087; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 24px;">Apbc Africa - Nexus HR</h1>
        </div>
        <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #f28c38;">Subscription Confirmation</h2>
          <p style="color: #333;">Dear ${
            updatedOrganisation.name
          },</p>
          <p style="color: #333;">Your payment was successful! Here are your subscription details:</p>
          <ul style="list-style: none; padding: 0; color: #333;">
            <li><strong>Organization:</strong> ${updatedOrganisation.name}</li>
            <li><strong>Status:</strong> Active</li>
            <li><strong>End Date:</strong> ${subscriptionEndDate.toLocaleDateString()}</li>
            <li><strong>Days Remaining:</strong> ${daysRemaining}</li>
          </ul>
          <p style="color: #333;">Thank you for subscribing!</p>
          <p style="color: #333;">Regards,<br>The Apbc Africa - Nexus HR Team</p>
        </div>
        <div style="text-align: center; padding: 10px; color: #777;">
          <small>&copy; 2025 Apbc Africa - Nexus HR. All rights reserved.</small>
        </div>
      </div>
    `

const mailOptions = {
  from: `"Apbc Africa - Nexus HR" <${process.env.EMAIL_USER}>`,
  to: creator?.email,
  subject: `Subscription Confirmation for ${updatedOrganisation.name}`,
  html: emailContent // Use HTML instead of plain text
}

try {
  await transporter.sendMail(mailOptions)
  console.log('Subscription email sent successfully')
} catch (emailError) {
  console.error('Error sending email:', emailError)
}

  return res.status(200).json({
    message: 'Payment was successful',
    subscription: {
      status: 'active',
      daysRemaining: daysRemaining,
      endDate: subscriptionEndDate
    }
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
    const { Amount, PhoneNumber, MpesaReceiptNumber, TransactionDate } = reduceMpesaMetadata(mpesaDumpedData)
    console.log('Amount Paid', Amount)
    console.log('PhoneNumber Paying', PhoneNumber)
    console.log('Transaction Date', TransactionDate)
    console.log('Mpesa Receipt', MpesaReceiptNumber)

    // Find the organisation by phone number (or use a better identifier if available)
    const organisation = await prisma.organisation.findFirst({
      where: { mpesaPhone: PhoneNumber }
    });

    if (organisation) {
      // Update subscription status and end date
      const subscriptionEndDate = new Date();
      subscriptionEndDate.setDate(subscriptionEndDate.getDate() + 30);

      await prisma.organisation.update({
        where: { id: organisation.id },
        data: {
          subscriptionStatus: 'active',
          subscriptionEndDate: subscriptionEndDate
        }
      });
      console.log('Organisation subscription updated after payment');
    }

    res.status(200).json({ message: 'Callback processed' });
  } catch (error) {
    console.log(`Error in Callback Function :${error}`)
    return res.status(500).json({ message: 'Error in callback function' })
  }
})
