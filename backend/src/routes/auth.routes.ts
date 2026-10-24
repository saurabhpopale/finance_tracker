import { Router } from "express";

import {
    getCurrentUser,
    login,
    logout,
    register,
    verifyRegistrationOTP,
    resendRegistrationOTP,
    forgotPassword,
    verifyResetOTP,
    resetPassword
} from "../controllers/auth.controllers.js";

import authMiddleware from "../middlewares/auth.js";

const authRouter = Router();


// Registration
authRouter.post("/register", register);

authRouter.post(
    "/verify-registration-otp",
    verifyRegistrationOTP
);

authRouter.post(
    "/resend-registration-otp",
    resendRegistrationOTP
);


// Login
authRouter.post("/login", login);


// Forgot password
authRouter.post(
    "/forgot-password",
    forgotPassword
);

authRouter.post(
    "/verify-reset-otp",
    verifyResetOTP
);

authRouter.post(
    "/reset-password",
    resetPassword
);


// Logout
authRouter.post("/logout", logout);


// Current user
authRouter.get(
    "/user",
    authMiddleware,
    getCurrentUser
);

export default authRouter;