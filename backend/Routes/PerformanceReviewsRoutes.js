import { Router } from 'express'
import PerformanceReviewsController from '../controllers/PerformanceReviewsController.js'

const router = Router()
const performanceReviewsController = new PerformanceReviewsController()

// Create a new performance review
router.post(
  '/performance-reviews',
  performanceReviewsController.createPerformanceReview.bind(
    performanceReviewsController
  )
)

// Get all performance reviews
router.get(
  '/performance-reviews',
  performanceReviewsController.getAllPerformanceReviews.bind(
    performanceReviewsController
  )
)

// Get a single performance review by ID
router.get(
  '/performance-reviews/:id',
  performanceReviewsController.getPerformanceReview.bind(
    performanceReviewsController
  )
)

// Update a performance review
router.put(
  '/performance-reviews/:id',
  performanceReviewsController.updatePerformanceReview.bind(
    performanceReviewsController
  )
)

// Delete a performance review
router.delete(
  '/performance-reviews/:id',
  performanceReviewsController.deletePerformanceReview.bind(
    performanceReviewsController
  )
)

export default router
