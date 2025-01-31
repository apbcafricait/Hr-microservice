// src/routes/documentRoutes.js

import { Router } from 'express'
import {
  DocumentsController,
  upload
} from '../controllers/DocumentsController.js'
import { authenticated } from '../middleware/Authentication.js'

const router = Router()
const documentsController = new DocumentsController()

// Protect all routes
router.use(authenticated)

// Document routes
router.get('/employee/:employeeId', documentsController.getEmployeeDocuments)
router.get('/:id', documentsController.getDocument)
router.post(
  '/upload/:employeeId',
  upload.single('document'),
  documentsController.uploadDocument
)
router.delete('/:id', documentsController.deleteDocument)
router.get('/download/:id', documentsController.downloadDocument)

export default router
