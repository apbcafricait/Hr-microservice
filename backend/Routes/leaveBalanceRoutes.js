// src/routes/leaveBalanceRoutes.js

import { Router } from 'express'
import { LeaveBalancesController } from '../controllers/LeaveBalancesController.js'
import {authenticated, admin} from '../middleware/Authentication.js'

const router = Router()
const leaveBalancesController = new LeaveBalancesController()

// Protect all routes


// Employee-accessible routes
router.get('/employee/:employeeId', leaveBalancesController.getLeaveBalance)

// Admin-only routes
// router.use(admin)
router.post('/employee/:employeeId', leaveBalancesController.createLeaveBalance)
router.put('/employee/:employeeId', leaveBalancesController.updateLeaveBalance)
router.post('/employee/:employeeId/deduct', leaveBalancesController.deductLeave)
router.post('/reset-annual', leaveBalancesController.resetAnnualLeave)
router.get('/', leaveBalancesController.getAllLeaveBalances)

export default router
