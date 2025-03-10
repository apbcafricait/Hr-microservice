import express from 'express'
import {
  createLeaveType,
  getLeaveTypes,
  getLeaveType
} from '../controllers/leaveTypeController.js'

const router = express.Router()

router.post('/', createLeaveType)
router.get('/', getLeaveTypes)
router.get('/:id', getLeaveType)

export default router
