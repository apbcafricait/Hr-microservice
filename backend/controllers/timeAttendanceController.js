// controllers/timeAttendanceController.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createAttendance = async (req, res) => {
  const { employeeId, location } = req.body
const clockIn = new Date()
  try {
    const attendance = await prisma.timeAttendance.create({
      data: {
        employeeId,
        clockIn, 
        location
      }
    })

    return res.status(201).json({
      message: 'Clock-in recorded successfully',
      attendance
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error clocking in',
      error: error.message
    })
  }
}

// Get all time attendance records
export const getAllAttendance = async (req, res) => {
  try {
    const attendanceRecords = await prisma.timeAttendance.findMany()
    res.status(200).json(attendanceRecords)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error fetching attendance records',
        error: error.message
      })
  }
}

// Get attendance records for a specific employee
export const getAttendanceByEmployee = async (req, res) => {
  const { employeeId } = req.params

  try {
    const attendanceRecords = await prisma.timeAttendance.findMany({
      where: {
        employeeId: Number(employeeId)
      }
    })
    res.status(200).json(attendanceRecords)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error fetching attendance records for employee',
        error: error.message
      })
  }
}

// Update clock-out time for an employee
export const clockOut = async (req, res) => {
  const { employeeId } = req.body

  try {
    // Find the last clock-in record for the employee
    const attendance = await prisma.timeAttendance.findFirst({
      where: {
         employeeId,
        clockOut: null 
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!attendance) {
      return res.status(400).json({
        message: 'No active clock-in found for this employee'
      })
    }

    // Update the clock-out time
    const updatedAttendance = await prisma.timeAttendance.update({
      where: {
        id: attendance.id
      },
      data: {
        clockOut: new Date() 
      }
    })

    return res.status(200).json({
      message: 'Clock-out recorded successfully',
      updatedAttendance
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Error clocking out',
      error: error.message
    })
  }
}


// Delete a time attendance record
export const deleteAttendance = async (req, res) => {
  const { id } = req.params

  try {
    const deletedAttendance = await prisma.timeAttendance.delete({
      where: {
        id: Number(id)
      }
    })
    res.status(200).json(deletedAttendance)
  } catch (error) {
    res
      .status(500)
      .json({
        message: 'Error deleting attendance record',
        error: error.message
      })
  }
}
