import {changePassword} from '../controllers/changePassword.js'
import express from 'express' 
const router = express.Router()
// Change password route
router.put('/change-password', changePassword)
export default router