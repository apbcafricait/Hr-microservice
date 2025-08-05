import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import prisma from '../../db/prisma.js';
import authenticatePassword from './authenticatePassword.js';
dotenv.config();


// AUTHENTICATED  ─ adds employeeId & organisationId to req.user

const authenticated = async (req, res, next) => {
  const myToken = req.cookies.authToken;
  if (!myToken) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(myToken, process.env.JWT_SECRET); //contains at least { id, role }
    req.user = { ...decoded }; 

    // Fetch the employee record linked to this user (if it exists)
    const employee = await prisma.employee.findFirst({
      where: { userId: decoded.id },
      select: { id: true, organisationId: true },
    });

    if (employee) {
      req.user.employeeId = employee.id;      
      req.user.organisationId = employee.organisationId; 
    }

    const passwordCheck = await authenticatePassword(req, res);
    if (!passwordCheck) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Not authorized' });
  }
};


// ADMIN  (unchanged)

const admin = () => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const id = req.user.id;
      const user = await prisma.users.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized as Admin' });
      }
      next();
    } catch (error) {
      console.error('Error verifying user role:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

// MANAGER  (unchanged)

const manager = () => {
  return async (req, res, next) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const id = req.user.id;
      const user = await prisma.users.findUnique({ where: { id } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role !== 'manager') {
        return res.status(403).json({ message: 'Not authorized as Manager' });
      }
      next();
    } catch (error) {
      console.error('Error verifying user role:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  };
};

export { authenticated, admin, manager };
