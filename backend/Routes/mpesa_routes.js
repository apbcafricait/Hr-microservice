import express from 'express'
import {
  makeStkPushRequest,
  stkCallBackUrl
} from '../controllers/mpesaController.js'
const router = express.Router()
router.route('/').get((req, res) => {
  res.send('Hello mpesa!')
})
router.route('/stk-push-request').post(makeStkPushRequest)
router.route('/stk-push/callback').post(stkCallBackUrl)

export default router
