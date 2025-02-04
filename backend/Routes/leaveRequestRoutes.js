// src/routes/leaveRequestRoutes.js
import { Router } from 'express'
import LeaveRequestsController from '../controllers/LeaveRequestsController.js'
import {authenticated, admin} from '../middleware/Authentication.js'

const router = Router()
const controller = new LeaveRequestsController()

// All routes are protected by authentication
router.use(authenticated)

/**
 * Example Usage:
 * GET /api/leave-requests/get-leave-request/5
 *   - Retrieves the leave request with id 5.
 */
router.get(
  '/get-leave-request/:id',
  controller.getLeaveRequest.bind(controller)
)

/**
 * Example Usage:
 * GET /api/leave-requests/get-all-leave-requests?page=1&limit=10
 *   - Retrieves paginated list of leave requests; can filter by employeeId (e.g., ?employeeId=3)
 */
router.get(
  '/get-all-leave-requests',
  controller.getAllLeaveRequests.bind(controller)
)

/**
 * Example Usage:
 * POST /api/leave-requests/create-leave-request
 * Request Body:
 * {
 *   "employeeId": "2",
 *   "startDate": "2025-03-01",
 *   "endDate": "2025-03-10",
 *   "type": "annual"
 * }
 *   - Creates a new leave request.
 */
router.post(
  '/create-leave-request',
  controller.createLeaveRequest.bind(controller)
)

/**
 * Example Usage (Admin Only):
 * PUT /api/leave-requests/update-leave-request/3
 * Request Body:
 * {
 *   "status": "approved",
 *   "approvedBy": "1"
 * }
 *   - Updates leave request with id 3; only admins can update the status.
 */
router.put(
  '/update-leave-request/:id',
  admin,
  controller.updateLeaveRequest.bind(controller)
)

/**
 * Example Usage (Admin Only):
 * DELETE /api/leave-requests/delete-leave-request/4
 *   - Deletes the leave request with id 4.
 */
router.delete(
  '/delete-leave-request/:id',
  admin,
  controller.deleteLeaveRequest.bind(controller)
)

export default router
