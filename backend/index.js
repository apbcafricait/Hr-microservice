import express from "express"
import dotenv from "dotenv"
import userRoute from "./Routes/userRoute.js"

const app = express()
dotenv.config()
const PORT = process.env.PORT || 8100;

app.get("/", (req, res) => {
  res.send("Hello World!")
})
app.use("/api/users", userRoute)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})