import api from "./api";

import type {
    LoginData,
    RegisterData,
    VerifyOTPData,
    EmailData,
    ResetPasswordData,
    AuthResponse
} from "../types/auth";


// ==================== REGISTER ====================

export const registerUser = async (
    data: RegisterData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/register",
        data
    );

    return response.data;
};


// ==================== VERIFY REGISTRATION OTP ====================

export const verifyRegistrationOTPService = async (
    data: VerifyOTPData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/verify-registration-otp",
        data
    );

    return response.data;
};


// ==================== RESEND REGISTRATION OTP ====================

export const resendRegistrationOTPService = async (
    data: EmailData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/resend-registration-otp",
        data
    );

    return response.data;
};


// ==================== LOGIN ====================

export const loginUser = async (
    data: LoginData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/login",
        data
    );

    return response.data;
};


// ==================== FORGOT PASSWORD ====================

export const forgotPasswordService = async (data: EmailData): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/forgot-password",
        data
    );

    return response.data;
};


// ==================== VERIFY RESET OTP ====================

export const verifyResetOTPService = async (
    data: VerifyOTPData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/verify-reset-otp",
        data
    );

    return response.data;
};


// ==================== RESET PASSWORD ====================

export const resetPasswordService = async (
    data: ResetPasswordData
): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/reset-password",
        data
    );

    return response.data;
};


// ==================== LOGOUT ====================

export const logoutUser = async (): Promise<AuthResponse> => {

    const response = await api.post<AuthResponse>(
        "/api/auth/logout"
    );

    return response.data;
};


// ==================== CURRENT USER ====================

export const getCurrentUser = async (): Promise<AuthResponse> => {

    const response = await api.get<AuthResponse>(
        "/api/auth/user"
    );

    return response.data;
};

