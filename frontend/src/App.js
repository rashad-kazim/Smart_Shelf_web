// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layout & Common Components
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CustomDialog from "./components/common/CustomDialog";

// Page Imports
import LoginPage from "./Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StoresPage from "./pages/Stores/StoresPage";
import NewInstallationPage from "./pages/Stores/NewInstallationPage";
import FirmwarePage from "./pages/Firmware/FirmwarePage";
import ProfileDetailsPage from "./pages/Profile/ProfileDetailsPage";
import NotFoundPage from "./pages/misc/NotFoundPage";

// User Pages Imports
import UsersAndRolesPage from "./pages/Users/UsersAndRolesPage";
import SupermarketUsers from "./pages/Users/SupermarketUsers";
import AddUserForm from "./pages/Users/AddUserForm";
import EditUserForm from "./pages/Users/EditUserForm";
import CompanyUsers from "./pages/Users/CompanyUsers";
import AddCompanyUserForm from "./pages/Users/AddCompanyUserForm";
import EditCompanyUserForm from "./pages/Users/EditCompanyUserForm";

function App() {
  const {
    isAuthenticated,
    showDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    dialogCallback,
    setShowDialog,
    currentColors,
    appTranslations,
    language,
  } = useAuth();

  const translations = appTranslations[language] || appTranslations.en;

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
        />

        <Route
          path="/"
          element={
            isAuthenticated ? <MainLayout /> : <Navigate to="/login" replace />
          }>
          <Route
            index
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="stores"
            element={
              <ProtectedRoute>
                <StoresPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="new-installation"
            element={
              <ProtectedRoute>
                <NewInstallationPage />
              </ProtectedRoute>
            }
          />

          {/* === KULLANICI YÖNETİMİ ALT ROTALARI (DÜZELTİLMİŞ) === */}
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <UsersAndRolesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/supermarket"
            element={
              <ProtectedRoute>
                <SupermarketUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/supermarket/add"
            element={
              <ProtectedRoute>
                <AddUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/supermarket/edit/:userId"
            element={
              <ProtectedRoute>
                <EditUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/company"
            element={
              <ProtectedRoute>
                <CompanyUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/company/add"
            element={
              <ProtectedRoute>
                <AddCompanyUserForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/company/edit/:userId"
            element={
              <ProtectedRoute>
                <EditCompanyUserForm />
              </ProtectedRoute>
            }
          />

          <Route
            path="firmware"
            element={
              <ProtectedRoute>
                <FirmwarePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile-details"
            element={
              <ProtectedRoute>
                <ProfileDetailsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Eşleşmeyen tüm yollar için 404 Sayfası */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {showDialog && (
        <CustomDialog
          title={dialogTitle}
          message={dialogMessage}
          type={dialogType}
          onConfirm={dialogCallback}
          onCancel={() => setShowDialog(false)}
          colors={currentColors}
          translations={translations.stores || {}}
        />
      )}
    </>
  );
}

export default App;
