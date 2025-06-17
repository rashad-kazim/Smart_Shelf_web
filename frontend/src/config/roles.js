// roles.js
// ROLES and PERMISSIONS objects
// src/config/roles.js

// Constants to manage roles from a single place
// Instead of using strings like "Admin" throughout the code, we will use ROLES.ADMIN.
export const ROLES = {
  ADMIN: "Admin",
  COUNTRY_CHIEF: "Country Chief",
  ANALYST: "Analyst",
  ENGINEER: "Engineer",
  RUNNER: "Runner",
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
    ],
  },
  [ROLES.COUNTRY_CHIEF]: {
    viewableRoutes: [
      "/",
      "/stores",
      "/new-installation",
      "/users",
      "/profile-details",
    ],
  },
  [ROLES.ANALYST]: {
    viewableRoutes: ["/", "/stores", "/users", "/profile-details"],
  },
  [ROLES.ENGINEER]: {
    viewableRoutes: ["/", "/new-installation", "/users", "/profile-details"],
  },
  [ROLES.RUNNER]: {
    // Runner role has no access to the web panel.
  },
};
