import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectRoute = ({ user, allowedRoles }) => {
  if (!user) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but role not allowed
    return <Navigate to="/" replace />;
  }

  // Allowed → render the route
  return <Outlet />;
};

export default ProtectRoute;
