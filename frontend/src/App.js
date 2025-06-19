// src/App.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PERMISSIONS } from "./config/roles";

// Importing components and pages
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CustomDialog from "./components/common/CustomDialog";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import StoresPage from "./pages/Stores/StoresPage";
import EditStoreDetailsPage from "./pages/Stores/StoreEditing/EditStoreDetailsPage";
import StoreEditingWorkflow from "./pages/Stores/StoreEditing/StoreEditingWorkflow";
import DeleteStorePage from "./pages/Stores/DeleteStorePage";
import NewInstallationPage from "./pages/Stores/NewInstallationPage";
import ViewLogsPage from "./pages/Stores/Logs/ViewLogsPage";
import StoreLogDetailsPage from "./pages/Stores/Logs/StoreLogDetailsPage";
import ServerLogsPage from "./pages/Stores/Logs/ServerLogsPage";
import ESP32LogsPage from "./pages/Stores/Logs/ESP32LogsPage";
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
import AccessDeniedPage from "./pages/misc/AccessDeniedPage";

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
    profileUser,
  } = useAuth();

  const dialogTranslations = appTranslations[language]?.stores || {};
  const canViewCompanyUsers =
    PERMISSIONS[profileUser?.role]?.canAccessCompanyUsers || false;

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Routes visible to logged-in and authorized users */}
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

          {/* Stores Routes */}
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
          <Route
            path="edit-store-details"
            element={
              <ProtectedRoute>
                <EditStoreDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="edit-store-workflow/:storeId"
            element={
              <ProtectedRoute>
                <StoreEditingWorkflow />
              </ProtectedRoute>
            }
          />
          <Route
            path="delete-store"
            element={
              <ProtectedRoute>
                <DeleteStorePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="view-logs"
            element={
              <ProtectedRoute>
                <ViewLogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="store-log-details/:storeId"
            element={
              <ProtectedRoute>
                <StoreLogDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="server-logs/:storeId"
            element={
              <ProtectedRoute>
                <ServerLogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="esp32-logs/:storeId"
            element={
              <ProtectedRoute>
                <ESP32LogsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="users"
            element={
              <ProtectedRoute>
                <UsersAndRolesPage />
              </ProtectedRoute>
            }
          />

          {/* All authorized roles can access supermarket users */}
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

          {/* Only users with permission can access company users */}
          <Route
            path="users/company"
            element={
              <ProtectedRoute>
                {canViewCompanyUsers ? <CompanyUsers /> : <AccessDeniedPage />}
              </ProtectedRoute>
            }
          />
          <Route
            path="users/company/add"
            element={
              <ProtectedRoute>
                {canViewCompanyUsers ? (
                  <AddCompanyUserForm />
                ) : (
                  <AccessDeniedPage />
                )}
              </ProtectedRoute>
            }
          />
          <Route
            path="users/company/edit/:userId"
            element={
              <ProtectedRoute>
                {canViewCompanyUsers ? (
                  <EditCompanyUserForm />
                ) : (
                  <AccessDeniedPage />
                )}
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
          translations={dialogTranslations}
        />
      )}
    </>
  );
}

export default App;
