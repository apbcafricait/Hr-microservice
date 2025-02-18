// src/routes/employeeContactsRoutes.js
import { Router } from 'express'
import EmployeeContactsController from '../controllers/EmployeeContactsController.js'
import { authenticated,admin } from '../middleware/Authentication.js'

const router = Router()
const controller = new EmployeeContactsController()

// Protect all routes with authentication middleware
router.use(authenticated)

/**
 * GET /api/employee-contacts/:id
 * Retrieves a specific employee contact by its id.
 */
router.get('/:id', controller.getEmployeeContact.bind(controller))

/**
 * GET /api/employee-contacts
 * Retrieves all employee contacts with pagination.
 * Optional: filter by employeeId (e.g., ?employeeId=3)
 */
router.get('/', controller.getAllEmployeeContacts.bind(controller))

/**
 * POST /api/employee-contacts
 * Request Body Example:
 * {
 *   "employeeId": "5",
 *   "phone": "123-456-7890",
 *   "email": "employee@example.com",
 *   "emergencyContactName": "Jane Doe",
 *   "emergencyContactPhone": "098-765-4321"
 * }
 * Creates a new employee contact record.
 * (Admin-only route)
 */
router.post('/', controller.createEmployeeContact.bind(controller))

/**
 * PUT /api/employee-contacts/:id
 * Request Body Example:
 * {
 *   "phone": "111-222-3333",
 *   "email": "newemail@example.com"
 * }
 * Updates an existing employee contact record.
 * (Admin-only route)
 */
router.put('/:id', admin, controller.updateEmployeeContact.bind(controller))

/**
 * DELETE /api/employee-contacts/:id
 * Deletes an employee contact record.
 * (Admin-only route)
 */
router.delete('/:id', admin, controller.deleteEmployeeContact.bind(controller))

export default router