import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { login, clearError } from "../store/authSlice";

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { loading, error } = useAppSelector(
        (state) => state.auth
    );
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const result = await dispatch(login({ email: email.trim(), password }));

        if (login.fulfilled.match(result)) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4 py-10">

            {/* Background decoration */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-pink-300/20 rounded-full blur-3xl"></div>

            {/* Login Card */}
            <div className="relative w-full max-w-md">

                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 sm:p-10">

                    {/* Logo / Heading */}
                    <div className="text-center mb-8">

                        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-pink-500 flex items-center justify-center shadow-lg">
                            <span className="text-3xl">💰</span>
                        </div>

                        <h1 className="text-3xl font-extrabold text-gray-800">
                            Finance Manager
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Log in your account and manage your money
                        </p>

                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    ✉️
                                </span>

                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) dispatch(clearError());
                                    }}
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />

                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>

                            <div className="relative">

                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) dispatch(clearError());
                                    }}
                                    required
                                    minLength={6}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 outline-none transition focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                                />
                                <div className="text-right">
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-violet-600 hover:text-violet-700 font-medium"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>

                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Password must contain at least 6 characters.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-200 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                    Loging in...
                                </span>
                            ) : (
                                "Login →"
                            )}
                        </button>

                    </form>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-7">
                        <div className="h-px bg-gray-200 flex-1"></div>

                        <span className="text-sm text-gray-400">
                            Don't have an account?
                        </span>

                        <div className="h-px bg-gray-200 flex-1"></div>
                    </div>

                    {/* Register */}
                    <Link
                        to="/register"
                        className="block w-full text-center py-3 rounded-xl border-2 border-indigo-500 text-indigo-600 font-semibold transition-all duration-300 hover:bg-indigo-50 hover:shadow-md"
                    >
                        Create an account
                    </Link>

                    {/* Footer */}
                    <p className="text-center text-xs text-gray-400 mt-6">
                        🔐 Your financial data is securely protected
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;