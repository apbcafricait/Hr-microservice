import prisma from "../../db/prisma.js";
import { asyncHandler } from "../middleware/asynchandler.js";

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
    const {email, password} = req.body;
    const user = await prisma.users.create({
        data: {
            email,
            password,
            role: "admin"
        }
    });

    if(user){
        res.status(201).json({
            id: user.id,
            email: user.email,
            role: user.role
        });
    }else{
        res.status(400).json({message: "Invalid user data"});
    }
})

export { getAllUsers, RegisterUser };