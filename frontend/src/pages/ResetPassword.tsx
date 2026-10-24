import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
    verifyResetOTP,
    resetPassword,
    clearError
} from "../store/authSlice";

const ResetPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email || "";

    const { loading, error } = useAppSelector(
        (state) => state.auth
    );

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [otpVerified, setOtpVerified] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleVerifyOTP = async () => {
        if (otp.length !== 6) {
            return;
        }

        const result = await dispatch(
            verifyResetOTP({
                email,
                otp
            })
        );

        if (verifyResetOTP.fulfilled.match(result)) {
            setOtpVerified(true);
            setSuccessMessage("OTP verified successfully.");
        }
    };

    const handleResetPassword = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return;
        }

        const result = await dispatch(
            resetPassword({
                email,
                otp,
                newPassword
            })
        );

        if (resetPassword.fulfilled.match(result)) {
            setSuccessMessage(
                "Password reset successfully. Redirecting to login..."
            );
            navigate("/login");
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-orange-50 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        Invalid Request
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Please start the password reset process again.
                    </p>

                    <Link
                        to="/forgot-password"
                        className="inline-block mt-5 text-orange-500 font-medium"
                    >
                        Forgot Password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Reset Password
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-6">
                    OTP sent to <strong>{email}</strong>
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                        {successMessage}
                    </div>
                )}

                {!otpVerified ? (
                    <div className="space-y-5">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Enter OTP
                            </label>

                            <input
                                type="text"
                                value={otp}
                                onChange={(e) =>
                                    setOtp(
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6)
                                    )
                                }
                                placeholder="Enter 6-digit OTP"
                                maxLength={6}
                                className="w-full px-4 py-3 border rounded-lg text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleVerifyOTP}
                            disabled={loading || otp.length !== 6}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                        >
                            {loading
                                ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Verifying...
                                </span>
                            ) : (
                                "Verify OTP →"
                            )}
                        </button>

                    </div>
                ) : (
                    <form
                        onSubmit={handleResetPassword}
                        className="space-y-5"
                    >

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                                className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                                required
                                minLength={6}
                            />
                        </div>

                        {newPassword &&
                            confirmPassword &&
                            newPassword !== confirmPassword && (
                                <p className="text-sm text-red-500">
                                    Passwords do not match.
                                </p>
                            )}

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                newPassword !== confirmPassword
                            }
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                        >
                            {loading
                                ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                        Resetting...
                                    </span>
                                ) : (
                                    "Reset Password →"
                                )}
                        </button>

                    </form>
                )}

                <div className="text-center mt-6">
                    <Link
                        to="/login"
                        className="text-violet-500 hover:text-violet-600 font-medium"
                    >
                        Back to Login
                    </Link>
                </div>

            </div>
        </div>
    );
};

export default ResetPassword;