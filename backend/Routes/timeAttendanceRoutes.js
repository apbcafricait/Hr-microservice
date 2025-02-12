// routes/timeAttendance.js
import express from 'express'
import {
  createAttendance,
  getAllAttendance,
  getAttendanceByEmployee,
  clockOut,
  deleteAttendance
} from '../controllers/timeAttendanceController.js'
import { authenticated } from '../middleware/Authentication.js'




// Clock-in endpoint
router.post("/clock-in", async (req, res) => {
    const { employeeId } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO attendance (employee_id) VALUES ($1) RETURNING *`,
            [employeeId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Clock-out endpoint
router.post("/clock-out", async (req, res) => {
    const { employeeId } = req.body;
    try {
        const result = await pool.query(
            `UPDATE attendance
             SET clock_out_time = NOW(), duration = NOW() - clock_in_time
             WHERE employee_id = $1 AND clock_out_time IS NULL
             RETURNING *`,
            [employeeId]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get all attendance records
router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT employees.first_name, employees.last_name, attendance.*
             FROM attendance
             JOIN employees ON employees.id = attendance.employee_id
             ORDER BY attendance.created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
const router = express.Router()
// Protect all routes
router.use(authenticated)
router.post('/create', createAttendance)
router.get('/', getAllAttendance)
router.get('/:employeeId', getAttendanceByEmployee)
router.put('/clock-out/:employeeId', clockOut)
router.delete('/:id', deleteAttendance)

export default router
