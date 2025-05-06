import bcrypt from 'bcryptjs';
import prisma from '../../db/prisma.js'; // Assuming you're using Prisma for DB

// Middleware to authenticate the password when changing it
const authenticatePassword = () => {
  return async (req, res, next) => {
    const { currentPassword } = req.body; // Password the user enters to authenticate themselves

    if (!currentPassword) {
      return res.status(400).json({ message: 'Current password is required' });
    }

    // Ensure req.user exists (e.g., set by JWT or session middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Unauthorized: user not authenticated' });
    }

    try {
      // Fetch the user from the database using their ID
      const user = await prisma.users.findUnique({
        where: { id: req.user.id },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Compare the entered current password with the stored hashed password
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect current password' });
      }

      // Password is correct, so we proceed to the next middleware
      next();
    } catch (error) {
      console.error('Error authenticating password:', error.message);
      return res.status(500).json({ message: 'Server error during password authentication' });
    }
  };
};

export default authenticatePassword;
