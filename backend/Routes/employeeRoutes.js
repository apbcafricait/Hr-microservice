// src/routes/employeeRoutes.js

import { Router } from 'express'
import { EmployeesController } from '../controllers/EmployeesController.js'
// import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()
const employeesController = new EmployeesController()

// Protected routes
// router.use(authMiddleware)

// Employee routes
router.get('/', employeesController.getAllEmployees)
router.get('/:id', employeesController.getEmployee)
router.post('/', employeesController.createEmployee)
router.put('/:id', employeesController.updateEmployee)
router.delete('/:id', employeesController.deleteEmployee)

// Organization specific routes
router.get(
  '/organisation/:organisationId',
  employeesController.getEmployeesByOrganisation
)
router.get('/stats/:organisationId', employeesController.getEmployeeStats)

export default router
