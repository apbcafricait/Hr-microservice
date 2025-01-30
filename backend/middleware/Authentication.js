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

export { authenticated };