import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { forgotPassword, clearError } from "../store/authSlice";

const ForgotPassword = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { loading, error } = useAppSelector(
        (state) => state.auth
    );

    const [email, setEmail] = useState("");

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedEmail = email.trim();

        const result = await dispatch(
            forgotPassword({ email: trimmedEmail })
        );

        if (forgotPassword.fulfilled.match(result)) {
            navigate("/reset-password", {
                state: { email: trimmedEmail }
            });
        }
    };

    return (
        <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-2xl font-bold text-gray-800 text-center">
                    Forgot Password?
                </h1>

                <p className="text-gray-500 text-center mt-2 mb-6">
                    Enter your email and we'll send you an OTP.
                </p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (error) dispatch(clearError());
                            }}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                    >
                        {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Sending OTP...
                                </span>
                            ) : (
                                "Send OTP →"
                            )}
                    </button>

                </form>

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

export default ForgotPassword;