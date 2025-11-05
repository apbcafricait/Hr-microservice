import express from "express";
import {
  getAllUsers,
  RegisterUser,
  loginUser,
  logout
} from "../controllers/userController.js";

import { authenticated, admin, manager } from "../middleware/Authentication.js";
import prisma from "../../db/prisma.js"; // ✅ Ensure correct import path

const router = express.Router();

// ✅ Custom inline check: allow either admin or manager
router.get('/', authenticated, async (req, res, next) => {
  try {
    const id = req.user?.id;
    if (!id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await prisma.users.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Allow if user is either admin or manager
    if (user.role === 'admin' || user.role === 'manager') {
      return getAllUsers(req, res); // ✅ Direct call to controller
    } else {
      return res.status(403).json({ message: 'Not authorized as Admin or Manager' });
    }
  } catch (err) {
    console.error('Route error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Other user routes
router.post("/", RegisterUser);
router.post("/login", loginUser);
router.post("/logout", logout);

export default router;
