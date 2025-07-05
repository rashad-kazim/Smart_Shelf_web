// src/layouts/MainLayout.jsx

import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import GlobalLoader from "../components/common/GlobalLoader";
import Footer from "../components/layout/Footer";

const MainLayout = () => {
  const { isGlobalLoading, user, currentColors } = useAuth();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => !prev);
  };

  if (isGlobalLoading || !user) {
    return <GlobalLoader />;
  }

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header
          isSidebarExpanded={isSidebarExpanded}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex flex-1 pt-16">
          <Sidebar isSidebarExpanded={isSidebarExpanded} />
          <div className="flex flex-col flex-1">
            <main
              className="flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out overflow-y-auto"
              style={{
                marginLeft: isSidebarExpanded ? "250px" : "77px",
                backgroundColor: currentColors.lightGrayBg,
                color: currentColors.darkText,
              }}>
              <Outlet />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default MainLayout;
