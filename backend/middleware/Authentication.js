//limit access to certain routes to authenticated users
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../../db/prisma.js";

const authenticated = (req, res, next) => {
    //check if myToken is in the cookie

    const myToken = req.cookies.authToken;
    if (!myToken) {
        return res.status(401).json({ message: "Not authorized" });
    }

    //validate the token if it exists
    try {
        const decoded = jwt.verify(myToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).json({ message: "Not authorized" });
    }

};

const admin = async (req, res, next) => {
 const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
 const userId = decoded.id;

    const user = await prisma.users.findUnique({
        where: { id: userId }
    });

    const isAdmin = user.role === "admin";
    if (!isAdmin) {
        return res.status(401).json({ message: "Not authorized as Admin" });
    }
    next();
};

const manager = async (req, res, next) => {
    const decoded = jwt.verify(req.cookies.authToken, process.env.JWT_SECRET);
    const userId = decoded.id

    const user = await prisma.users.findUnique({
        where:{id: userId}
    })

    const isManager = user.role === "manager";

    if(!isManager){
        return res.status(401).json({message: "Not authorized as Manager"})
    }
    next();
}
export { authenticated, admin, manager };