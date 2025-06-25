// src/components/layout/Header.jsx

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Header = ({ isSidebarExpanded, toggleSidebar }) => {
  const {
    currentColors: colors,
    user,
    logout,
    appTranslations,
    language,
    isDarkMode,
    toggleTheme,
  } = useAuth();

  const translations = appTranslations[language] || appTranslations.en;
  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const dropdownLinkBaseStyle =
    "flex items-center w-full text-left px-4 py-2 text-sm transition-colors duration-150 rounded-md";

  return (
    <header
      className="flex items-center p-4 shadow-md z-40 fixed w-full top-0 left-0"
      style={{ backgroundColor: colors.headerSidebarBg }}>
      <button
        onClick={toggleSidebar}
        className="p-2 rounded-full text-white hover:bg-white/10 transition-colors">
        {isSidebarExpanded ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div className="flex-grow flex justify-center">
        <div
          className="text-2xl font-bold"
          style={{ color: colors.logoPrimaryBlue }}>
          EilSense.io
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="relative text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2">
              <img
                src={
                  user.profile_picture_url ||
                  `https://ui-avatars.com/api/?name=${user.name}+${user.surname}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 object-cover"
                style={{ borderColor: colors.logoPrimaryBlue }}
              />
              <span
                className="font-medium hidden sm:block"
                style={{ color: colors.whiteText }}>
                {`${user.name} ${user.surname}`}
              </span>
              <ChevronDown size={20} style={{ color: colors.whiteText }} />
            </button>
            {showProfileDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg p-1 z-50"
                style={{
                  backgroundColor: colors.pureWhite,
                  border: `1px solid ${colors.mediumGrayText}`,
                }}>
                <Link
                  to="/profile-details"
                  onClick={() => setShowProfileDropdown(false)}
                  className={`${dropdownLinkBaseStyle} ${
                    isDarkMode
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200 hover:text-black"
                  }`}>
                  <User size={16} className="mr-2" />{" "}
                  {translations.profile?.profileDetails || "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${dropdownLinkBaseStyle} w-full ${
                    isDarkMode
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-600 hover:bg-red-50"
                  }`}>
                  <LogOut size={16} className="mr-2" />{" "}
                  {translations.profile?.logOut || "Log Out"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
