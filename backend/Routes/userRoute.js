import { getAllUsers,RegisterUser, loginUser, logout } from "../controllers/userController.js";
import express from "express";
import { authenticated, admin, manager } from "../middleware/Authentication.js";

const router = express.Router();

router.get('/', authenticated, admin(), getAllUsers);
router.post("/", RegisterUser);
router.post("/login", loginUser);
router.post("/logout", logout)

export default router;