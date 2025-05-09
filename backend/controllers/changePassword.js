import bcrypt from 'bcryptjs'
import prisma from "../../db/prisma.js";

// Change password controller
export const changePassword = async (req, res) => {
  try {
    // Validate request body
    const { userId,currentPassword, newPassword } = req.body

    // Fetch user
    const user = await prisma.users.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password and optionally track last updated time
    await prisma.users.update({
      where: { id: userId },
      data: {
        password_hash: hashedPassword
      }
    })

    return res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res
        .status(400)
        .json({ message: 'Validation error', errors: error.errors })
    }
    // Log error with a proper logger in production
    console.error('Error changing password:', error)
    return res.status(500).json({ message: 'Server error' })
  } finally {
    await prisma.$disconnect() 
  }
}

