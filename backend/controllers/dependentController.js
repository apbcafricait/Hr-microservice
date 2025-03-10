// controllers/dependentController.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get all dependents for an employee
export const getEmployeeDependents = async (req, res) => {
  try {
    const { employeeId } = parseInt(req.params)


    const dependents = await prisma.dependent.findMany({
      where: { employeeId },
      orderBy: { name: 'asc' }
    })

    return res.status(200).json({
      success: true,
      count: dependents.length,
      data: dependents
    })
  } catch (error) {
    console.error('Error fetching dependents:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

// Get a single dependent
export const getDependent = async (req, res) => {
  try {
    const { id } = req.params

    const dependent = await prisma.dependent.findUnique({
      where: { id }
    })

    if (!dependent) {
      return res.status(404).json({
        success: false,
        message: 'Dependent not found'
      })
    }

    return res.status(200).json({
      success: true,
      data: dependent
    })
  } catch (error) {
    console.error('Error fetching dependent:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

// Create a new dependent
export const createDependent = async (req, res) => {
  try {
    const { employeeId, name, relationship, dateOfBirth } = req.body

    // Validate input
    if (!employeeId || !name || !relationship || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide all required fields: employeeId, name, relationship, dateOfBirth'
      })
    }

    // Check if employee exists
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      })
    }

    const dependent = await prisma.dependent.create({
      data: {
        employeeId,
        name,
        relationship,
        dateOfBirth: new Date(dateOfBirth)
      }
    })

    return res.status(201).json({
      success: true,
      data: dependent
    })
  } catch (error) {
    console.error('Error creating dependent:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

// Update a dependent
export const updateDependent = async (req, res) => {
  try {
    const { id } = req.params
    const { name, relationship, dateOfBirth } = req.body

    // Check if dependent exists
    const existingDependent = await prisma.dependent.findUnique({
      where: { id }
    })

    if (!existingDependent) {
      return res.status(404).json({
        success: false,
        message: 'Dependent not found'
      })
    }

    const updatedDependent = await prisma.dependent.update({
      where: { id },
      data: {
        name: name || existingDependent.name,
        relationship: relationship || existingDependent.relationship,
        dateOfBirth: dateOfBirth
          ? new Date(dateOfBirth)
          : existingDependent.dateOfBirth
      }
    })

    return res.status(200).json({
      success: true,
      data: updatedDependent
    })
  } catch (error) {
    console.error('Error updating dependent:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}

// Delete a dependent
export const deleteDependent = async (req, res) => {
  try {
    const { id } = req.params

    // Check if dependent exists
    const dependent = await prisma.dependent.findUnique({
      where: { id }
    })

    if (!dependent) {
      return res.status(404).json({
        success: false,
        message: 'Dependent not found'
      })
    }

    await prisma.dependent.delete({
      where: { id }
    })

    return res.status(200).json({
      success: true,
      message: 'Dependent deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting dependent:', error)
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    })
  }
}
