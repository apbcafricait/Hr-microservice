import { PrismaClient, Prisma } from '@prisma/client';
import { generateSequentialReferenceId } from '../utils/helpers.js';

const prisma = new PrismaClient();

export class ClaimController {
  // Submit a new claim
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

      if (!targetEmployeeId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized. Only employees can submit claims.',
        });
      }

      // fetch employee (with organisationId)
      const employee = await prisma.employee.findUnique({
        where: { id: targetEmployeeId },
        select: { organisationId: true }
      });

      if (!employee) {
        return res.status(400).json({
          status: 'error',
          message: 'Employee not found',
        });
      }

      // create claim
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
          organisationId: employee.organisationId,
          comment,
          status: 'SUBMITTED',
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              organisationId: true,
              user: { select: { email: true } }
            }
          }
        }
      });

      return res.status(201).json({
        status: 'success',
        data: { claim },
      });
    } catch (error) {
      console.error('Submit claim error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to submit claim',
        error: error.message,
      });
    }
  }

  // Get claims for current employee
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
              position: true,
              organisationId: true,
              user: { select: { email: true } }
            },
          },
          assignedTo: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
        orderBy: { submittedDate: 'desc' },
      });

      return res.status(200).json({
        status: 'success',
        data: { claims },
      });
    } catch (error) {
      console.error('Get my claims error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch claims',
        error: error.message,
      });
    }
  }

  // Get claims by organisation ID
  async getClaimsByOrganisation(req, res) {
    try {
      const organisationId = Number(req.params.organisationId);
      const userRole = req.user?.role;

      if (isNaN(organisationId)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid organisation ID'
        });
      }

      // verify manager access
      if (userRole === 'manager') {
        const managerEmployee = await prisma.employee.findFirst({
          where: { userId: req.user.id, organisationId }
        });
        if (!managerEmployee) {
          return res.status(403).json({
            status: 'error',
            message: 'Not authorized to view claims for this organisation'
          });
        }
      }

      const claims = await prisma.claim.findMany({
        where: { organisationId },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              organisationId: true,
              user: { select: { email: true } }
            }
          },
          assignedTo: { select: { id: true, firstName: true, lastName: true } }
        },
        orderBy: { submittedDate: 'desc' }
      });

      return res.status(200).json({
        status: 'success',
        data: { claims }
      });
    } catch (error) {
      console.error('Get claims by organisation error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organisation claims',
        error: error.message
      });
    }
  }

  // Admin: Get all claims with filters
  async getAllClaims(req, res) {
    try {
      const { status, fromDate, toDate, organisationId, referenceId, eventName } = req.body || {};
      let whereClause = {};

      if (organisationId || req.user?.organisationId) {
        whereClause.organisationId = Number(organisationId ?? req.user.organisationId);
      }

      if (status) whereClause.status = status;
      if (referenceId) whereClause.referenceId = { contains: referenceId, mode: 'insensitive' };
      if (eventName) whereClause.eventName = { contains: eventName, mode: 'insensitive' };
      if (fromDate && toDate) {
        whereClause.submittedDate = {
          gte: new Date(fromDate),
          lte: new Date(toDate),
        };
      }

      const claims = await prisma.claim.findMany({
        where: whereClause,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              organisationId: true,
              user: { select: { email: true } }
            }
          },
          assignedTo: { select: { id: true, firstName: true, lastName: true } }
        },
        orderBy: { submittedDate: 'desc' },
      });

      return res.status(200).json({
        status: 'success',
        data: { claims },
        meta: {
          total: claims.length,
          organisationId: whereClause.organisationId,
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

  // Assign claim to reviewer
  async assignClaim(req, res) {
    try {
      const { claimId, assignedToId, comment } = req.body;

      // fetch claim with orgId
      const claim = await prisma.claim.findUnique({
        where: { id: Number(claimId) },
        select: { id: true, organisationId: true }
      });

      if (!claim) {
        return res.status(404).json({
          status: 'error',
          message: 'Claim not found'
        });
      }

      // fetch reviewer
      const reviewer = await prisma.employee.findUnique({
        where: { id: Number(assignedToId) },
        select: { organisationId: true, user: { select: { role: true } } }
      });

      if (!reviewer) {
        return res.status(404).json({
          status: 'error',
          message: 'Reviewer not found'
        });
      }

      // org check
      if (claim.organisationId !== reviewer.organisationId) {
        return res.status(403).json({
          status: 'error',
          message: 'Reviewer must belong to the same organisation as the claim'
        });
      }

      // role check
      if (!['admin', 'manager'].includes(reviewer.user.role)) {
        return res.status(403).json({
          status: 'error',
          message: 'Reviewer must be an admin or manager'
        });
      }

      const updatedClaim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: {
          assignedToId: Number(assignedToId),
          status: 'IN_REVIEW',
          comment,
        },
        include: {
          assignedTo: { select: { firstName: true, lastName: true } }
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claim: updatedClaim },
      });
    } catch (error) {
      console.error('Assign claim error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign claim',
        error: error.message,
      });
    }
  }

  // Update claim status
  async updateClaimStatus(req, res) {
    try {
      const { claimId, status, comment } = req.body;
      const reviewerId = req.user?.employeeId;

      const claim = await prisma.claim.findUnique({
        where: { id: Number(claimId) },
        select: { organisationId: true, assignedToId: true }
      });

      if (!claim) {
        return res.status(404).json({
          status: 'error',
          message: 'Claim not found'
        });
      }

      if (claim.assignedToId !== reviewerId) {
        return res.status(403).json({
          status: 'error',
          message: 'You are not assigned to this claim'
        });
      }

      const reviewer = await prisma.employee.findUnique({
        where: { id: reviewerId },
        select: { organisationId: true }
      });

      if (claim.organisationId !== reviewer.organisationId) {
        return res.status(403).json({
          status: 'error',
          message: 'You cannot update claims outside your organisation'
        });
      }

      const updatedClaim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: { status, comment },
        include: {
          employee: { select: { firstName: true, lastName: true } },
          assignedTo: { select: { firstName: true, lastName: true } },
        },
      });

      return res.status(200).json({
        status: 'success',
        data: { claim: updatedClaim },
      });
    } catch (error) {
      console.error('Update claim status error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update claim status',
        error: error.message,
      });
    }
  }

  // Delete claim
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
      console.error('Delete claim error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete claim',
        error: error.message,
      });
    }
  }
}

export default ClaimController;
