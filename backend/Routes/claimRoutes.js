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
router.post('/assign', authenticated, claimController.assignClaim)
router.put('/status', authenticated, claimController.updateClaimStatus)

export default router
