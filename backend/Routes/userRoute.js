import { getAllUsers,RegisterUser, loginUser } from "../controllers/userController.js";
import express from "express";
import { authenticated,admin, manager } from "../middleware/Authentication.js";

const router = express.Router();

router.get("/", authenticated, manager, getAllUsers);
router.post("/", RegisterUser);
router.post("/login", loginUser);


export default router;