// src/routes/payrollRoutes.js

import { Router } from 'express'
import { PayrollController } from '../controllers/PayrollController.js'

import { authenticated, admin, manager
 } from '../middleware/Authentication.js'

const router = Router()
const payrollController = new PayrollController()

// Protect all routes
router.use(authenticated)

// Employee accessible routes
router.get(
  '/employee/:employeeId/history',
  payrollController.getEmployeePayrollHistory
)
router.get('/download/:id', payrollController.downloadPayslip)


// Add to your existing routes
router.get(
  '/summaries/organisation/:organisationId',
  payrollController.getPayrollSummaries
)
router.get(
  '/summaries/department/:organisationId/:departmentId',
  payrollController.getDepartmentPayrollSummary
)

// Admin only routes
// router.use(admin)
router.post(
  '/process/employee/:employeeId',
  payrollController.processEmployeePayroll
)

router.post('/process/bulk', payrollController.processBulkPayroll)

export default router
