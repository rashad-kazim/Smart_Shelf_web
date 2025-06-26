// src/App.js

import React from "react";
// DÜZELTME: BrowserRouter (Router olarak) importu buradan kaldırıldı.
// Bu, projenin ana giriş dosyası olan index.js'te olmalıdır.
import { Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useAuth } from "./context/AuthContext";
import { ROLES } from "./config/roles";

// Layout ve Yardımcı Bileşenler
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import NotFoundPage from "./pages/misc/NotFoundPage";
import AccessDeniedPage from "./pages/misc/AccessDeniedPage";

// Sayfaların Import Edilmesi
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

// Rotaları yöneten ana bileşen
const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Giriş yapmamış kullanıcılar sadece Login sayfasını görür. Giriş yapmışsa ana sayfaya yönlendirilir. */}
      <Route
        path="/login"
        element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
      />

      {/* Diğer tüm sayfalar MainLayout ile sarılmıştır ve giriş yapmayı gerektirir */}
      <Route path="/" element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          {/* --- YETKİLENDİRME KURALLARI UYGULANMIŞ ROTALAR --- */}

          {/* Dashboard: Tüm yetkili şirket çalışanları */}
          <Route index element={<DashboardPage />} />

          {/* Mağaza Yönetimi Rotaları */}
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

          {/* Log Görüntüleme Rotaları */}
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

          {/* Kullanıcı Yönetimi Rotaları */}
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

          {/* Firmware Sayfası: Sadece Admin */}
          <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="firmware" element={<FirmwarePage />} />
          </Route>

          {/* Profil Sayfası: Giriş yapmış herkes görebilir */}
          <Route path="profile-details" element={<ProfileDetailsPage />} />

          {/* Yetkisiz Erişim Sayfası */}
          <Route path="/access-denied" element={<AccessDeniedPage />} />
        </Route>
      </Route>

      {/* Eşleşmeyen tüm yollar 404 sayfasına yönlendirilir */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

// Ana App bileşeni
function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
