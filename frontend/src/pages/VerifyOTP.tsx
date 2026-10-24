import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
    resendRegistrationOTP,
    verifyRegistrationOTP,
    clearError
} from "../store/authSlice";

const VerifyOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector(
        (state) => state.auth
    );

    const emailFromState = location.state?.email || "";

    const [email, setEmail] = useState<string>(
        emailFromState
    );

    const [otp, setOtp] = useState<string>("");
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [timer, setTimer] = useState<number>(300);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    // =========================
    // OTP COUNTDOWN
    // =========================

    useEffect(() => {
        if (timer <= 0) {
            return;
        }

        const interval = setInterval(() => {
            setTimer((previous) => previous - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    // =========================
    // FORMAT TIMER
    // =========================

    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;

    const formattedTime = `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

    // =========================
    // VERIFY OTP
    // =========================

    const handleVerify = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setSuccessMessage("");

        if (!email) {
            return;
        }

        if (otp.length !== 6) {
            return;
        }

        const result = await dispatch(
            verifyRegistrationOTP({
                email,
                otp
            })
        );

        if (
            verifyRegistrationOTP.fulfilled.match(
                result
            )
        ) {
            setSuccessMessage(
                "Email verified successfully!"
            );

            setTimeout(() => {
                navigate("/login");
            }, 1000);
        }
    };

    // =========================
    // RESEND OTP
    // =========================

    const handleResend = async () => {
        if (!email) {
            return;
        }

        setSuccessMessage("");

        const result = await dispatch(
            resendRegistrationOTP({
                email
            })
        );

        if (
            resendRegistrationOTP.fulfilled.match(
                result
            )
        ) {
            setOtp("");
            setTimer(300);

            setSuccessMessage(
                "A new OTP has been sent to your email."
            );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-10">

            {/* Background decoration */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>

            <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>


            {/* Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10">

                    {/* Logo */}
                    <div className="text-center mb-8">

                        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg">

                            <span className="text-3xl">
                                ✉️
                            </span>

                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Verify Your Email
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Enter the 6-digit OTP sent to your email
                        </p>

                    </div>


                    {/* Email */}
                    <div className="mb-5">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Email Address
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                        />

                    </div>


                    {/* OTP */}
                    <form
                        onSubmit={handleVerify}
                        className="space-y-5"
                    >

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Verification OTP
                            </label>

                            <input
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => {
                                    const value =
                                        e.target.value.replace(
                                            /\D/g,
                                            ""
                                        );

                                    setOtp(value);
                                }}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 text-center text-2xl tracking-[0.5em] font-bold outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                            />

                        </div>


                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                ⚠️ {error}
                            </div>
                        )}


                        {/* Success */}
                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                                ✅ {successMessage}
                            </div>
                        )}


                        {/* Timer */}
                        <div className="text-center">

                            {timer > 0 ? (
                                <p className="text-sm text-gray-500">
                                    OTP expires in{" "}
                                    <span className="font-bold text-indigo-600">
                                        {formattedTime}
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-red-500 font-medium">
                                    OTP expired. Please request a new OTP.
                                </p>
                            )}

                        </div>


                        {/* Verify */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                otp.length !== 6 ||
                                !email
                            }
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                        >

                            {loading ? (
                                <span className="flex items-center justify-center gap-2">

                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>

                                    Verifying...

                                </span>
                            ) : (
                                "Verify OTP →"
                            )}

                        </button>

                    </form>


                    {/* Resend */}
                    <div className="text-center mt-6">

                        <p className="text-sm text-gray-500">
                            Didn't receive the OTP?
                        </p>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={
                                loading ||
                                timer > 0 ||
                                !email
                            }
                            className="mt-2 text-indigo-600 font-semibold hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Resend OTP
                        </button>

                    </div>


                    {/* Back to register */}
                    <div className="text-center mt-6">

                        <Link
                            to="/register"
                            className="text-sm text-gray-500 hover:text-indigo-600 transition"
                        >
                            ← Back to Registration
                        </Link>

                    </div>


                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        🔐 Your financial data is securely protected
                    </p>

                </div>

            </div>

        </div>
    );
};

export default VerifyOTP;