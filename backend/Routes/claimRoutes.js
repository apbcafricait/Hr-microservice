import express from 'express'
import { ClaimController } from '../controllers/claimController.js'
import { authenticated, admin } from '../middleware/Authentication.js'

const router = express.Router()
const claimController = new ClaimController()

// Employee routes
router.post('/submit', authenticated, claimController.submitClaim)
router.get('/my-claims', authenticated, claimController.getMyClaims)

// Admin routes
router.post('/all', authenticated, claimController.getAllClaims)
router.delete('/:id', authenticated, claimController.deleteClaim)
router.post('/assign', authenticated, claimController.assignClaim)
// Admin: Get claims by organisation ID
router.get('/organisation/:organisationId', authenticated, claimController.getClaimsByOrganisation)

// Assign to a department head route
// router.post('/assign-department-head', authenticated, claimController.assignClaimToDepartmentHead)
router.put('/status', authenticated, claimController.updateClaimStatus)

export default router
