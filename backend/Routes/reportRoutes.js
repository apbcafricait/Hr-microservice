// routes/reportRoutes.js
import { Router } from 'express'
import { reportController } from '../controllers/reportController.js'

const router = Router()

// Get filtered reports by employeeId and organisationId (with pagination)
router.get('/', reportController.getFilteredReports) // Must come before '/:id'

// Get all reports for an organisation
router.get('/organisation/:organisationId', reportController.getOrganisationReports)

// Get all reports for an employee
router.get('/employee/:employeeId', reportController.getEmployeeReports)

// Get specific report by ID
router.get('/:id', reportController.getReport)

// Create a new report
router.post('/', reportController.createReport)

// Update a report
router.put('/:id', reportController.updateReport)

// Delete a report
router.delete('/:id', reportController.deleteReport)

export default router
