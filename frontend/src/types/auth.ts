import type { User } from "./user";

export interface LoginData {
    email: string;
    password: string;
}

export interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface VerifyOTPData {
    email: string;
    otp: string;
}

export interface EmailData {
    email: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: User;
    email?: string;
}

export interface ResetPasswordData {
    email: string;
    otp: string;
    newPassword: string;
}