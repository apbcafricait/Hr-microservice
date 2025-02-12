// src/controllers/EmployeesController.js

import { PrismaClient } from '@prisma/client'
import { validateEmployee } from '../validators/employeeValidator.js'
import { encryptPassword } from '../utils/encryptPassword.js'

const prisma = new PrismaClient()

export class EmployeesController {
  // Get all employees with pagination, filtering and searching
  async getAllEmployees (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const organisationId = parseInt(req.query.organisationId)
      const search = req.query.search
      const skip = (page - 1) * limit

      const whereClause = {}
      if (organisationId) {
        whereClause.organisationId = organisationId
      }
      if (search) {
        whereClause.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { position: { contains: search, mode: 'insensitive' } },
          { nationalId: { contains: search, mode: 'insensitive' } }
        ]
      }

      const [employees, total] = await Promise.all([
        prisma.employee.findMany({
          skip,
          take: limit,
          where: whereClause,
          include: {
            user: {
              select: {
                email: true,
                role: true
              }
            },
            organisation: {
              select: {
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }),
        prisma.employee.count({ where: whereClause })
      ])

      return res.status(200).json({
        status: 'success',
        data: {
          employees,
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
        message: 'Failed to fetch employees',
        error: error.message
      })
    }
  }

  // Get single employee
  async getEmployee (req, res) {
    try {
      const { id } = req.params
      const employee = await prisma.employee.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          },
          organisation: {
            select: {
              name: true
            }
          }
        }
      })

      if (!employee) {
        return res.status(404).json({
          status: 'error',
          message: 'Employee not found'
        })
      }

      return res.status(200).json({
        status: 'success',
        data: { employee }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch employee',
        error: error.message
      })
    }
  }

  // Create new employee
  
    async createEmployee(req, res) {
        try {
            const {
                email,
                password, // Add password for user creation
                organisationId,
                firstName,
                lastName,
                nationalId,
                dateOfBirth,
                position,
                employmentDate,
                salary,
                role
            } = req.body;

            // First, check if email already exists
            const existingUser = await prisma.users.findUnique({
                where: { email: email.toLowerCase() }
            });

            if (existingUser) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Email already registered'
                });
            }

            // Start a transaction to ensure both user and employee are created or neither
            const result = await prisma.$transaction(async (prisma) => {
                // 1. Create user first
                const encrypted_password = await encryptPassword(password);
                const user = await prisma.users.create({
                    data: {
                        email: email.toLowerCase(),
                        password_hash: encrypted_password,
                        role
                    }
                });

                // 2. Prepare employee data with the new user ID
                const employeeData = {
                    userId: user.id,
                    organisationId: parseInt(organisationId),
                    firstName,
                    lastName,
                    nationalId,
                    dateOfBirth: new Date(dateOfBirth),
                    position,
                    employmentDate: new Date(employmentDate),
                    salary: parseFloat(salary)
                };

                // Validate employee data
                const validationError = validateEmployee(employeeData);
                if (validationError) {
                    // If validation fails, the transaction will be rolled back
                    throw new Error('Validation failed: ' + validationError.join(', '));
                }

                // 3. Create employee
                const employee = await prisma.employee.create({
                    data: employeeData,
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true
                            }
                        },
                        organisation: {
                            select: {
                                name: true
                            }
                        }
                    }
                });

                // 4. Create initial leave balance for the employee
                await prisma.leaveBalance.create({
                    data: {
                        employeeId: employee.id,
                        annualLeave: 21,
                        sickLeave: 7,
                        compassionateLeave: 3
                    }
                });

                return employee;
            });

            return res.status(201).json({
                status: 'success',
                data: { employee: result }
            });

        } catch (error) {
            return res.status(500).json({
                status: 'error',
                message: error.message.includes('Validation failed') 
                    ? error.message 
                    : 'Failed to create employee',
                error: error.message
            });
        }
    }

  // Update employee
  async updateEmployee (req, res) {
    try {
      const { id } = req.params
      const updateData = {}

      // Only update fields that are provided
      if (req.body.firstName) updateData.firstName = req.body.firstName
      if (req.body.lastName) updateData.lastName = req.body.lastName
      if (req.body.position) updateData.position = req.body.position
      if (req.body.salary) updateData.salary = parseFloat(req.body.salary)
      if (req.body.dateOfBirth)
        updateData.dateOfBirth = new Date(req.body.dateOfBirth)
      if (req.body.employmentDate)
        updateData.employmentDate = new Date(req.body.employmentDate)
      if (req.body.nationalId) updateData.nationalId = req.body.nationalId

      const employee = await prisma.employee.update({
        where: { id: parseInt(id) },
        data: updateData,
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          },
          organisation: {
            select: {
              name: true
            }
          }
        }
      })

      return res.status(200).json({
        status: 'success',
        data: { employee }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update employee',
        error: error.message
      })
    }
  }

  // Delete employee
  async deleteEmployee (req, res) {
    try {
      const { id } = req.params
      await prisma.employee.delete({
        where: { id: parseInt(id) }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Employee deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete employee',
        error: error.message
      })
    }
  }

  // Get employees by organisation
  async getEmployeesByOrganisation (req, res) {
    try {
      const { organisationId } = req.params
      const employees = await prisma.employee.findMany({
        where: { organisationId: parseInt(organisationId) },
        include: {
          user: {
            select: {
              email: true,
              role: true
            }
          }
        }
      })

      return res.status(200).json({
        status: 'success',
        data: { employees }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch employees by organisation',
        error: error.message
      })
    }
  }

  // Get employee statistics
  async getEmployeeStats (req, res) {
    try {
      const { organisationId } = req.params
      const stats = await prisma.$transaction([
        prisma.employee.count({
          where: { organisationId: parseInt(organisationId) }
        }),
        prisma.employee.aggregate({
          where: { organisationId: parseInt(organisationId) },
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
        message: 'Failed to fetch employee statistics',
        error: error.message
      })
    }
  }
}

export default EmployeesController
