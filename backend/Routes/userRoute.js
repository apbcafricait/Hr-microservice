import { getAllUsers,RegisterUser, loginUser } from "../controllers/userController.js";
import express from "express";
import { authenticated } from "../middleware/Authentication.js";

const router = express.Router();

router.get("/", authenticated, getAllUsers);
router.post("/", RegisterUser);
router.post("/login", loginUser);


export default router;