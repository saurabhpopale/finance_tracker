import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";

import User from "../models/user.model.js";
import generateToken from "../utils/generateToken.js";
import { AuthRequest } from "../types/auth.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const OTP_EXPIRY = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const generateOTP = (): string => {
    return crypto.randomInt(100000, 1000000).toString();
};

const hashOTP = async (otp: string): Promise<string> => {
    return await bcrypt.hash(otp, 10);
};

const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isProduction = process.env.NODE_ENV === "production";

const setAuthCookie = (res: Response, userId: string): string => {
    const token = generateToken(userId);

    res.cookie("token", token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return token;
};


/* =========================
   REGISTER
========================= */

export const register = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const {
            firstName,
            lastName,
            email,
            password
        } = req.body;

        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                success: false,
                message: "All fields are required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        if (password.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

            return;
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        /*
         * If user exists but has not verified email,
         * allow registration again and send a fresh OTP.
         */
        if (existingUser && !existingUser.isVerified) {

            const otp = generateOTP();
            const otpHash = await hashOTP(otp);

            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.password = await bcrypt.hash(password, 10);

            existingUser.otpHash = otpHash;
            existingUser.otpExpiresAt = new Date(
                Date.now() + OTP_EXPIRY
            );
            existingUser.otpAttempts = 0;
            existingUser.otpPurpose = "register";

            await existingUser.save();

            await sendOTPEmail(
                normalizedEmail,
                otp,
                "register"
            );

            res.status(200).json({
                success: true,
                message: "OTP sent to your email",
                email: normalizedEmail
            });

            return;
        }

        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });

            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );

        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        const user = await User.create({
            firstName,
            lastName,
            email: normalizedEmail,
            password: hashedPassword,
            isVerified: false,
            otpHash,
            otpExpiresAt: new Date(
                Date.now() + OTP_EXPIRY
            ),
            otpAttempts: 0,
            otpPurpose: "register"
        });

        await sendOTPEmail(
            normalizedEmail,
            otp,
            "register"
        );

        res.status(201).json({
            success: true,
            message: "OTP sent to your email",
            email: user.email
        });

    } catch (error: any) {
        console.error("Register error:", error);

        if (error?.code === 11000) {
            res.status(400).json({
                success: false,
                message: "User already exists"
            });

            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   VERIFY REGISTRATION OTP
========================= */

export const verifyRegistrationOTP = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        }).select(
            "+otpHash +otpExpiresAt +otpAttempts +otpPurpose"
        );

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });

            return;
        }

        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: "Email is already verified"
            });

            return;
        }

        if (user.otpPurpose !== "register") {
            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        if (
            !user.otpHash ||
            !user.otpExpiresAt
        ) {
            res.status(400).json({
                success: false,
                message: "OTP not found. Please request a new OTP."
            });

            return;
        }

        if (user.otpExpiresAt.getTime() < Date.now()) {
            res.status(400).json({
                success: false,
                message: "OTP has expired"
            });

            return;
        }

        if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
            res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });

            return;
        }

        const isCorrect = await bcrypt.compare(
            otp.toString(),
            user.otpHash
        );

        if (!isCorrect) {

            user.otpAttempts += 1;

            await user.save();

            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        user.isVerified = true;

        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpAttempts = 0;
        user.otpPurpose = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });

    } catch (error) {
        console.error(
            "Verify registration OTP error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   RESEND REGISTRATION OTP
========================= */

export const resendRegistrationOTP = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email is required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });

            return;
        }

        if (user.isVerified) {
            res.status(400).json({
                success: false,
                message: "Email is already verified"
            });

            return;
        }

        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        user.otpHash = otpHash;
        user.otpExpiresAt = new Date(
            Date.now() + OTP_EXPIRY
        );
        user.otpAttempts = 0;
        user.otpPurpose = "register";

        await user.save();

        await sendOTPEmail(
            user.email,
            otp,
            "register"
        );

        res.status(200).json({
            success: true,
            message: "New OTP sent to your email"
        });

    } catch (error) {
        console.error(
            "Resend registration OTP error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   LOGIN
========================= */

export const login = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            res.status(401).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        if (!user.isVerified) {
            res.status(403).json({
                success: false,
                message: "Please verify your email before logging in"
            });

            return;
        }

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            res.status(401).json({
                success: false,
                message: "Wrong password"
            });

            return;
        }

        const token = setAuthCookie(
            res,
            user._id.toString()
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   FORGOT PASSWORD
========================= */

export const forgotPassword = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { email } = req.body;

        if (!email) {
            res.status(400).json({
                success: false,
                message: "Email is required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        });

        /*
         * Do not reveal whether an email exists.
         */
        if (!user) {
            res.status(200).json({
                success: true,
                message: "If an account exists, an OTP has been sent"
            });

            return;
        }

        if (!user.isVerified) {
            res.status(200).json({
                success: true,
                message: "If an account exists, an OTP has been sent"
            });

            return;
        }

        const otp = generateOTP();
        const otpHash = await hashOTP(otp);

        user.otpHash = otpHash;
        user.otpExpiresAt = new Date(
            Date.now() + OTP_EXPIRY
        );
        user.otpAttempts = 0;
        user.otpPurpose = "reset";

        await user.save();

        await sendOTPEmail(
            user.email,
            otp,
            "reset"
        );

        res.status(200).json({
            success: true,
            message: "If an account exists, an OTP has been sent"
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   VERIFY RESET OTP
========================= */

export const verifyResetOTP = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        }).select(
            "+otpHash +otpExpiresAt +otpAttempts +otpPurpose"
        );

        if (
            !user ||
            user.otpPurpose !== "reset" ||
            !user.otpHash ||
            !user.otpExpiresAt
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        if (user.otpExpiresAt.getTime() < Date.now()) {
            res.status(400).json({
                success: false,
                message: "OTP has expired"
            });

            return;
        }

        if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
            res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });

            return;
        }

        const isCorrect = await bcrypt.compare(
            otp.toString(),
            user.otpHash
        );

        if (!isCorrect) {

            user.otpAttempts += 1;

            await user.save();

            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        res.status(200).json({
            success: true,
            message: "OTP verified successfully"
        });

    } catch (error) {
        console.error(
            "Verify reset OTP error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   RESET PASSWORD
========================= */

export const resetPassword = async (
    req: Request,
    res: Response
): Promise<void> => {

    try {
        const {
            email,
            otp,
            newPassword
        } = req.body;

        if (!email || !otp || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Email, OTP and new password are required"
            });

            return;
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!isValidEmail(normalizedEmail)) {
            res.status(400).json({
                success: false,
                message: "Invalid email"
            });

            return;
        }

        if (newPassword.length < 6) {
            res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });

            return;
        }

        const user = await User.findOne({
            email: normalizedEmail
        }).select(
            "+otpHash +otpExpiresAt +otpAttempts +otpPurpose"
        );

        if (
            !user ||
            user.otpPurpose !== "reset" ||
            !user.otpHash ||
            !user.otpExpiresAt
        ) {
            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        if (user.otpExpiresAt.getTime() < Date.now()) {
            res.status(400).json({
                success: false,
                message: "OTP has expired"
            });

            return;
        }

        if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
            res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });

            return;
        }

        const isCorrect = await bcrypt.compare(
            otp.toString(),
            user.otpHash
        );

        if (!isCorrect) {

            user.otpAttempts += 1;

            await user.save();

            res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });

            return;
        }

        user.password = await bcrypt.hash(
            newPassword,
            10
        );

        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpAttempts = 0;
        user.otpPurpose = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


/* =========================
   LOGOUT
========================= */

export const logout = (
    req: Request,
    res: Response
): void => {

    res.clearCookie("token", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });

    res.status(200).json({
        success: true,
        message: "Logout successful"
    });
};


/* =========================
   CURRENT USER
========================= */

export const getCurrentUser = async (
    req: AuthRequest,
    res: Response
): Promise<void> => {

    try {

        if (!req.userId) {
            res.status(401).json({
                success: false,
                message: "Unauthorized"
            });

            return;
        }

        const user = await User.findById(
            req.userId
        ).select("-password");

        if (!user) {
            res.status(404).json({
                success: false,
                message: "User not found"
            });

            return;
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};