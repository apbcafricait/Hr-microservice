// routes/dependentRoutes.js
import express from 'express'
import {
  getEmployeeDependents,
  getDependent,
  createDependent,
  updateDependent,
  deleteDependent
} from '../controllers/dependentController.js'
import { authenticated } from '../middleware/Authentication.js'

const router = express.Router()

// All routes are protected
router.use(authenticated)

// Routes for dependents
router.route('/employee/:employeeId').get(getEmployeeDependents)

router.route('/').post(createDependent)

router
  .route('/:id')
  .get(getDependent)
  .put(updateDependent)
  .delete(deleteDependent)

export default router
