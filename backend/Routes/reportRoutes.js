// routes/reportRoutes.js
import { Router } from 'express'
import { reportController } from '../controllers/reportController.js'

const router = Router()

// Get all reports for an organisation
router.get(
  '/organisation/:organisationId',
  reportController.getOrganisationReports
)

// Get all reports for an employee
router.get('/employee/:employeeId', reportController.getEmployeeReports)

// Get specific report
router.get('/:id', reportController.getReport)

// Create new report
router.post('/', reportController.createReport)

// Update report
router.put('/:id', reportController.updateReport)

// Delete report
router.delete('/:id', reportController.deleteReport)

export default router
