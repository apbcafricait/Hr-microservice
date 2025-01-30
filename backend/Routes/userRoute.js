import { getAllUsers,RegisterUser, loginUser } from "../controllers/userController.js";
import express from "express";

const router = express.Router();

router.get("/", getAllUsers);
router.post("/", RegisterUser);
router.post("/login", loginUser);


export default router;