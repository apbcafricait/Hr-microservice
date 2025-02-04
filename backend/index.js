import express from "express"
import dotenv from "dotenv"
import employeeRoutes from "./Routes/employeeRoutes.js"
import organisationRoutes from './Routes/organisationRoutes.js'
import userRoute from "./Routes/userRoute.js"
import documentRoutes from './Routes/documentRoutes.js'
import cookieParser from "cookie-parser"
import timeAttendance from "./Routes/timeAttendance.js"

import mpesaRoutes from "./Routes/mpesa_routes.js"
import leaveBalanceRoutes from './Routes/leaveBalanceRoutes.js'
import leaveRequestRoutes from './Routes/leaveRequestRoutes.js'

const app = express()

dotenv.config()

app.use(express.json())
app.use(cookieParser())

const PORT = process.env.PORT || 8100;

app.use('/api/employees', employeeRoutes)
app.use('/api/organisations', organisationRoutes)
app.use("/api/users", userRoute)

app.use('/uploads', express.static('uploads'))

app.use('/api/documents', documentRoutes)

app.use('/api/time-attendance', timeAttendance)

app.use('/api/leave-balances', leaveBalanceRoutes)
app.use('/api/leave-requests', leaveRequestRoutes)


/* 
@params Payment routes
*/
app.use("/api/mpesa", mpesaRoutes)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})