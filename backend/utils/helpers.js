// utils/helpers.ts

/**
 * Generates a unique reference ID for claims in the format CLM-YYYYMMDD-XXXX
 * @returns {string} The generated reference ID
 */
export const generateReferenceId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Generate a random 4-digit number
  const sequence = Math.floor(1000 + Math.random() * 9000)

  return `CLM${year}${month}${day}${sequence}`
}

// Alternative version with counter (if you want sequential numbers)
let counter = 1
export const generateSequentialReferenceId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  // Use a counter that resets daily
  const sequence = String(counter++).padStart(4, '0')
  if (counter > 9999) counter = 1

  return `CLM${year}${month}${day}${sequence}`
}

// If you want to ensure uniqueness by checking the database:
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const generateUniqueReferenceId = async () => {
  let isUnique = false
  let referenceId = ''

  while (!isUnique) {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const sequence = Math.floor(1000 + Math.random() * 9000)

    referenceId = `CLM${year}${month}${day}${sequence}`

    // Check if this ID already exists in the database
    const existingClaim = await prisma.claim.findUnique({
      where: { referenceId }
    })

    if (!existingClaim) {
      isUnique = true
    }
  }

  return referenceId
}
