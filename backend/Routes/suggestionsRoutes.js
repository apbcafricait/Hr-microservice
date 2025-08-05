// src/routes/suggestionsRoutes.js
import { Router } from 'express';
import SuggestionsController from '../controllers/SuggestionsController.js';
import { authenticated, admin } from '../middleware/Authentication.js';

const router = Router();
const controller = new SuggestionsController();

// Protect all routes with authentication
router.use(authenticated);

/**
 * GET /api/suggestions/get-suggestion/:id
 * Requires JWT (authenticated user)
 * Retrieves a single suggestion by its ID.
 */
router.get('/get-suggestion/:id', controller.getSuggestion.bind(controller));

/**
 * GET /api/suggestions/get-all-suggestions?page=1&limit=10
 * Requires JWT (authenticated user)
 * Retrieves all suggestions with pagination.
 * Optional query param: ?organisationId=5 (for filtering)
 */
router.get('/get-all-suggestions', controller.getAllSuggestions.bind(controller));

/**
 * POST /api/suggestions/create-suggestion
 * Requires JWT (authenticated user)
 *
 * Request Body Example:
 * {
 *   "content": "I would like to see more flexible working hours.",
 *   "isAnonymous": true
 * }
 * Creates a new suggestion. The employeeId and organisationId
 * are automatically derived from the authenticated token.
 */
router.post('/create-suggestion', controller.createSuggestion.bind(controller));

/**
 * PUT /api/suggestions/update-suggestion/:id
 * Requires JWT (admin user only)
 *
 * Request Body Example:
 * {
 *   "content": "Updated suggestion content",
 *   "isAnonymous": false
 * }
 * Updates a suggestion record by ID.
 */
router.put('/update-suggestion/:id', admin, controller.updateSuggestion.bind(controller));

/**
 * DELETE /api/suggestions/delete-suggestion/:id
 * Requires JWT (admin user only)
 * Deletes a suggestion record by ID.
 */
router.delete('/delete-suggestion/:id', admin, controller.deleteSuggestion.bind(controller));

export default router;
