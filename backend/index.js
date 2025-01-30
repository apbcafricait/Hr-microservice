import express from "express"
import dotenv from "dotenv"
import employeeRoutes from "./Routes/employeeRoutes.js"
import organisationRoutes from './Routes/organisationRoutes.js'
import userRoute from "./Routes/userRoute.js"


const app = express()

dotenv.config()

app.use(express.json())
const PORT = process.env.PORT || 8100;
app.use('/api/employees', employeeRoutes)
app.use('/api/organisations', organisationRoutes)
app.get("/", (req, res) => {
  res.send("Hello World!")
})
app.use("/api/users", userRoute)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})