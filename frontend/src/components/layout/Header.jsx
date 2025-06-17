// src/components/layout/Header.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const Header = ({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isDarkMode,
  toggleTheme,
  currentColors,
  appTranslations,
}) => {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { profileUser, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Dil değişimine uyumlu olması için doğru çeviri nesnesini alıyoruz
  const translations = appTranslations.en;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Dropdown dışına tıklandığında kapatmak için
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoPlaceholderUrl = `https://placehold.co/180x40/${currentColors.headerSidebarBg.substring(
    1
  )}/${currentColors.logoPrimaryBlue.substring(1)}?font=inter&text=EilSense.io`;

  return (
    <header
      className="flex items-center p-4 shadow-md z-30 fixed w-full top-0 left-0"
      style={{ backgroundColor: currentColors.headerSidebarBg }}>
      <button
        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
        className="text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 transition-colors duration-200 cursor-pointer">
        {isSidebarExpanded ? (
          <X size={24} style={{ color: currentColors.whiteText }} />
        ) : (
          <Menu size={24} style={{ color: currentColors.whiteText }} />
        )}
      </button>

      <div className="flex-grow flex justify-center">
        <Link to="/">
          <img
            src={logoPlaceholderUrl}
            alt="EilSense.io Logo"
            className="h-10 w-auto rounded-md"
          />
        </Link>
      </div>

      <div className="relative flex items-center space-x-4" ref={dropdownRef}>
        <button
          onClick={toggleTheme}
          className="relative text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 cursor-pointer">
          <Sun
            size={24}
            style={{ color: currentColors.whiteText }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
              isDarkMode ? "opacity-100" : "opacity-0"
            }`}
          />
          <Moon
            size={24}
            style={{ color: currentColors.whiteText }}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
              isDarkMode ? "opacity-0" : "opacity-100"
            }`}
          />
        </button>

        <div
          className="flex items-center cursor-pointer relative"
          onClick={() => setShowProfileDropdown((prev) => !prev)}>
          <img
            src={
              profileUser?.profilePicture ||
              `https://placehold.co/40x40/c2c2c2/FFFFFF/png?text=${
                profileUser?.name.charAt(0) || ""
              }${profileUser?.surname.charAt(0) || ""}`
            }
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white object-cover"
          />
          <span
            className="font-medium hidden sm:block ml-2"
            style={{ color: currentColors.whiteText }}>
            {profileUser
              ? `${profileUser.name} ${profileUser.surname}`
              : translations.profile.userName}
          </span>
          <ChevronDown
            size={20}
            className="ml-1"
            style={{ color: currentColors.whiteText }}
          />
        </div>

        {showProfileDropdown && (
          <div
            className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg py-1 z-50"
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
            <Link
              to="/profile-details"
              onClick={() => setShowProfileDropdown(false)}
              className="block px-4 py-2 text-sm hover:bg-gray-100"
              style={{
                color: currentColors.darkText,
                backgroundColor: currentColors.pureWhite,
              }}>
              {translations.profile.profileDetails}
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              style={{
                color: currentColors.errorRed,
                backgroundColor: currentColors.pureWhite,
              }}>
              {translations.profile.logOut}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
// This code defines a Header component that includes a sidebar toggle button, a logo, a theme toggle button, and a user profile dropdown.
// The component uses React hooks for state management and effects, and it integrates with the AuthContext to manage user authentication.
