// roles.js
// ROLES and PERMISSIONS objects
// src/config/roles.js

// Constants to manage roles from a single place
// Instead of using strings like "Admin" throughout the code, we will use ROLES.ADMIN.
export const ROLES = {
  ADMIN: "Admin",
  COUNTRY_CHIEF: "Country_Chief",
  ENGINEER: "Engineer",
  ANALYST: "Analyst",
  RUNNER: "Runner",
};

// List grouping allowed roles for different user types
export const ROLES_LIST = {
  company: [ROLES.COUNTRY_CHIEF, ROLES.ENGINEER, ROLES.ANALYST],
  supermarket: [ROLES.RUNNER],
};

// Centralized permission object that determines which roles can access which main page groups.
// Note: Sub-routes like /users/add are subject to the main route permission of /users.
export const PERMISSIONS = {
  [ROLES.ADMIN]: {
    viewableRoutes: [
      "/", // Dashboard
      "/stores",
      "/new-installation",
      "/firmware",
      "/users",
      "/profile-details",
      "/delete-store",
      "/edit-store-details",
      "/edit-store-workflow",
      "/view-logs",
      "/store-log-details",
      "/server-logs",
      "/esp32-logs",
    ],
    canAccessCompanyUsers: true, // Admin can access company users
  },
  [ROLES.COUNTRY_CHIEF]: {
    viewableRoutes: [
      "/",
      "/stores",
      "/new-installation",
      "/users",
      "/profile-details",
      "/delete-store",
      "/edit-store-details",
      "/edit-store-workflow",
      "/view-logs",
      "/store-log-details",
      "/server-logs",
      "/esp32-logs",
    ],
    canAccessCompanyUsers: true, // Country Chief can access company users
  },
  [ROLES.ANALYST]: {
    viewableRoutes: [
      "/",
      "/stores",
      "/users",
      "/profile-details",
      "/view-logs",
      "/store-log-details",
      "/server-logs",
      "/esp32-logs",
      "users/supermarket",
    ],
    canAccessCompanyUsers: false,
  },
  [ROLES.ENGINEER]: {
    viewableRoutes: [
      "/",
      "/new-installation",
      "/users",
      "/profile-details",
      "/edit-store-details",
      "/edit-store-workflow",
    ],
    canAccessCompanyUsers: false,
  },

  [ROLES.RUNNER]: {
    viewableRoutes: [],
    canAccessCompanyUsers: false,
  },
};
