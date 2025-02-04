// src/controllers/LeaveBalancesController.js

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export class LeaveBalancesController {
  // Get leave balance for an employee
  async getLeaveBalance (req, res) {
    try {
      const { employeeId } = req.params

      const leaveBalance = await prisma.leaveBalance.findUnique({
        where: {
          employeeId: parseInt(employeeId)
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true
            }
          }
        }
      })

      if (!leaveBalance) {
        return res.status(404).json({
          status: 'error',
          message: 'Leave balance not found'
        })
      }

      return res.status(200).json({
        status: 'success',
        data: { leaveBalance }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch leave balance',
        error: error.message
      })
    }
  }

  // Create initial leave balance for an employee
  async createLeaveBalance (req, res) {
    try {
      const { employeeId } = req.params

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(employeeId) }
      })

      if (!employee) {
        return res.status(404).json({
          status: 'error',
          message: 'Employee not found'
        })
      }

      // Check if leave balance already exists
      const existingBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId: parseInt(employeeId) }
      })

      if (existingBalance) {
        return res.status(400).json({
          status: 'error',
          message: 'Leave balance already exists for this employee'
        })
      }

      const leaveBalance = await prisma.leaveBalance.create({
        data: {
          employeeId: parseInt(employeeId),
          // Optional: override defaults if provided in request
          annualLeave: req.body.annualLeave || 21,
          sickLeave: req.body.sickLeave || 7,
          compassionateLeave: req.body.compassionateLeave || 3
        }
      })

      return res.status(201).json({
        status: 'success',
        data: { leaveBalance }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create leave balance',
        error: error.message
      })
    }
  }

  // Update leave balance
  async updateLeaveBalance (req, res) {
    try {
      const { employeeId } = req.params
      const updateData = {}

      // Only update fields that are provided and validate them
      if (req.body.annualLeave !== undefined) {
        if (req.body.annualLeave < 0 || req.body.annualLeave > 21) {
          return res.status(400).json({
            status: 'error',
            message: 'Annual leave must be between 0 and 21 days'
          })
        }
        updateData.annualLeave = req.body.annualLeave
      }

      if (req.body.sickLeave !== undefined) {
        if (req.body.sickLeave < 0) {
          return res.status(400).json({
            status: 'error',
            message: 'Sick leave cannot be negative'
          })
        }
        updateData.sickLeave = req.body.sickLeave
      }

      if (req.body.compassionateLeave !== undefined) {
        if (req.body.compassionateLeave < 0) {
          return res.status(400).json({
            status: 'error',
            message: 'Compassionate leave cannot be negative'
          })
        }
        updateData.compassionateLeave = req.body.compassionateLeave
      }

      // Update the timestamp
      updateData.updatedAt = new Date()

      const leaveBalance = await prisma.leaveBalance.update({
        where: {
          employeeId: parseInt(employeeId)
        },
        data: updateData
      })

      return res.status(200).json({
        status: 'success',
        data: { leaveBalance }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update leave balance',
        error: error.message
      })
    }
  }

  // Deduct leave days
  async deductLeave (req, res) {
    try {
      const { employeeId } = req.params
      const { leaveType, days } = req.body

      if (!['annual', 'sick', 'compassionate'].includes(leaveType)) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid leave type'
        })
      }

      if (days <= 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Days must be greater than 0'
        })
      }

      const currentBalance = await prisma.leaveBalance.findUnique({
        where: { employeeId: parseInt(employeeId) }
      })

      if (!currentBalance) {
        return res.status(404).json({
          status: 'error',
          message: 'Leave balance not found'
        })
      }

      // Check if enough balance is available
      const leaveTypeMap = {
        annual: 'annualLeave',
        sick: 'sickLeave',
        compassionate: 'compassionateLeave'
      }

      const currentDays = currentBalance[leaveTypeMap[leaveType]]
      if (currentDays < days) {
        return res.status(400).json({
          status: 'error',
          message: `Insufficient ${leaveType} leave balance`
        })
      }

      // Update the balance
      const updateData = {
        [leaveTypeMap[leaveType]]: currentDays - days,
        updatedAt: new Date()
      }

      const leaveBalance = await prisma.leaveBalance.update({
        where: { employeeId: parseInt(employeeId) },
        data: updateData
      })

      return res.status(200).json({
        status: 'success',
        data: { leaveBalance }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to deduct leave',
        error: error.message
      })
    }
  }

  // Reset annual leave balances (e.g., at the start of a new year)
  async resetAnnualLeave (req, res) {
    try {
      await prisma.leaveBalance.updateMany({
        data: {
          annualLeave: 21,
          updatedAt: new Date()
        }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Annual leave balances reset successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to reset annual leave balances',
        error: error.message
      })
    }
  }

  // Get all leave balances (with pagination and filtering)
  async getAllLeaveBalances (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const organisationId = parseInt(req.query.organisationId)
      const skip = (page - 1) * limit

      const whereClause = {}
      if (organisationId) {
        whereClause.employee = {
          organisationId
        }
      }

      const [leaveBalances, total] = await Promise.all([
        prisma.leaveBalance.findMany({
          skip,
          take: limit,
          where: whereClause,
          include: {
            employee: {
              select: {
                firstName: true,
                lastName: true,
                organisation: {
                  select: {
                    name: true
                  }
                }
              }
            }
          },
          orderBy: {
            updatedAt: 'desc'
          }
        }),
        prisma.leaveBalance.count({ where: whereClause })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          leaveBalances,
          pagination: {
            total,
            pages: Math.ceil(total / limit),
            page,
            limit
          }
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch leave balances',
        error: error.message
      })
    }
  }
}

export default LeaveBalancesController
