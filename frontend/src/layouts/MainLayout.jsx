// MainLayout.js
// Main layout with Header, Sidebar, Footer
// src/layouts/MainLayout.js
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

// Component that creates the main application frame (Header, Sidebar, Footer).
// The page content is dynamically placed inside this frame with <Outlet />.
const MainLayout = ({
  appTranslations,
  isDarkMode,
  toggleTheme,
  currentColors,
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const { profileUser } = useAuth(); // User info from AuthContext

  if (!profileUser) {
    // This situation is normally prevented by ProtectedRoute,
    // but it can be considered as an extra security layer.
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: currentColors.lightGrayBg }}>
      <Header
        isSidebarExpanded={isSidebarExpanded}
        setIsSidebarExpanded={setIsSidebarExpanded}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        currentColors={currentColors}
        appTranslations={appTranslations}
      />

      <div className="flex flex-1" style={{ paddingTop: "64px" }}>
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          currentColors={currentColors}
          appTranslations={appTranslations}
        />

        <main
          className="flex-1 p-6 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto"
          style={{
            marginLeft: isSidebarExpanded ? "250px" : "77px",
            paddingTop: "24px",
            backgroundColor: currentColors.lightGrayBg,
            color: currentColors.darkText,
          }}>
          {/* React Router will render the page corresponding to the selected route here */}
          <Outlet />
        </main>
      </div>

      <Footer currentColors={currentColors} appTranslations={appTranslations} />
    </div>
  );
};

export default MainLayout;
