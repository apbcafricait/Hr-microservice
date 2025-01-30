import prisma from "../../db/prisma.js";
import { asyncHandler } from "../middleware/asynchandler.js";
import { encryptPassword } from "../utils/encryptPassword.js";
import { decryptPassword } from "../utils/decryptPassword.js";

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

        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role,
            password: user.password_hash
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

//Login a user
//POST /api/users/login
//Access: Public

const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;

    //check if email and password are provided
    if (!email || !password) {
        return res.status(400).json({message: "Invalid user data"});
    }

    //check if user exists
    const user = await prisma.users.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        return res.status(400).json({message: "Invalid user data"});
    }

    //check if password is correct
    const isMatch = await decryptPassword(password, user.password_hash);
    if(isMatch){
        res.json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    }
    else{
        return res.status(400).json({message: "Invalid user data"});
    }
});


export { getAllUsers, RegisterUser, loginUser };