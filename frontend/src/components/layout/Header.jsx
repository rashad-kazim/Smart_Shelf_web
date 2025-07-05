// src/components/layout/Header.jsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, X, Sun, Moon, ChevronDown, User, LogOut } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

const Header = ({ isSidebarExpanded, toggleSidebar }) => {
  const {
    currentColors,
    profileUser, // The name of the user object coming from context is 'profileUser'
    logout,
    appTranslations,
    language,
    isDarkMode,
    toggleTheme,
  } = useAuth();

  const profileTranslations = useMemo(
    () => appTranslations[language]?.profile,
    [appTranslations, language]
  );

  const navigate = useNavigate();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // FIX 1: Create a ref for the dropdown.
  const profileMenuRef = useRef(null);

  const handleLogout = () => {
    setShowProfileDropdown(false); // Close the menu
    logout();
    navigate("/login");
  };

  // FIX 2: useEffect to detect "click outside"
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileDropdown(false);
      }
    };

    // Add event listener only when menu is open
    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup: Remove listener when component unmounts or menu closes
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfileDropdown]);

  const dropdownLinkBaseStyle =
    "flex items-center w-full text-left px-4 py-2 text-sm transition-colors duration-150 rounded-md";

  return (
    <header
      className="flex items-center justify-between p-4 shadow-md z-40 fixed w-full top-0 left-0 h-16"
      style={{ backgroundColor: currentColors.headerSidebarBg }}>
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full text-white hover:bg-white/10 transition-colors">
          {isSidebarExpanded ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="flex-grow flex justify-center">
        <div
          className="text-2xl font-bold"
          style={{ color: currentColors.logoPrimaryBlue }}>
          EilSense.io
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          className="relative text-white p-2 rounded-full hover:bg-white/10 transition-colors">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {profileUser && (
          // FIX 3: Add the ref to this container to detect click outside
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-2 p-1 rounded-md hover:bg-white/10">
              <img
                src={
                  profileUser.profile_picture || // Use profile picture from backend
                  `https://ui-avatars.com/api/?name=${profileUser.name}+${profileUser.surname}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="w-8 h-8 rounded-full border-2 object-cover"
                style={{ borderColor: currentColors.logoPrimaryBlue }}
              />
              <span
                className="font-medium hidden sm:block"
                style={{ color: currentColors.whiteText }}>
                {`${profileUser.name} ${profileUser.surname}`}
              </span>
              <ChevronDown
                size={16}
                style={{ color: currentColors.whiteText }}
              />
            </button>
            {showProfileDropdown && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg p-1 z-50"
                style={{
                  backgroundColor: currentColors.pureWhite,
                  border: `1px solid ${currentColors.borderColor}`,
                }}>
                <Link
                  to="/profile-details"
                  onClick={() => setShowProfileDropdown(false)}
                  className={`${dropdownLinkBaseStyle} ${
                    isDarkMode
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}>
                  <User size={16} className="mr-2" />
                  {profileTranslations.detailsTitle}
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${dropdownLinkBaseStyle} w-full ${
                    isDarkMode
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-600 hover:bg-red-50"
                  }`}>
                  <LogOut size={16} className="mr-2" />
                  {profileTranslations.logOut}
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
