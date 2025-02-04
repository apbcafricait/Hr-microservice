// src/controllers/EmployeeContactsController.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class EmployeeContactsController {
  // GET a single employee contact by its id
  async getEmployeeContact (req, res) {
    try {
      const id = parseInt(req.params.id)
      const contact = await prisma.employeeContact.findUnique({
        where: { id },
        include: {
          employee: { select: { firstName: true, lastName: true } }
        }
      })
      if (!contact) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Employee contact not found' })
      }
      return res.status(200).json({ status: 'success', data: contact })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch employee contact',
          error: error.message
        })
    }
  }

  // GET all employee contacts with pagination and optional filtering by employeeId
  async getAllEmployeeContacts (req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit
      const whereClause = {}
      if (req.query.employeeId) {
        whereClause.employeeId = parseInt(req.query.employeeId)
      }
      const [contacts, total] = await Promise.all([
        prisma.employeeContact.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: {
            employee: { select: { firstName: true, lastName: true } }
          },
          orderBy: { updatedAt: 'desc' }
        }),
        prisma.employeeContact.count({ where: whereClause })
      ])
      return res.status(200).json({
        status: 'success',
        data: {
          contacts,
          pagination: { total, pages: Math.ceil(total / limit), page, limit }
        }
      })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to fetch employee contacts',
          error: error.message
        })
    }
  }

  // POST: Create a new employee contact record
  async createEmployeeContact (req, res) {
    try {
      const {
        employeeId,
        phone,
        email,
        emergencyContactName,
        emergencyContactPhone
      } = req.body
      if (!employeeId) {
        return res
          .status(400)
          .json({ status: 'error', message: 'employeeId is required' })
      }
      const newContact = await prisma.employeeContact.create({
        data: {
          employeeId: parseInt(employeeId),
          phone: phone || null,
          email: email || null,
          emergencyContactName: emergencyContactName || null,
          emergencyContactPhone: emergencyContactPhone || null
          // updatedAt defaults to NOW
        }
      })
      return res.status(201).json({ status: 'success', data: newContact })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to create employee contact',
          error: error.message
        })
    }
  }

  // PUT: Update an existing employee contact record (admin-only)
  async updateEmployeeContact (req, res) {
    try {
      const id = parseInt(req.params.id)
      const { phone, email, emergencyContactName, emergencyContactPhone } =
        req.body
      const updateData = {}
      if (phone !== undefined) updateData.phone = phone
      if (email !== undefined) updateData.email = email
      if (emergencyContactName !== undefined)
        updateData.emergencyContactName = emergencyContactName
      if (emergencyContactPhone !== undefined)
        updateData.emergencyContactPhone = emergencyContactPhone
      // Update the timestamp to the current time (optional, if you want to reflect modification time)
      updateData.updatedAt = new Date()

      const updatedContact = await prisma.employeeContact.update({
        where: { id },
        data: updateData
      })
      return res.status(200).json({ status: 'success', data: updatedContact })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to update employee contact',
          error: error.message
        })
    }
  }

  // DELETE: Remove an employee contact record (admin-only)
  async deleteEmployeeContact (req, res) {
    try {
      const id = parseInt(req.params.id)
      const deletedContact = await prisma.employeeContact.delete({
        where: { id }
      })
      return res
        .status(200)
        .json({
          status: 'success',
          message: 'Employee contact deleted',
          data: deletedContact
        })
    } catch (error) {
      return res
        .status(500)
        .json({
          status: 'error',
          message: 'Failed to delete employee contact',
          error: error.message
        })
    }
  }
}

export default EmployeeContactsController
