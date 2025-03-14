// routes/reportRoutes.js
import { Router } from 'express'
import { reportController } from '../controllers/reportController.js'

const router = Router()

router.get('/', reportController.getAllReports)
router.get('/:id', reportController.getReport)
router.post('/', reportController.createReport)
router.put('/:id', reportController.updateReport)
router.delete('/:id', reportController.deleteReport)

export default router
