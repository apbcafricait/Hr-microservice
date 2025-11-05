import express from 'express'
import {
  createLeaveType,
  getLeaveTypes,
  getAllLeaveTypes,
  getLeaveType
} from '../controllers/leaveTypeController.js'

const router = express.Router()

router.post('/', createLeaveType)
router.get('/all', getAllLeaveTypes)
router.get('/', getLeaveTypes) //using organisationId as query param
router.get('/:id', getLeaveType)
// getting a single leave type already created by its id

export default router
