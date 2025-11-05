// utils/helpers.ts

/**
 * Generates a sequential reference ID for claims in the format CLMYYYYMMDDXXXX
 * Example: CLM20250728-0001
 * Counter resets at 9999 or manually per day if needed
 * @returns {string} The generated reference ID
 */
let counter = 1
export const generateSequentialReferenceId = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  const sequence = String(counter++).padStart(4, '0')
  if (counter > 9999) counter = 1

  return `CLM${year}${month}${day}${sequence}`
}

/**
 * [Deprecated] Generates a reference ID using random 4-digit suffix
 * Not used in current system. Kept for legacy fallback or testing.
 */
// export const generateReferenceId = () => {
//   const date = new Date()
//   const year = date.getFullYear()
//   const month = String(date.getMonth() + 1).padStart(2, '0')
//   const day = String(date.getDate()).padStart(2, '0')

//   const sequence = Math.floor(1000 + Math.random() * 9000)
//   return `CLM${year}${month}${day}${sequence}`
// }

/**
 * [Deprecated] Generates a reference ID while checking for uniqueness in the database
 * Not currently used due to performance trade-offs; preserved for future high-traffic enhancements.
 */
// import { PrismaClient } from '@prisma/client'
// const prisma = new PrismaClient()

// export const generateUniqueReferenceId = async () => {
//   let isUnique = false
//   let referenceId = ''

//   while (!isUnique) {
//     const date = new Date()
//     const year = date.getFullYear()
//     const month = String(date.getMonth() + 1).padStart(2, '0')
//     const day = String(date.getDate()).padStart(2, '0')
//     const sequence = Math.floor(1000 + Math.random() * 9000)

//     referenceId = `CLM${year}${month}${day}${sequence}`

//     const existingClaim = await prisma.claim.findUnique({
//       where: { referenceId }
//     })

//     if (!existingClaim) {
//       isUnique = true
//     }
//   }

//   return referenceId
// }