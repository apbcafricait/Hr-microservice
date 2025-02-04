// src/routes/suggestionsRoutes.js
import { Router } from 'express'
import SuggestionsController from '../controllers/SuggestionsController.js'
import {authenticated, admin} from '../middleware/Authentication.js'

const router = Router()
const controller = new SuggestionsController()

// Protect all routes using authentication middleware
router.use(authenticated)

/**
 * GET /api/suggestions/get-suggestion/:id
 * Retrieves a suggestion by its ID.
 */
router.get('/get-suggestion/:id', controller.getSuggestion.bind(controller))

/**
 * GET /api/suggestions/get-all-suggestions?page=1&limit=10
 * Retrieves all suggestions with pagination.
 * Optional: filter by organisationId (e.g., ?organisationId=5)
 */
router.get(
  '/get-all-suggestions',
  controller.getAllSuggestions.bind(controller)
)

/**
 * POST /api/suggestions/create-suggestion
 * Request Body Example:
 * {
 *   "organisationId": "3",
 *   "content": "I would like to see more flexible working hours.",
 *   "isAnonymous": true
 * }
 * Creates a new suggestion record.
 */
router.post('/create-suggestion', controller.createSuggestion.bind(controller))

/**
 * PUT /api/suggestions/update-suggestion/:id
 * Request Body Example:
 * {
 *   "content": "Updated suggestion content",
 *   "isAnonymous": false
 * }
 * Updates an existing suggestion.
 * (Admin-only route)
 */
router.put(
  '/update-suggestion/:id',
  admin,
  controller.updateSuggestion.bind(controller)
)

/**
 * DELETE /api/suggestions/delete-suggestion/:id
 * Deletes a suggestion record.
 * (Admin-only route)
 */
router.delete(
  '/delete-suggestion/:id',
  admin,
  controller.deleteSuggestion.bind(controller)
)

export default router
