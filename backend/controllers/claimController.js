import { PrismaClient, Prisma } from '@prisma/client';
import { generateReferenceId } from '../utils/helpers.js';

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

      const claim = await prisma.claim.create({
        data: {
          referenceId: generateReferenceId(),
          eventName,
          description,
          currency,
          amount: new Prisma.Decimal(amount),
          fromDate: new Date(fromDate),
          toDate: new Date(toDate),
          employeeId: targetEmployeeId,
          comment,
        },
        include: {
          employee: true
        }
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

  // Get claims for current employee
  async getMyClaims(req, res) {
    try {
      const employeeId = req.user.employeeId;

      const claims = await prisma.claim.findMany({
        where: { employeeId },
        include: {
          assignedTo: {
            select: {
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

  // Admin: Get all claims
  async getAllClaims(req, res) {
    try {
      const { status, fromDate, toDate, organisationId } = req.body;

      const claims = await prisma.claim.findMany({
        where: {
          status,
          employee: {
            organisationId: Number(organisationId),
          },
          ...(fromDate &&
            toDate && {
              submittedDate: {
                gte: new Date(fromDate),
                lte: new Date(toDate),
              },
            }),
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              position: true,
            },
          },
          assignedTo: {
            select: {
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

  // Admin: Assign a claim to a department head
  async assignClaimToDepartmentHead(req, res) {
    try {
      const { claimId, departmentHeadId, comment } = req.body;

      const claim = await prisma.claim.update({
        where: { id: Number(claimId) },
        data: {
          departmentHeadId: Number(departmentHeadId),
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

  // Admin: Assign claim
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

  // Update claim status
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

  // Filter claims by employee or department
  async getClaims(req, res) {
    try {
      const { employeeId, departmentId, status } = req.query;

      const claims = await prisma.claim.findMany({
        where: {
          ...(employeeId && { employeeId: Number(employeeId) }),
          ...(departmentId && { employee: { departmentId: Number(departmentId) } }),
          ...(status && { status }),
        },
        include: {
          employee: { select: { firstName: true, lastName: true } },
          departmentHead: { select: { firstName: true, lastName: true } },
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
}

export default ClaimController;
