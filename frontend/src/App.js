// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts and Pages
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StoresPage from "./pages/Stores/StoresPage";
import NewInstallationPage from "./pages/Stores/NewInstallationPage";
import UsersAndRolesPage from "./pages/Users/UsersAndRolesPage";
import SupermarketUsers from "./pages/Users/SupermarketUsers";
import AddUserForm from "./pages/Users/AddUserForm";
import EditUserForm from "./pages/Users/EditUserForm";
import CompanyUsers from "./pages/Users/CompanyUsers";
import AddCompanyUserForm from "./pages/Users/AddCompanyUserForm";
import EditCompanyUserForm from "./pages/Users/EditCompanyUserForm";
import FirmwarePage from "./pages/Firmware/FirmwarePage";
import ProfileDetailsPage from "./pages/Profile/ProfileDetailsPage";
import NotFoundPage from "./pages/misc/NotFoundPage";
import ProtectedRoute from "./components/auth/ProtectedRoute"; // Kendi dosyasına taşındı

function App() {
  const {
    isAuthenticated,
    appTranslations,
    currentColors,
    language,
    setLanguage,
  } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/" />
          ) : (
            <LoginPage
              appTranslations={appTranslations}
              currentColors={currentColors}
            />
          )
        }
      />

      <Route
        path="/"
        element={
          isAuthenticated ? (
            <MainLayout
              appTranslations={appTranslations}
              currentColors={currentColors}
              language={language}
              setLanguage={setLanguage}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }>
        {/* Her bir rota, ProtectedRoute ile sarmalanarak rol bazlı kontrol edilir */}
        <Route
          index
          element={
            <ProtectedRoute routePath="/">
              <DashboardPage
                appTranslations={appTranslations}
                currentColors={currentColors}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="stores"
          element={
            <ProtectedRoute routePath="/stores">
              <StoresPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="new-installation"
          element={
            <ProtectedRoute routePath="/new-installation">
              <NewInstallationPage />
            </ProtectedRoute>
          }
        />

        {/* === KULLANICI YÖNETİMİ ALT ROTALARI === */}
        <Route
          path="users"
          element={
            <ProtectedRoute routePath="/users">
              <UsersAndRolesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/supermarket"
          element={
            <ProtectedRoute routePath="/users">
              <SupermarketUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/supermarket/add"
          element={
            <ProtectedRoute routePath="/users">
              <AddUserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/supermarket/edit/:userId"
          element={
            <ProtectedRoute routePath="/users">
              <EditUserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/company"
          element={
            <ProtectedRoute routePath="/users">
              <CompanyUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/company/add"
          element={
            <ProtectedRoute routePath="/users">
              <AddCompanyUserForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/company/edit/:userId"
          element={
            <ProtectedRoute routePath="/users">
              <EditCompanyUserForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="firmware"
          element={
            <ProtectedRoute routePath="/firmware">
              <FirmwarePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile-details"
          element={
            <ProtectedRoute routePath="/profile-details">
              <ProfileDetailsPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Eşleşmeyen tüm yollar için 404 Sayfası */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
