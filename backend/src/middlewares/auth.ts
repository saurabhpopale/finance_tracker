import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { AuthRequest } from "../types/auth.js";

interface JwtPayload {
    userId: string;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: "Authentication required"
            });

            return;
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            res.status(500).json({
                success: false,
                message: "JWT secret is not configured"
            });

            return;
        }
        const decoded = jwt.verify(
            token,
            secret
        ) as JwtPayload;
        req.userId = decoded.userId;

        next();

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};

export default authMiddleware;