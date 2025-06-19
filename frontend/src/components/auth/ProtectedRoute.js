// ProtectedRoute.js
// Role-based route protection component
// src/components/auth/ProtectedRoute.js
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { PERMISSIONS } from "../../config/roles";
import AccessDeniedPage from "../../pages/misc/AccessDeniedPage";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, profileUser } = useAuth();
  const location = useLocation(); // To get the current page's path

  // 1. If the user is not logged in, redirect to the login page.
  if (!isAuthenticated) {
    // Save the page the user wants to go to as state,
    // so they can return there after logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Get the routes the user can access based on their role.
  const allowedRoutes = PERMISSIONS[profileUser?.role]?.viewableRoutes || [];

  // Find the main route being accessed (e.g., /users/add -> /users)
  const mainRoute = `/${location.pathname.split("/")[1] || ""}`;

  // 3. If the user does not have permission to access this main route, show the "Access Denied" page.
  if (!allowedRoutes.includes(mainRoute)) {
    return <AccessDeniedPage />;
  }

  // 4. If all checks pass, show the requested page (children).
  return children;
};

export default ProtectedRoute;
