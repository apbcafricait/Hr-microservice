// src/routes/organisationRoutes.js

import { Router } from 'express'
import { OrganisationsController } from '../controllers/OrganisationsController.js'
// import { authMiddleware } from '../middleware/authMiddleware.js'
// import { isAdminMiddleware } from '../middleware/isAdminMiddleware.js'

const router = Router()
const organisationsController = new OrganisationsController()

// Protect all routes
// router.use(authMiddleware)

// Public routes (for authenticated users)
router.get('/', organisationsController.getAllOrganisations)
router.get('/:id', organisationsController.getOrganisation)
router.get('/:id/stats', organisationsController.getOrganisationStats)

// Admin only routes
// router.use(isAdminMiddleware)
router.post('/', organisationsController.createOrganisation)
router.put('/:id', organisationsController.updateOrganisation)
router.delete('/:id', organisationsController.deleteOrganisation)

export default router
