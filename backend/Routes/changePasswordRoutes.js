import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma.js';
import authenticatePassword from '../middleware/authenticatePassword.js';

const router = express.Router();

// Route to change password
router.put('/change-password', authenticatePassword(), async (req, res) => {
  const { newPassword, confirmPassword } = req.body;

  // Validate input
  if (!newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password are required' });
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match' });
  }

  try {
    // Validate new password length
    if (newPassword.length < 6 || newPassword.length > 15) {
      return res
        .status(400)
        .json({ message: 'Password must be between 6 and 15 characters' });
    }

    // Hash the new password before saving it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(req.user, hashedPassword);
    // Update the user's password in the database
    await prisma.users.update({
      where: { id: req.user.id },
      data: { password: hashedPassword },
    });

    // Return success response
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error.message);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

export default router;
