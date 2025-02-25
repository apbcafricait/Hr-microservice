import { Router } from 'express';
import {
  createAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  clockOut,
  deleteAttendance,
} from '../controllers/timeAttendanceController.js';
import { authenticated } from '../middleware/Authentication.js';
const router = Router();


// Protect all routes
router.use(authenticated);

// Routes
router.post('/create', createAttendance);
router.get('/', getAllAttendance);
router.get('/:employeeId', getAttendanceByEmployee);
router.put('/clock-out/:employeeId', clockOut);
router.delete('/:id', deleteAttendance);

export default router;
