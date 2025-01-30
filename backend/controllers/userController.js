import prisma from "../../db/prisma.js";
import { asyncHandler } from "../middleware/asynchandler.js";
import { encryptPassword } from "../utils/encryptPassword.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";


//api/users - GET
//Get all users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await prisma.users.findMany();
    res.json(users);
});

//Register a new user
//POST /api/users
//Access: Public
const RegisterUser = asyncHandler(async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { email, password } = req.body;
        const encrypted_password = await encryptPassword(password);

        if (!email || !password) {
            return res.status(400).json({ message: "Invalid user data" });
        }

        const user = await prisma.users.create({
            data: {
                email,
                password_hash: encrypted_password,
                role: "admin"
            }
        });
        console.log(user.id);
        
        if(user){
          
        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            password: user.password_hash
        });
    }
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//Login a user
//POST /api/users/login
//Access: Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
  
    const user = await prisma.users.findUnique({
      where: { email: email.toLowerCase() } 
    });
  
    if (!user || !user.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log(user.id);
  
    try {
      const isMatch = await bcrypt.compare(password, user.password_hash);
      
      if (isMatch) {
        await generateToken(res, user.id);
        res.json({
          id: user.id,
          email: user.email,
          role: user.role
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
        console.error("Error logging in user:", error);
      res.status(500).json({ message: "Server error during authentication" });
    }
  });
export { getAllUsers, RegisterUser, loginUser };