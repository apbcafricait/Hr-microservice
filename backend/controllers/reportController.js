// controllers/reportController.js
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const reportController = {
  // Get all reports
  async getAllReports (req, res) {
    try {
      const reports = await prisma.report.findMany({
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              department: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })

      res.json(reports)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Get single report
  async getReport (req, res) {
    try {
      const { id } = req.params
      const report = await prisma.report.findUnique({
        where: { id: parseInt(id) },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true,
              department: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })

      if (!report) {
        return res.status(404).json({ error: 'Report not found' })
      }

      res.json(report)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Create report
  async createReport (req, res) {
    try {
      const { title, description, employeeId, comment } = req.body

      const report = await prisma.report.create({
        data: {
          title,
          description,
          employeeId: parseInt(employeeId),
          comment
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true
            }
          }
        }
      })

      res.status(201).json(report)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Update report
  async updateReport (req, res) {
    try {
      const { id } = req.params
      const { title, description, comment } = req.body

      const report = await prisma.report.update({
        where: { id: parseInt(id) },
        data: {
          title,
          description,
          comment
        },
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              position: true
            }
          }
        }
      })

      res.json(report)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // Delete report
  async deleteReport (req, res) {
    try {
      const { id } = req.params
      await prisma.report.delete({
        where: { id: parseInt(id) }
      })

      res.json({ message: 'Report deleted successfully' })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  }
}
