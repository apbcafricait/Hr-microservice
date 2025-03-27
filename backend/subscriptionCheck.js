import cron from 'node-cron'
import { PrismaClient } from '@prisma/client'
import nodemailer from 'nodemailer'

const prisma = new PrismaClient()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Run every day at midnight
cron.schedule('0 0 * * *', async () => {
  try {
    const now = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(now.getDate() + 3)

    // 1. Check for expired subscriptions
    const expiredOrganisations = await prisma.organisation.findMany({
      where: {
        subscriptionStatus: 'active',
        subscriptionEndDate: {
          lte: now
        }
      }
    })

    for (const org of expiredOrganisations) {
      await prisma.organisation.update({
        where: { id: org.id },
        data: { subscriptionStatus: 'inactive' }
      })
      console.log(
        `Subscription for ${org.name} (ID: ${org.id}) set to inactive`
      )
    }

    // 2. Check for subscriptions with 3 days remaining
    const nearingExpiry = await prisma.organisation.findMany({
      where: {
        subscriptionStatus: 'active',
        subscriptionEndDate: {
          lte: threeDaysFromNow,
          gte: now
        }
      },
      include: {
        creator: true
      }
    })

    for (const org of nearingExpiry) {
      const daysRemaining = Math.ceil(
        (org.subscriptionEndDate - now) / (1000 * 60 * 60 * 24)
      )

      if (daysRemaining <= 3) {
        const emailContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
            <div style="background-color: #003087; padding: 20px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 24px;">Apbc Africa - Nexus HR</h1>
            </div>
            <div style="background-color: white; padding: 20px; border-radius: 0 0 8px 8px;">
              <h2 style="color: #f28c38;">Subscription Expiry Reminder</h2>
              <p style="color: #333;">Dear ${
                org.creator.email.split('@')[0]
              },</p>
              <p style="color: #333;">This is a reminder that your subscription for ${
                org.name
              } will expire in ${daysRemaining} day(s) on ${org.subscriptionEndDate.toLocaleDateString()}.</p>
              <p style="color: #333;">Please renew your subscription to avoid interruption.</p>
              <p style="color: #333;">Regards,<br>The Apbc Africa - Nexus HR Team</p>
            </div>
            <div style="text-align: center; padding: 10px; color: #777;">
              <small>&copy; 2025 Apbc Africa - Nexus HR. All rights reserved.</small>
            </div>
          </div>
        `

        const mailOptions = {
          from: `"Apbc Africa - Nexus HR" <${process.env.EMAIL_USER}>`,
          to: org.creator.email,
          subject: `Reminder: ${org.name} Subscription Expiring Soon`,
          html: emailContent
        }

        await transporter.sendMail(mailOptions)
        console.log(
          `Reminder email sent to ${org.creator.email} for ${org.name}`
        )
      }
    }
  } catch (error) {
    console.error('Error in subscription check:', error)
  } finally {
    await prisma.$disconnect()
  }
})

console.log('Subscription status and reminder checker scheduled')
