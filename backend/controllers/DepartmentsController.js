// src/controllers/DepartmentsController.js

import { PrismaClient } from '@prisma/client'
import { validateDepartment } from '../validators/departmentValidator.js'

const prisma = new PrismaClient()

export class DepartmentsController {
  // Get all departments for an organisation
  async getDepartments (req, res) {
    try {
      const { organisationId } = req.params
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const search = req.query.search

      const whereClause = {
        organisationId: parseInt(organisationId)
      }

      if (search) {
        whereClause.name = {
          contains: search,
          mode: 'insensitive'
        }
      }

      const [departments, total] = await Promise.all([
        prisma.department.findMany({
          where: whereClause,
          skip: (page - 1) * limit,
          take: limit,
          include: {
            manager: {
              select: {
                id: true,
                firstName: true,
                lastName: true
              }
            },
            _count: {
              select: { employees: true }
            }
          },
          orderBy: {
            name: 'asc'
          }
        }),
        prisma.department.count({ where: whereClause })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          departments,
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
        message: 'Failed to fetch departments',
        error: error.message
      })
    }
  }

  // Get single department
  async getDepartment (req, res) {
    try {
      const { id } = req.params
      const department = await prisma.department.findUnique({
        where: { id: parseInt(id) },
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          },
          employees: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true
            }
          }
        }
      })

      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        })
      }

      return res.status(200).json({
        status: 'success',
        data: { department }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch department',
        error: error.message
      })
    }
  }

  // Create new department
  async createDepartment (req, res) {
    try {
      const departmentData = {
        organisationId: parseInt(req.params.organisationId),
        name: req.body.name,
        description: req.body.description,
        managerId: req.body.managerId ? parseInt(req.body.managerId) : null
      }

      // Validate department data
      const validationError = validateDepartment(departmentData)
      if (validationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validationError
        })
      }

      // Check if department name already exists in the organisation
      const existingDepartment = await prisma.department.findFirst({
        where: {
          organisationId: departmentData.organisationId,
          name: departmentData.name
        }
      })

      if (existingDepartment) {
        return res.status(400).json({
          status: 'error',
          message: 'Department name already exists in this organisation'
        })
      }

      const department = await prisma.department.create({
        data: departmentData,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return res.status(201).json({
        status: 'success',
        data: { department }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create department',
        error: error.message
      })
    }
  }

  // Update department
  async updateDepartment (req, res) {
    try {
      const { id } = req.params
      const updateData = {}

      if (req.body.name) updateData.name = req.body.name
      if (req.body.description !== undefined)
        updateData.description = req.body.description
      if (req.body.managerId !== undefined) {
        updateData.managerId = req.body.managerId
          ? parseInt(req.body.managerId)
          : null
      }

      // Check if department exists
      const existingDepartment = await prisma.department.findUnique({
        where: { id: parseInt(id) }
      })

      if (!existingDepartment) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        })
      }

      // Check name uniqueness if name is being updated
      if (updateData.name) {
        const nameExists = await prisma.department.findFirst({
          where: {
            organisationId: existingDepartment.organisationId,
            name: updateData.name,
            id: { not: parseInt(id) }
          }
        })

        if (nameExists) {
          return res.status(400).json({
            status: 'error',
            message: 'Department name already exists in this organisation'
          })
        }
      }

      const department = await prisma.department.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      })

      return res.status(200).json({
        status: 'success',
        data: { department }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update department',
        error: error.message
      })
    }
  }

  // Delete department
  async deleteDepartment (req, res) {
    try {
      const { id } = req.params

      // Check if department has employees
      const departmentWithEmployees = await prisma.department.findUnique({
        where: { id: parseInt(id) },
        include: {
          _count: {
            select: { employees: true }
          }
        }
      })

      if (departmentWithEmployees?._count.employees > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete department with assigned employees'
        })
      }

      await prisma.department.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Department deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete department',
        error: error.message
      })
    }
  }

  // Assign employees to department
  async assignEmployees (req, res) {
    try {
      const { id } = req.params
      const { employeeIds } = req.body

      if (!Array.isArray(employeeIds)) {
        return res.status(400).json({
          status: 'error',
          message: 'employeeIds must be an array'
        })
      }

      const updates = employeeIds.map(employeeId =>
        prisma.employee.update({
          where: { id: parseInt(employeeId) },
          data: { departmentId: parseInt(id) }
        })
      )

      await prisma.$transaction(updates)

      return res.status(200).json({
        status: 'success',
        message: 'Employees assigned successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign employees',
        error: error.message
      })
    }
  }
}

export default DepartmentsController
