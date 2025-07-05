// src/components/auth/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDeniedPage from "../../pages/misc/AccessDeniedPage";
import GlobalLoader from "../common/GlobalLoader";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isAuthLoading } = useAuth();

  // 1. CHECK: If the initial authentication check is still ongoing,
  // don't make any decisions, just show the loading screen.
  if (isAuthLoading) {
    return <GlobalLoader />;
  }

  // 2. CHECK: The check is done and the user is not logged in, redirect to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. CHECK: The user is logged in, but does not have permission to view this page,
  // show the "Access Denied" page.
  const hasPermission = allowedRoles ? allowedRoles.includes(user.role) : true;
  if (!hasPermission) {
    return <AccessDeniedPage />;
  }

  // 4. CHECK: If all checks pass, show the actual page.
  return <Outlet />;
};

export default ProtectedRoute;
