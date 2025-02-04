// src/controllers/LeaveRequestsController.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class LeaveRequestsController {
  // GET a single leave request by its id
  async getLeaveRequest (req, res) {
    try {
      const id = parseInt(req.params.id)
      const leaveRequest = await prisma.leaveRequest.findUnique({
        where: { id },
        include: {
          employee: { select: { firstName: true, lastName: true } },
          approver: { select: { email: true } }
        }
      })
      if (!leaveRequest) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Leave request not found' })
      }
      return res.status(200).json({ status: 'success', data: leaveRequest })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch leave request',
          error: error.message
        })
    }
  }

  // GET all leave requests with pagination and optional employee filtering
  async getAllLeaveRequests (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit
      const whereClause = {}
      if (req.query.employeeId) {
        whereClause.employeeId = parseInt(req.query.employeeId)
      }
      const [leaveRequests, total] = await Promise.all([
        prisma.leaveRequest.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            employee: { select: { firstName: true, lastName: true } },
            approver: { select: { email: true } }
          },
          orderBy: { requestedAt: 'desc' }
        }),
        prisma.leaveRequest.count({ where: whereClause })
      ])
      return res.status(200).json({
        status: 'success',
        data: {
          leaveRequests,
          pagination: { total, pages: Math.ceil(total / limit), page, limit }
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch leave requests',
          error: error.message
        })
    }
  }

  // POST: Create a new leave request
  async createLeaveRequest (req, res) {
    try {
      const { employeeId, startDate, endDate, type } = req.body
      // Validation: start date must be before end date
      if (new Date(startDate) > new Date(endDate)) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: 'Start date must be before end date'
          })
      }
      const leaveRequest = await prisma.leaveRequest.create({
        data: {
          employeeId: parseInt(employeeId),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          type
          // 'status' defaults to 'pending' and 'requestedAt' defaults to NOW
        }
      })
      return res.status(201).json({ status: 'success', data: leaveRequest })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to create leave request',
          error: error.message
        })
    }
  }

  // PUT: Update an existing leave request (e.g., to approve/reject)
  async updateLeaveRequest (req, res) {
    try {
      const id = parseInt(req.params.id)
      const { startDate, endDate, type, status, approvedBy } = req.body
      // If updating dates, ensure startDate < endDate
      if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        return res
          .status(400)
          .json({
            status: 'error',
            message: 'Start date must be before end date'
          })
      }
      const updateData = {}
      if (startDate) updateData.startDate = new Date(startDate)
      if (endDate) updateData.endDate = new Date(endDate)
      if (type) updateData.type = type
      if (status) {
        const allowedStatuses = ['pending', 'approved', 'rejected']
        if (!allowedStatuses.includes(status)) {
          return res
            .status(400)
            .json({ status: 'error', message: 'Invalid status value' })
        }
        updateData.status = status
      }
      if (approvedBy !== undefined) {
        // When approvedBy is provided, parse to int (or set to null if falsy)
        updateData.approvedBy = approvedBy ? parseInt(approvedBy) : null
      }
      // You might add an updatedAt field if needed
      const leaveRequest = await prisma.leaveRequest.update({
        where: { id },
        data: updateData
      })
      return res.status(200).json({ status: 'success', data: leaveRequest })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to update leave request',
          error: error.message
        })
    }
  }

  // DELETE: Remove a leave request
  async deleteLeaveRequest (req, res) {
    try {
      const id = parseInt(req.params.id)
      const leaveRequest = await prisma.leaveRequest.delete({ where: { id } })
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Leave request deleted',
          data: leaveRequest
        })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to delete leave request',
          error: error.message
        })
    }
  }
}

export default LeaveRequestsController
