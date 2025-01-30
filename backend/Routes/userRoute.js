import { getAllUsers,RegisterUser } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", RegisterUser);


export default router;