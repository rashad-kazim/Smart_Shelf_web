// src/App.js

import React from "react";
// FIX: BrowserRouter (as Router) import removed from here.
// It should be in the project's main entry file, index.js.
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAuth } from "./context/AuthContext";
import { ROLES } from "./config/roles";

// Layout and Helper Components
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFoundPage from "./pages/misc/NotFoundPage";
import AccessDeniedPage from "./pages/misc/AccessDeniedPage";

import CustomDialog from "./components/common/CustomDialog";

// Importing Pages
import LoginPage from "./Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import FirmwarePage from "./pages/Firmware/FirmwarePage";
import ProfileDetailsPage from "./pages/Profile/ProfileDetailsPage";
import StoresPage from "./pages/Stores/StoresPage";
import NewInstallationPage from "./pages/Stores/NewInstallationPage";
import EditStoreDetailsPage from "./pages/Stores/StoreEditing/EditStoreDetailsPage";
import StoreEditingWorkflow from "./pages/Stores/StoreEditing/StoreEditingWorkflow";
import DeleteStorePage from "./pages/Stores/DeleteStorePage";
import ViewLogsPage from "./pages/Stores/Logs/ViewLogsPage";
import StoreLogDetailsPage from "./pages/Stores/Logs/StoreLogDetailsPage";
import ServerLogsPage from "./pages/Stores/Logs/ServerLogsPage";
import ESP32LogsPage from "./pages/Stores/Logs/ESP32LogsPage";
import UsersAndRolesPage from "./pages/Users/UsersAndRolesPage";
import SupermarketUsers from "./pages/Users/SupermarketUsers";
import AddSupermarketUserForm from "./pages/Users/AddSupermarketUserForm";
import EditSupermarketUserForm from "./pages/Users/EditSupermarketUserForm";
import CompanyUsers from "./pages/Users/CompanyUsers";
import AddCompanyUserForm from "./pages/Users/AddCompanyUserForm";
import EditCompanyUserForm from "./pages/Users/EditCompanyUserForm";

// Main component managing routes
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Users who are not logged in can only see the Login page. If logged in, redirect to home page. */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
      />

      {/* All other pages are wrapped with MainLayout and require login */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* --- ROUTES WITH AUTHORIZATION RULES APPLIED --- */}

          {/* Dashboard: All authorized company employees */}
          <Route index element={<DashboardPage />} />

          {/* Store Management Routes */}
          <Route path="stores" element={<StoresPage />} />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COUNTRY_CHIEF,
                  ROLES.ENGINEER,
                ]}
              />
            }>
            <Route path="new-installation" element={<NewInstallationPage />} />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COUNTRY_CHIEF,
                  ROLES.ENGINEER,
                  ROLES.ANALYST,
                ]}
              />
            }>
            <Route
              path="edit-store-details"
              element={<EditStoreDetailsPage />}
            />
            <Route
              path="edit-store-workflow/:storeId"
              element={<StoreEditingWorkflow />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.COUNTRY_CHIEF]}
              />
            }>
            <Route path="delete-store" element={<DeleteStorePage />} />
          </Route>

          {/* Log Viewing Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ANALYST]}
              />
            }>
            <Route path="view-logs" element={<ViewLogsPage />} />
            <Route
              path="store-log-details/:storeId"
              element={<StoreLogDetailsPage />}
            />
            <Route path="server-logs/:storeId" element={<ServerLogsPage />} />
            <Route path="esp32-logs/:storeId" element={<ESP32LogsPage />} />
          </Route>

          {/* User Management Routes */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ANALYST]}
              />
            }>
            <Route path="users" element={<UsersAndRolesPage />} />
            <Route path="users/company" element={<CompanyUsers />} />
            <Route path="users/company/add" element={<AddCompanyUserForm />} />
            <Route
              path="users/company/edit/:userId"
              element={<EditCompanyUserForm />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  ROLES.ADMIN,
                  ROLES.COUNTRY_CHIEF,
                  ROLES.ANALYST,
                  ROLES.ENGINEER,
                ]}
              />
            }>
            <Route path="users/supermarket" element={<SupermarketUsers />} />
            <Route
              path="users/supermarket/add"
              element={<AddSupermarketUserForm />}
            />
            <Route
              path="users/supermarket/edit/:userId"
              element={<EditSupermarketUserForm />}
            />
          </Route>

          {/* Firmware Page: Admin only */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="firmware" element={<FirmwarePage />} />
          </Route>

          {/* Profile Page: Accessible to all logged-in users */}
          <Route path="profile-details" element={<ProfileDetailsPage />} />

          {/* Unauthorized Access Page */}
          <Route path="/access-denied" element={<AccessDeniedPage />} />
        </Route>
      </Route>

      {/* All unmatched paths are redirected to the 404 page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

const AppWithDialog = () => {
  const { showDialog, dialogConfig, hideMyDialog } = useAuth();

  return (
    <>
      <AppRoutes /> {/* All page routes */}
      {/* If showDialog is true, show CustomDialog with settings from context */}
      {showDialog && (
        <CustomDialog
          title={dialogConfig.title}
          message={dialogConfig.message}
          type={dialogConfig.type}
          confirmationText={dialogConfig.confirmationText}
          onConfirm={() => {
            dialogConfig.onConfirm();
            hideMyDialog();
          }}
          onCancel={hideMyDialog}
        />
      )}
    </>
  );
};

// Main App component
function App() {
  return (
    <AppProvider>
      <AppWithDialog />
    </AppProvider>
  );
}

export default App;
