// src/routes/employeeContactsRoutes.js
import { Router } from 'express'
import EmployeeContactsController from '../controllers/EmployeeContactsController.js'
import { authenticated, admin } from '../middleware/Authentication.js'

const router = Router()
const controller = new EmployeeContactsController()

// Protect all routes with authentication middleware
router.use(authenticated)

/**
 * GET /api/employee-contacts/get-employee-contact/:id
 * Retrieves a specific employee contact by its id.
 */
router.get(
  '/get-employee-contact/:id',
  controller.getEmployeeContact.bind(controller)
)

/**
 * GET /api/employee-contacts/get-all-employee-contacts?page=1&limit=10
 * Retrieves all employee contacts with pagination.
 * Optional: filter by employeeId (e.g., ?employeeId=3)
 */
router.get(
  '/get-all-employee-contacts',
  controller.getAllEmployeeContacts.bind(controller)
)

/**
 * POST /api/employee-contacts/create-employee-contact
 * Request Body Example:
 * {
 *   "employeeId": "5",
 *   "phone": "123-456-7890",
 *   "email": "employee@example.com",
 *   "emergencyContactName": "Jane Doe",
 *   "emergencyContactPhone": "098-765-4321"
 * }
 * Creates a new employee contact record.
 */
router.post(
  '/create-employee-contact',
  controller.createEmployeeContact.bind(controller)
)

/**
 * PUT /api/employee-contacts/update-employee-contact/:id
 * Request Body Example:
 * {
 *   "phone": "111-222-3333",
 *   "email": "newemail@example.com"
 * }
 * Updates an existing employee contact record.
 * (Admin-only route)
 */
router.put(
  '/update-employee-contact/:id',
  admin,
  controller.updateEmployeeContact.bind(controller)
)

/**
 * DELETE /api/employee-contacts/delete-employee-contact/:id
 * Deletes an employee contact record.
 * (Admin-only route)
 */
router.delete(
  '/delete-employee-contact/:id',
  admin,
  controller.deleteEmployeeContact.bind(controller)
)

export default router
