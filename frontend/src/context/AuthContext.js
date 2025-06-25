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
  const [profileUser, setProfileUser] = useState(null); // user -> profileUser
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        try {
          const response = await axiosInstance.get("/api/users/me");
          const userData = response.data;

          setProfileUser(userData); // setUser -> setProfileUser
          setIsAuthenticated(true);
          setIsDarkMode(userData.preferred_theme === "dark");
          setLanguage(userData.preferred_language || "en");
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("authToken");
        }
      }
      setIsAuthLoading(false);
    };

    validateToken();
  }, []);

  // API'ye bağlanan ana login fonksiyonu
  const login = useCallback(async (email, password) => {
    setIsGlobalLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append("username", email);
      formData.append("password", password);

      const response = await axiosInstance.post("/api/auth/login", formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { user: userData, token } = response.data;

      localStorage.setItem("authToken", token);

      setProfileUser(userData); // setUser -> setProfileUser
      setIsAuthenticated(true);
      setIsDarkMode(userData.preferred_theme === "dark");
      setLanguage(userData.preferred_language || "en");

      return { success: true };
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.detail || error.message
      );
      return {
        success: false,
        message: error.response?.data?.detail || "Bir hata oluştu.",
      };
    } finally {
      setIsGlobalLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    setProfileUser(null); // setUser -> setProfileUser
    setIsAuthenticated(false);
    setIsDarkMode(false);
    setLanguage("en");
  }, []);

  const updateUserPreferences = useCallback(
    async (preferences) => {
      if (!isAuthenticated) return;
      try {
        await axiosInstance.put("/api/users/me/preferences", preferences);
      } catch (error) {
        console.error("Failed to update preferences:", error);
      }
    },
    [isAuthenticated]
  );

  const toggleTheme = useCallback(() => {
    setIsDarkMode((prevMode) => {
      const newIsDarkMode = !prevMode;
      updateUserPreferences({ theme: newIsDarkMode ? "dark" : "light" });
      return newIsDarkMode;
    });
  }, [updateUserPreferences]);

  const changeLanguage = useCallback(
    (newLang) => {
      setLanguage(newLang);
      updateUserPreferences({ language: newLang });
    },
    [updateUserPreferences]
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
      profileUser, // user -> profileUser
      user: profileUser, // Backward compatibility için
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
    }),
    [
      profileUser, // user -> profileUser
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
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AppProvider");
  return context;
};
