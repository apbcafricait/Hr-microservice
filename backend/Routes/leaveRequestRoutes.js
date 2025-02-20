// src/routes/leaveRequestRoutes.js
import { Router } from 'express'
import LeaveRequestsController from '../controllers/LeaveRequestsController.js'
import {authenticated, admin} from '../middleware/Authentication.js'

const router = Router()
const controller = new LeaveRequestsController()

// All routes are protected by authentication
router.use(authenticated)

router.get(
  '/get-leave-request/:id',
  controller.getLeaveRequest.bind(controller)
)

router.get(
  '/get-all-leave-requests',
  controller.getAllLeaveRequests.bind(controller)
)
router.get('/get-all-organisation-leave-requests/:employeeId', 
  controller.getLeaveRequestsByOrganisation.bind(controller))
router.post(
  '/create-leave-request',
  controller.createLeaveRequest.bind(controller)
)

router.put(
  '/update-leave-request/:id',
 
  controller.updateLeaveRequest.bind(controller)
)

router.delete(
  '/delete-leave-request/:id',
  admin,
  controller.deleteLeaveRequest.bind(controller)
)

export default router
