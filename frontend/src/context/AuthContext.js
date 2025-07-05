// src/context/AuthContext.js

import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  useCallback,
  useEffect,
} from "react";
import { appTranslations } from "../config/translations";
import axiosInstance from "../api/axiosInstance";

const AuthContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [isTableLoading, setIsTableLoading] = useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [showDialog, setShowDialog] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const showMyDialog = (config) => {
    setDialogConfig({
      title: config.title,
      message: config.message || "",
      type: config.type || "alert",
      onConfirm: config.onConfirm || (() => {}),
      confirmationText: config.confirmationText || "",
    });
    setShowDialog(true);
  };

  const hideMyDialog = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axiosInstance.get("/api/users/me");
          const userData = response.data;

          setProfileUser(userData);
          setIsAuthenticated(true);

          // Set theme and language fields coming from backend correctly
          setIsDarkMode(userData.theme === "dark");
          setLanguage(userData.language || "en");
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken");
          setProfileUser(null);
          setIsAuthenticated(false);
          setIsDarkMode(false);
          setLanguage("en");
        }
      }
      setIsAuthLoading(false);
    };

    validateToken();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsGlobalLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axiosInstance.post("/api/auth/token", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { user: userData, token } = response.data;

      localStorage.setItem("authToken", token);

      setProfileUser(userData);
      setIsAuthenticated(true);

      // Set theme and language fields coming from backend correctly
      setIsDarkMode(userData.theme === "dark");
      setLanguage(userData.language || "en");

      return { success: true };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.detail || error.message
      );
      return {
        success: false,
        message:
          error.response?.data?.detail || "Username or password is incorrect.",
      };
    } finally {
      setIsGlobalLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setProfileUser(null);
    setIsAuthenticated(false);
    setIsDarkMode(false);
    setLanguage("en");
  }, []);

  const updateUserPreferences = useCallback(
    async (preferences) => {
      if (!isAuthenticated) return;

      try {
        // Send in a format suitable for backend schema
        await axiosInstance.put("/api/users/me/preferences", preferences);

        // After successful update, refresh user info
        const userResponse = await axiosInstance.get("/api/users/me");
        const updatedUserData = userResponse.data;

        setProfileUser(updatedUserData);

        return { success: true };
      } catch (error) {
        console.error("Failed to update preferences:", error);
        return { success: false, error: error.response?.data || error.message };
      }
    },
    [isAuthenticated]
  );

  // New function to update profile information
  const updateProfileUser = useCallback(async () => {
    if (!isAuthenticated) return null;

    try {
      const response = await axiosInstance.get("/api/users/me");
      const userData = response.data;

      setProfileUser(userData);

      // If theme and language are also updated
      setIsDarkMode(userData.theme === "dark");
      setLanguage(userData.language || "en");

      return userData;
    } catch (error) {
      console.error("Failed to update profile user:", error);
      return null;
    }
  }, [isAuthenticated]);

  const toggleTheme = useCallback(async () => {
    const newTheme = isDarkMode ? "light" : "dark";

    // First update UI (optimistic update)
    setIsDarkMode(!isDarkMode);

    try {
      // Send to backend in correct format
      const result = await updateUserPreferences({ theme: newTheme });

      if (!result.success) {
        // Revert in case of error
        setIsDarkMode(isDarkMode);
        console.error("Theme update failed:", result.error);
      }
    } catch (error) {
      // Revert in case of error
      setIsDarkMode(isDarkMode);
      console.error("Theme update failed:", error);
    }
  }, [isDarkMode, updateUserPreferences]);

  const changeLanguage = useCallback(
    async (newLang) => {
      const oldLang = language;

      // First update UI (optimistic update)
      setLanguage(newLang);

      try {
        // Send to backend in correct format
        const result = await updateUserPreferences({ language: newLang });

        if (!result.success) {
          // Revert in case of error
          setLanguage(oldLang);
          console.error("Language update failed:", result.error);
        }
      } catch (error) {
        // Revert in case of error
        setLanguage(oldLang);
        console.error("Language update failed:", error);
      }
    },
    [language, updateUserPreferences]
  );

  const lightColors = useMemo(
    () => ({
      headerSidebarBg: "#212B36",
      logoPrimaryBlue: "#00CFFF",
      logoSecondaryBlue: "#007BFF",
      pureWhite: "#FFFFFF",
      lightGrayBg: "#F0F2F5",
      darkText: "#1F2937",
      mediumGrayText: "#6B7280",
      whiteText: "#FFFFFF",
      successGreen: "#28A745",
      warningOrange: "#FFC107",
      errorRed: "#DC3545",
      prevButtonBg: "#B0B0B0",
      progressBarBorder: "#D1D5DB",
      progressBarLine: "#D1D5DB",
      progressBarActive: "#28A745",
      nextButtonBg: "#28A745",
      cancelButton: "#6B7280",
    }),
    []
  );

  const darkColors = useMemo(
    () => ({
      headerSidebarBg: "#1A202C",
      logoPrimaryBlue: "#00CFFF",
      logoSecondaryBlue: "#007BFF",
      pureWhite: "#2D3748",
      lightGrayBg: "#1A202C",
      darkText: "#E2E8F0",
      mediumGrayText: "#A0AEC0",
      whiteText: "#FFFFFF",
      successGreen: "#48BB78",
      warningOrange: "#ECC94B",
      errorRed: "#FC8181",
      prevButtonBg: "#6B7280",
      progressBarBorder: "#4B5563",
      progressBarLine: "#4B5563",
      progressBarActive: "#48BB78",
      nextButtonBg: "#48BB78",
      cancelButton: "#A0AEC0",
    }),
    []
  );

  const currentColors = useMemo(
    () => (isDarkMode ? darkColors : lightColors),
    [isDarkMode, darkColors, lightColors]
  );

  const value = useMemo(
    () => ({
      profileUser,
      setProfileUser,
      updateProfileUser,
      user: profileUser,
      isAuthenticated,
      isAuthLoading,
      login,
      logout,
      isGlobalLoading,
      setIsGlobalLoading,
      isTableLoading,
      setIsTableLoading,
      isDarkMode,
      toggleTheme,
      language,
      changeLanguage,
      currentColors,
      appTranslations,
      showDialog,
      setShowDialog,
      dialogConfig,
      setDialogConfig,
      showMyDialog,
      hideMyDialog,
      updateUserPreferences,
    }),
    [
      profileUser,
      updateProfileUser,
      isAuthenticated,
      isAuthLoading,
      login,
      logout,
      isGlobalLoading,
      isTableLoading,
      isDarkMode,
      language,
      currentColors,
      toggleTheme,
      changeLanguage,
      dialogConfig,
      showDialog,
      updateUserPreferences,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AppProvider");
  return context;
};
