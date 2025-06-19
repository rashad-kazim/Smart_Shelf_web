// src/context/AuthContext.js
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { appTranslations } from "../config/translations";
import { mockUsers } from "../data/mockUsers";
import { mockCompanyUsers } from "../data/mockCompanyUsers";
import { mockStores } from "../data/mockStores";

const AuthContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [profileUser, setProfileUser] = useState(
    () => JSON.parse(localStorage.getItem("profileUser")) || null
  );
  const [users, setUsers] = useState(mockUsers);
  const [companyUsers, setCompanyUsers] = useState(mockCompanyUsers);
  const [stores, setStores] = useState(mockStores);
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("isDarkMode") === "true"
  );
  const [language, setLanguage] = useState(
    () => localStorage.getItem("language") || "en"
  );

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("alert");
  const [dialogCallback, setDialogCallback] = useState(() => () => {});

  const [dialogConfirmationText, setDialogConfirmationText] = useState("");
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
    [isDarkMode, lightColors, darkColors]
  );

  const isAuthenticated = !!profileUser;
  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const login = (userData) => setProfileUser(userData);
  const logout = () => {
    setProfileUser(null); /* ... */
  };

  useEffect(() => {
    if (profileUser)
      localStorage.setItem("profileUser", JSON.stringify(profileUser));
    else localStorage.removeItem("profileUser");
  }, [profileUser]);
  useEffect(() => {
    localStorage.setItem("isDarkMode", isDarkMode);
  }, [isDarkMode]);
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const value = {
    profileUser,
    setProfileUser,
    isAuthenticated,
    login,
    logout,
    users,
    setUsers,
    companyUsers,
    setCompanyUsers,
    stores,
    setStores,
    isDarkMode,
    toggleTheme,
    currentColors,
    language,
    setLanguage,
    appTranslations,
    showDialog,
    setShowDialog,
    dialogTitle,
    setDialogTitle,
    dialogMessage,
    setDialogMessage,
    dialogType,
    setDialogType,
    dialogCallback,
    setDialogCallback,
    dialogConfirmationText,
    setDialogConfirmationText,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("useAuth must be used within an AppProvider");
  return context;
};
