// src/controllers/OrganisationsController.js

import { PrismaClient } from '@prisma/client'
import { validateOrganisation } from '../validators/organisationValidator.js'

const prisma = new PrismaClient()

export class OrganisationsController {
  // Get all organisations with pagination and filtering
  async getAllOrganisations (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const search = req.query.search
      const skip = (page - 1) * limit

      const whereClause = {}
      if (search) {
        whereClause.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { subdomain: { contains: search, mode: 'insensitive' } }
        ]
      }

      const [organisations, total] = await Promise.all([
        prisma.organisation.findMany({
          skip,
          take: limit,
          where: whereClause,
          include: {
            creator: {
              select: {
                email: true
              }
            },
            _count: {
              select: { employees: true }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.organisation.count({ where: whereClause })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          organisations,
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
        message: 'Failed to fetch organisations',
        error: error.message
      })
    }
  }

  // Get single organisation
  async getOrganisation (req, res) {
    try {
      const { id } = req.params
      const organisation = await prisma.organisation.findUnique({
        where: { id: parseInt(id) },
        include: {
          creator: {
            select: {
              email: true,
              name: true
            }
          },
          _count: {
            select: { employees: true }
          }
        }
      })

      if (!organisation) {
        return res.status(404).json({
          status: 'error',
          message: 'Organisation not found'
        })
      }

      return res.status(200).json({
        status: 'success',
        data: { organisation }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organisation',
        error: error.message
      })
    }
  }

  // Create new organisation
  async createOrganisation (req, res) {
    try {
      const organisationData = {
        createdBy: req.body.createdBy, 
        name: req.body.name,
        subdomain: req.body.subdomain.toLowerCase(),
        mpesaPhone: req.body.mpesaPhone,
        subscriptionStatus: req.body.subscriptionStatus || 'trial'
      }

      // Validate organisation data
      const validationError = validateOrganisation(organisationData)
      if (validationError) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validationError
        })
      }

      // Check if subdomain is already taken
      const existingOrg = await prisma.organisation.findUnique({
        where: { subdomain: organisationData.subdomain }
      })

      if (existingOrg) {
        return res.status(400).json({
          status: 'error',
          message: 'Subdomain is already taken'
        })
      }

      const organisation = await prisma.organisation.create({
        data: organisationData,
        include: {
          creator: {
            select: {
              email: true
             
            }
          }
        }
      })

      return res.status(201).json({
        status: 'success',
        data: { organisation }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create organisation',
        error: error.message
      })
    }
  }

  // Update organisation
  async updateOrganisation (req, res) {
    try {
      const { id } = req.params
      const updateData = {}

      // Only update fields that are provided
      if (req.body.name) updateData.name = req.body.name
      if (req.body.mpesaPhone) updateData.mpesaPhone = req.body.mpesaPhone
      if (req.body.subscriptionStatus)
        updateData.subscriptionStatus = req.body.subscriptionStatus

      const organisation = await prisma.organisation.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          creator: {
            select: {
              email: true
            }
          }
        }
      })

      return res.status(200).json({
        status: 'success',
        data: { organisation }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update organisation',
        error: error.message
      })
    }
  }

  // Delete organisation
  async deleteOrganisation (req, res) {
    try {
      const { id } = req.params
      await prisma.organisation.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Organisation deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete organisation',
        error: error.message
      })
    }
  }

  // Get organisation statistics
  async getOrganisationStats (req, res) {
    try {
      const { id } = req.params
      const stats = await prisma.$transaction([
        prisma.employee.count({
          where: { organisationId: parseInt(id) }
        }),
        prisma.employee.aggregate({
          where: { organisationId: parseInt(id) },
          _avg: {
            salary: true
          },
          _sum: {
            salary: true
          }
        })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          totalEmployees: stats[0],
          averageSalary: stats[1]._avg.salary,
          totalSalaryExpense: stats[1]._sum.salary
        }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch organisation statistics',
        error: error.message
      })
    }
  }
}

export default OrganisationsController
