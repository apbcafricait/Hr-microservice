import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma.js'; // Adjust path as needed

export const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword, confirmPassword } = req.body;

  // Ensure new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'New password and confirm password do not match.' });
  }

  try {
    // Fetch the user from the database using the provided userId
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await prisma.users.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};
