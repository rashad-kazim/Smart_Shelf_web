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
  const location = useLocation(); // Mevcut sayfanın yolunu almak için

  // 1. Kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
  if (!isAuthenticated) {
    // Kullanıcının gitmek istediği sayfayı state olarak saklayalım ki,
    // giriş yaptıktan sonra oraya geri dönebilsin.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Kullanıcının rolüne göre erişebileceği rotaları al.
  const allowedRoutes = PERMISSIONS[profileUser?.role]?.viewableRoutes || [];

  // Gidilmek istenen ana rotayı bulalım (ör: /users/add -> /users)
  const mainRoute = `/${location.pathname.split("/")[1] || ""}`;

  // 3. Kullanıcının bu ana rotaya erişim izni yoksa, "Erişim Reddedildi" sayfasını göster.
  if (!allowedRoutes.includes(mainRoute)) {
    return <AccessDeniedPage />;
  }

  // 4. Tüm kontrollerden geçtiyse, istenen sayfayı (children) göster.
  return children;
};

export default ProtectedRoute;
