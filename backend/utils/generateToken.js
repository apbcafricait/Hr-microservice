import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (res, id) => {
    const myToken = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });

    res.cookie('authToken', myToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

export { generateToken};