// src/controllers/DocumentsController.js

import { PrismaClient } from '@prisma/client'
import multer from 'multer'
import path from 'path'
import fs from 'fs/promises'

const prisma = new PrismaClient()

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Create dynamic folder structure: uploads/employeeId/documentType
    const employeeId = req.params.employeeId
    const documentType = req.body.documentType.toUpperCase()
    const uploadDir = `uploads/${employeeId}/${documentType}`

    try {
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    } catch (error) {
      cb(error)
    }
  },
  filename: (req, file, cb) => {
    // Generate unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const fileExt = path.extname(file.originalname)
    const fileName = `${file.fieldname}-${uniqueSuffix}${fileExt}`
    cb(null, fileName)
  }
})

const fileFilter = (req, file, cb) => {
  // Validate document type before processing file
  const validDocumentTypes = ['CV', 'ID', 'CONTRACT']
  console.log(req.body)
  const documentType = req.body.documentType?.toUpperCase()
  
  if (!documentType || !validDocumentTypes.includes(documentType)) {
    cb(new Error('Invalid document type. Must be CV, ID, or CONTRACT'))
    return
  }

  // Allow specific file types based on document type
  const allowedTypes = {
    CV: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    ID: ['image/jpeg', 'image/png', 'application/pdf'],
    CONTRACT: ['application/pdf']
  }

  if (allowedTypes[documentType].includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error(`Invalid file type for ${documentType}`))
  }
}

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
})

export class DocumentsController {
  // Upload new document
  async uploadDocument (req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({
          status: 'error',
          message: 'No file uploaded'
        })
      }

      const employeeId = parseInt(req.params.employeeId)
      const documentType = req.body.documentType.toUpperCase()

      // Check if employee exists
      const employee = await prisma.employee.findUnique({
        where: { id: employeeId }
      })

      if (!employee) {
        await fs.unlink(req.file.path)
        return res.status(404).json({
          status: 'error',
          message: 'Employee not found'
        })
      }

      // Check if document type already exists for employee
      const existingDocument = await prisma.document.findFirst({
        where: {
          employeeId,
          documentType
        }
      })

      // If document exists, delete old file and update record
      if (existingDocument) {
        try {
          await fs.unlink(existingDocument.filePath)
        } catch (error) {
          console.error('Error deleting old file:', error)
        }

        const updatedDocument = await prisma.document.update({
          where: { id: existingDocument.id },
          data: {
            filePath: req.file.path,
            uploadedAt: new Date()
          }
        })

        return res.status(200).json({
          status: 'success',
          message: 'Document updated successfully',
          data: { document: updatedDocument }
        })
      }

      // Create new document record
      const document = await prisma.document.create({
        data: {
          employeeId,
          documentType,
          filePath: req.file.path
        }
      })

      return res.status(201).json({
        status: 'success',
        data: { document }
      })
    } catch (error) {
      // Clean up uploaded file if database operation fails
      if (req.file) {
        try {
          await fs.unlink(req.file.path)
        } catch (unlinkError) {
          console.error('Error deleting file:', unlinkError)
        }
      }

      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload document',
        error: error.message
      })
    }
  }

  // Get all documents for an employee
  async getEmployeeDocuments (req, res) {
    try {
      const employeeId = parseInt(req.params.employeeId)

      const documents = await prisma.document.findMany({
        where: { employeeId },
        orderBy: { uploadedAt: 'desc' }
      })

      return res.status(200).json({
        status: 'success',
        data: { documents }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch documents',
        error: error.message
      })
    }
  }

  // Get single document
  async getDocument (req, res) {
    try {
      const id = parseInt(req.params.id)
      const document = await prisma.document.findUnique({
        where: { id }
      })

      if (!document) {
        return res.status(404).json({
          status: 'error',
          message: 'Document not found'
        })
      }

      return res.status(200).json({
        status: 'success',
        data: { document }
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to fetch document',
        error: error.message
      })
    }
  }

  // Download document
  async downloadDocument (req, res) {
    try {
      const id = parseInt(req.params.id)
      const document = await prisma.document.findUnique({
        where: { id }
      })

      if (!document) {
        return res.status(404).json({
          status: 'error',
          message: 'Document not found'
        })
      }

      // Check if file exists
      try {
        await fs.access(document.filePath)
      } catch (error) {
        return res.status(404).json({
          status: 'error',
          message: 'File not found on server'
        })
      }

      res.download(document.filePath)
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to download document',
        error: error.message
      })
    }
  }

  // Delete document
  async deleteDocument (req, res) {
    try {
      const id = parseInt(req.params.id)

      const document = await prisma.document.findUnique({
        where: { id }
      })

      if (!document) {
        return res.status(404).json({
          status: 'error',
          message: 'Document not found'
        })
      }

      // Delete file from storage
      try {
        await fs.unlink(document.filePath)
      } catch (error) {
        console.error('Error deleting file:', error)
      }

      // Delete document record
      await prisma.document.delete({
        where: { id }
      })

      return res.status(200).json({
        status: 'success',
        message: 'Document deleted successfully'
      })
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to delete document',
        error: error.message
      })
    }
  }
}

export default DocumentsController
