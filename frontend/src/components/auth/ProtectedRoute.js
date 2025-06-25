// src/components/auth/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDeniedPage from "../../pages/misc/AccessDeniedPage";
import GlobalLoader from "../common/GlobalLoader"; // GlobalLoader'ı import ediyoruz

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, isAuthLoading } = useAuth();

  // 1. KONTROL: Eğer ilk kimlik doğrulama kontrolü hala devam ediyorsa,
  // hiçbir karar verme, sadece yükleme ekranı göster.
  if (isAuthLoading) {
    return <GlobalLoader />;
  }

  // 2. KONTROL: Kontrol bitti ve kullanıcı giriş yapmamışsa, login sayfasına yönlendir.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. KONTROL: Kullanıcı giriş yapmış, ama bu sayfayı görmeye rolü yetmiyorsa,
  // "Erişim Reddedildi" sayfasını göster.
  const hasPermission = allowedRoles ? allowedRoles.includes(user.role) : true;
  if (!hasPermission) {
    return <AccessDeniedPage />;
  }

  // 4. KONTROL: Eğer tüm kontrollerden geçtiyse, asıl sayfayı göster.
  return <Outlet />;
};

export default ProtectedRoute;
