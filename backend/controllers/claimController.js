import { PrismaClient, Prisma } from '@prisma/client';
import { generateSequentialReferenceId } from '../utils/helpers.js';

const prisma = new PrismaClient();

export class ClaimController { // Changed from 'claimController' to 'ClaimController'
  // Submit a new claim (UNCHANGED - preserves existing functionality)
  async submitClaim(req, res) {
    try {
      const {
        eventName,
        description,
        currency,
        amount,
        fromDate,
        toDate,
        employeeId,
        comment,
      } = req.body;

      const submittingEmployeeId = req.user?.employeeId ?? null;
      const targetEmployeeId = employeeId || submittingEmployeeId;

      // 🧠 Step 1: Fetch employee
      const employee = await prisma.employee.findUnique({
        where: { id: targetEmployeeId },
        // select: { departmentId: true } // 🟨 Commented out departmentId
      });

      if (!employee /* || !employee.departmentId */) {
        return res.status(400).json({
          status: 'error',
          message: 'Employee not found',
        });
      }

      // 🧠 Step 2: Create claim
      const claim = await prisma.claim.create({
        data: {
          referenceId: generateSequentialReferenceId(),
          eventName,
          description,
          currency,
          amount: new Prisma.Decimal(amount),
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          employeeId: targetEmployeeId,
          // departmentId: employee.departmentId, // 🟨 Removed
          comment,
          status: 'CLAIM_SUBMITTED', // Set default status
        },
        include: {
          employee: true,
        },
      });

      return res.status(201).json({
        status: 'success',
        data: { claim },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to submit claim',
        error: error.message,
      });
    }
  }

  // Get claims for current employee (UNCHANGED - preserves existing functionality)
  async getMyClaims(req, res) {
    try {
      const employeeId = req.user.employeeId;

      const claims = await prisma.claim.findMany({
        where: { employeeId },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              position: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { submittedDate: 'desc' },
      });

      return res.status(200).json({
        status: 'success',
        data: { claims },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims',
        error: error.message,
      });
    }
  }

  // Get claims by organisation ID (UNCHANGED - preserves existing functionality)
  async getClaimsByOrganisation(req, res) {
    try {
      const organisationId = Number(req.params.organisationId);

      if (isNaN(organisationId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid organisation ID',
        });
      }

      const claims = await prisma.claim.findMany({
        where: {
          employee: {
            organisationId: organisationId,
          },
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: {
          submittedDate: 'desc',
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claims },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organisation claims',
        error: error.message,
      });
    }
  }

  // Admin: Get all claims (ENHANCED - now handles missing organisationId gracefully)
  async getAllClaims(req, res) {
    try {
      console.log('getAllClaims called with body:', req.body);
      console.log('User context:', req.user);

      const { status, fromDate, toDate, organisationId, referenceId, eventName } = req.body || {};

      // Build where clause dynamically
      let whereClause = {};

      // Handle organisation filtering
      let targetOrganisationId = organisationId;

      // If no organisationId provided, try to get from user context
      if (!targetOrganisationId && req.user?.organisationId) {
        targetOrganisationId = req.user.organisationId;
      }

      // If still no organisationId, try to get from user's employee record
      if (!targetOrganisationId && req.user?.employeeId) {
        const userEmployee = await prisma.employee.findUnique({
          where: { id: req.user.employeeId },
          select: { organisationId: true }
        });
        targetOrganisationId = userEmployee?.organisationId;
      }

      // Apply organisation filter if we have one
      if (targetOrganisationId) {
        whereClause.employee = {
          organisationId: Number(targetOrganisationId),
        };
      }

      // Apply other filters only if they exist
      if (status) {
        whereClause.status = status;
      }

      if (referenceId) {
        whereClause.referenceId = {
          contains: referenceId,
          mode: 'insensitive'
        };
      }

      if (eventName) {
        whereClause.eventName = {
          contains: eventName,
          mode: 'insensitive'
        };
      }

      if (fromDate && toDate) {
        whereClause.submittedDate = {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        };
      }

      console.log('Where clause:', JSON.stringify(whereClause, null, 2));

      const claims = await prisma.claim.findMany({
        where: whereClause,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              position: true,
              organisationId: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { submittedDate: 'desc' },
      });

      console.log(`Found ${claims.length} claims`);

      return res.status(200).json({
        status: 'success',
        data: { claims },
        meta: {
          total: claims.length,
          organisationId: targetOrganisationId,
          appliedFilters: whereClause
        }
      });
    } catch (error) {
      console.error('Get all claims error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims',
        error: error.message,
      });
    }
  }

  // Admin: Assign a claim to a department head (UNCHANGED - preserves existing functionality)
  async assignClaimToDepartmentHead(req, res) {
    try {
      const { claimId, departmentHeadId, comment } = req.body;

      const claim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: {
          // departmentHeadId: Number(departmentHeadId), // 🟨 Removed
          status: 'ASSIGNED',
          comment,
        },
        include: {
          departmentHead: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claim },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign claim to department head',
        error: error.message,
      });
    }
  }

  // Admin: Assign claim (UNCHANGED - preserves existing functionality)
  async assignClaim(req, res) {
    try {
      const { claimId, assignedToId, comment } = req.body;

      const claim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: {
          assignedToId: Number(assignedToId),
          status: 'IN_REVIEW',
          comment,
        },
        include: {
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claim },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign claim',
        error: error.message,
      });
    }
  }

  // Update claim status (UNCHANGED - preserves existing functionality)
  async updateClaimStatus(req, res) {
    try {
      const { claimId, status, comment } = req.body;

      const claim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: {
          status,
          comment,
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claim },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update claim status',
        error: error.message,
      });
    }
  }

  // Filter claims by employee or department (UNCHANGED - preserves existing functionality)
  async getClaims(req, res) {
    try {
      const { employeeId, /* departmentId, */ status } = req.query;

      const claims = await prisma.claim.findMany({
        where: {
          ...(employeeId && { employeeId: Number(employeeId) }),
          // ...(departmentId && { employee: { departmentId: Number(departmentId) } }), // 🟨 Removed
          ...(status && { status }),
        },
        include: {
          employee: { 
            select: { 
              id: true,
              firstName: true, 
              lastName: true,
              email: true,
              position: true,
            } 
          },
          assignedTo: { 
            select: { 
              id: true,
              firstName: true, 
              lastName: true 
            } 
          },
          // departmentHead: { select: { firstName: true, lastName: true } }, // 🟨 Removed
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claims },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims',
        error: error.message,
      });
    }
  }

  // Delete a claim (UNCHANGED - preserves existing functionality)
  async deleteClaim(req, res) {
    try {
      const { id } = req.params;

      const claim = await prisma.claim.delete({
        where: { id: Number(id) },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Claim deleted successfully',
        data: { claim },
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete claim',
        error: error.message,
      });
    }
  }
}

export default ClaimController;