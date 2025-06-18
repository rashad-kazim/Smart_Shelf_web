// src/layouts/MainLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = () => {
  // Context'ten TÜM global verileri ve fonksiyonları alıyoruz
  const { currentColors, setLanguage, isDarkMode, toggleTheme } = useAuth();

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        isSidebarExpanded={isSidebarExpanded}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme} // DÜZELTME: toggleTheme fonksiyonu Header'a gönderiliyor
      />
      <div className="flex flex-1 pt-16">
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setLanguage={setLanguage} // DÜZELTME: setLanguage fonksiyonu Sidebar'a gönderiliyor
        />
        <main
          className="flex-1 p-6 transition-all duration-300 ease-in-out overflow-y-auto"
          style={{
            marginLeft: isSidebarExpanded ? "250px" : "77px",
            backgroundColor: currentColors.lightGrayBg,
            color: currentColors.darkText,
          }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
