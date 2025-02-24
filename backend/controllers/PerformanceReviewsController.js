import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export class PerformanceReviewsController {
  // Create a new performance review
  async createPerformanceReview (req, res) {
    try {
      const { employeeId, jobTitle, reviewStatus, reviewer, fromDate, toDate } =
        req.body

      const performanceReview = await prisma.performanceReview.create({
        data: {
          employeeId: parseInt(employeeId),
          jobTitle,
          reviewStatus,
          reviewer,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate)
        }
      })

      return res
        .status(201)
        .json({ status: 'success', data: performanceReview })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to create performance review',
        error: error.message
      })
    }
  }

  // Get all performance reviews
  async getAllPerformanceReviews (req, res) {
    try {
      const performanceReviews = await prisma.performanceReview.findMany({
        include: {
          employee: { select: { firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' }
      })

      return res
        .status(200)
        .json({ status: 'success', data: performanceReviews })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch performance reviews',
        error: error.message
      })
    }
  }

  // Get a single performance review by ID
  async getPerformanceReview (req, res) {
    try {
      const id = parseInt(req.params.id)
      const performanceReview = await prisma.performanceReview.findUnique({
        where: { id },
        include: {
          employee: { select: { firstName: true, lastName: true } }
        }
      })

      if (!performanceReview) {
        return res
          .status(404)
          .json({ status: 'error', message: 'Performance review not found' })
      }

      return res
        .status(200)
        .json({ status: 'success', data: performanceReview })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch performance review',
        error: error.message
      })
    }
  }

  // Update a performance review
  async updatePerformanceReview (req, res) {
    try {
      const id = parseInt(req.params.id)
      const { jobTitle, reviewStatus, reviewer, fromDate, toDate } = req.body

      const updatedReview = await prisma.performanceReview.update({
        where: { id },
        data: {
          jobTitle,
          reviewStatus,
          reviewer,
          fromDate: new Date(fromDate),
          toDate: new Date(toDate)
        }
      })

      return res.status(200).json({ status: 'success', data: updatedReview })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to update performance review',
        error: error.message
      })
    }
  }

  // Delete a performance review
  async deletePerformanceReview (req, res) {
    try {
      const id = parseInt(req.params.id)
      await prisma.performanceReview.delete({ where: { id } })

      return res.status(200).json({
        status: 'success',
        message: 'Performance review deleted'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete performance review',
        error: error.message
      })
    }
  }
}

export default PerformanceReviewsController
