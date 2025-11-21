import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Check if user has required role
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Check if user can access specific qualification
export const canAccessQualification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === 'admin') {
      return next(); // Admin can access everything
    }

    // Get the qualification and check ownership
    const qualification = await prisma.qualification.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: {
          include: {
            user: true,
            organisation: true
          }
        }
      }
    });

    if (!qualification) {
      return res.status(404).json({ error: 'Qualification not found' });
    }

    // Employee can only access their own qualifications
    if (userRole === 'employee') {
      if (qualification.employee.userId !== userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    // Manager can access qualifications of employees in their organization
    if (userRole === 'manager') {
      const managerEmployee = await prisma.employee.findFirst({
        where: { userId }
      });

      if (!managerEmployee || 
          managerEmployee.organisationId !== qualification.employee.organisationId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};