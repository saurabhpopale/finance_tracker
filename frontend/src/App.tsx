import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { useEffect } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./pages/VerifyOTP";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

import { useAppDispatch, useAppSelector } from "./hooks/redux";

import { fetchCurrentUser } from "./store/authSlice";
import AddTransaction from "./pages/AddTransaction";
import Transactions from "./pages/Transactions";
import EditTransaction from "./pages/EditTransaction";
import Reports from "./pages/Reports";

const App = () => {
  const dispatch = useAppDispatch();

  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin mx-auto"></div>

          <p className="text-white mt-4 font-semibold">
            Loading Finance Manager...
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Logged-out users can access these */}

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Only logged-in users can access these */}

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          <Route path="/reports" element={<Reports />} />
        </Route>

        {/* Default */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* Unknown URL */}

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
