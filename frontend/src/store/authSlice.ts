import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    verifyRegistrationOTPService,
    resendRegistrationOTPService,
    forgotPasswordService,
    verifyResetOTPService,
    resetPasswordService
} from "../services/authService";

import type {
    LoginData,
    RegisterData,
    VerifyOTPData,
    EmailData,
    ResetPasswordData
} from "../types/auth";

import type { User } from "../types/user";

export const extractErrorMessage = (
    error: unknown,
    fallback: string
): string => {
    if (axios.isAxiosError(error)) {
        return (
            error.response?.data?.message ||
            error.response?.data?.error ||
            (typeof error.response?.data === "string"
                ? error.response.data
                : null) ||
            error.message ||
            fallback
        );
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallback;
};


interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isInitialized: boolean;
}


const initialState: AuthState = {
    user: null,
    loading: false,
    error: null,
    isInitialized: false
};


// ==================== REGISTER ====================

export const register = createAsyncThunk(
    "auth/register",
    async (
        data: RegisterData,
        { rejectWithValue }
    ) => {

        try {

            const response = await registerUser(data);

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Registration failed")
            );
        }
    }
);


// ==================== VERIFY REGISTRATION OTP ====================

export const verifyRegistrationOTP = createAsyncThunk(
    "auth/verifyRegistrationOTP",
    async (
        data: VerifyOTPData,
        { rejectWithValue }
    ) => {

        try {

            const response =
                await verifyRegistrationOTPService(data);

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "OTP verification failed")
            );
        }
    }
);


// ==================== RESEND REGISTRATION OTP ====================

export const resendRegistrationOTP = createAsyncThunk(
    "auth/resendRegistrationOTP",
    async (
        data: EmailData,
        { rejectWithValue }
    ) => {

        try {

            const response =
                await resendRegistrationOTPService(data);

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Failed to resend OTP")
            );
        }
    }
);


// ==================== LOGIN ====================

export const login = createAsyncThunk(
    "auth/login",
    async (
        data: LoginData,
        { rejectWithValue }
    ) => {

        try {

            const response = await loginUser(data);

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Login failed")
            );
        }
    }
);


// ==================== CURRENT USER ====================

export const fetchCurrentUser = createAsyncThunk(
    "auth/current",
    async (
        _,
        { rejectWithValue }
    ) => {

        try {

            const response =
                await getCurrentUser();

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Not authenticated")
            );
        }
    }
);


// ==================== LOGOUT ====================

export const logout = createAsyncThunk(
    "auth/logout",
    async (
        _,
        { rejectWithValue }
    ) => {

        try {

            const response =
                await logoutUser();

            return response;

        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Logout failed")
            );
        }
    }
);

export const forgotPassword = createAsyncThunk(
    "api/auth/forgot-password",
    async (data: EmailData, { rejectWithValue }) => {
        try {
            return await forgotPasswordService(data);
        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Failed to send OTP")
            );
        }
    }
);
export const verifyResetOTP = createAsyncThunk(
    "auth/verifyResetOTP",
    async (data: VerifyOTPData, { rejectWithValue }) => {
        try {
            return await verifyResetOTPService(data);
        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Failed to verify OTP")
            );
        }
    }
);
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async (
        data: ResetPasswordData,
        { rejectWithValue }
    ) => {
        try {
            return await resetPasswordService(data);
        } catch (error: unknown) {
            return rejectWithValue(
                extractErrorMessage(error, "Failed to reset password")
            );
        }
    }
);


// ==================== SLICE ====================

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },

    extraReducers: (builder) => {

        // ==================== REGISTER ====================

        builder
            .addCase(
                register.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                register.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;

                    /*
                     * Do NOT set user here.
                     *
                     * Registration now only sends OTP.
                     * User will be authenticated after login.
                     */
                }
            )

            .addCase(
                register.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // ==================== VERIFY REGISTRATION OTP ====================

        builder
            .addCase(
                verifyRegistrationOTP.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                verifyRegistrationOTP.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                verifyRegistrationOTP.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // ==================== RESEND OTP ====================

        builder
            .addCase(
                resendRegistrationOTP.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                resendRegistrationOTP.fulfilled,
                (state) => {

                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                resendRegistrationOTP.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // ==================== LOGIN ====================

        builder
            .addCase(
                login.pending,
                (state) => {

                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                login.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.error = null;

                    if (action.payload.user) {

                        state.user =
                            action.payload.user;
                    }
                }
            )

            .addCase(
                login.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );


        // ==================== CURRENT USER ====================

        builder
            .addCase(
                fetchCurrentUser.pending,
                (state) => {

                    state.loading = true;
                }
            )

            .addCase(
                fetchCurrentUser.fulfilled,
                (state, action) => {

                    state.loading = false;
                    state.isInitialized = true;
                    state.error = null;

                    if (action.payload.user) {

                        state.user =
                            action.payload.user;
                    }
                }
            )

            .addCase(
                fetchCurrentUser.rejected,
                (state) => {

                    state.loading = false;
                    state.isInitialized = true;
                    state.user = null;
                }
            );


        // ==================== LOGOUT ====================

        builder
            .addCase(
                logout.pending,
                (state) => {

                    state.loading = true;
                }
            )

            .addCase(
                logout.fulfilled,
                (state) => {

                    state.user = null;
                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                logout.rejected,
                (state, action) => {

                    state.loading = false;

                    state.error =
                        action.payload as string;
                }
            );

        builder
        
            .addCase(
                forgotPassword.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                forgotPassword.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            );
        
        builder
            .addCase(
                verifyResetOTP.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                verifyResetOTP.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                verifyResetOTP.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            );
        
        builder
            .addCase(
                resetPassword.pending,
                (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )

            .addCase(
                resetPassword.fulfilled,
                (state) => {
                    state.loading = false;
                    state.error = null;
                }
            )

            .addCase(
                resetPassword.rejected,
                (state, action) => {
                    state.loading = false;
                    state.error =
                        action.payload as string;
                }
            );
    }
});

export const { clearError } = authSlice.actions;

export default authSlice.reducer;