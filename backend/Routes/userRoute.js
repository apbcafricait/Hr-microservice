import { getAllUsers,RegisterUser, loginUser, logout } from "../controllers/userController.js";
import express from "express";
import { authenticated, admin, manager } from "../middleware/Authentication.js";

const router = express.Router();

router.get(
  '/',
  authenticated,
  (req, res, next) => {
    if (admin(req) || manager(req)) {
      next()
    } else {
      res.status(403).json({ error: 'Access denied' })
    }
  },
  getAllUsers
)

router.post("/", RegisterUser);
router.post("/login", loginUser);
router.post("/logout", logout)


export default router;