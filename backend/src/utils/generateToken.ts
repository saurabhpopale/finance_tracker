import jwt from "jsonwebtoken";

interface TokenPayload {
    userId: string;
}

const generateToken = (userId: string): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        { userId },
        secret,
        { expiresIn: "7d" }
    );
};

export default generateToken;