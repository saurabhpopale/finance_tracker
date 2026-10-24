import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../hooks/redux";

const PublicRoute = () => {

    const user = useAppSelector((state) => state.auth.user);

    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicRoute;