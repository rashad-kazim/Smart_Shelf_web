// Sidebar.js
// Sidebar menu component
// src/components/layout/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";

// Ikonları ve Navigasyon verisini doğrudan burada tanımlayabiliriz
import { Home, Store, PlusCircle, Settings, Users } from "lucide-react";

const Sidebar = ({
  isSidebarExpanded,
  currentColors,
  appTranslations,
  language,
  setLanguage,
  setShowDialog,
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) => {
  const { profileUser } = useAuth();
  const location = useLocation(); // Mevcut sayfanın yolunu almak için

  const translations = appTranslations[language] || appTranslations.en;

  const navItems = [
    {
      name: translations.menu.dashboard,
      icon: Home,
      route: "/",
      access: [ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ANALYST, ROLES.ENGINEER],
    },
    {
      name: translations.menu.stores,
      icon: Store,
      route: "/stores",
      access: [ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ANALYST],
    },
    {
      name: translations.menu.newInstallation,
      icon: PlusCircle,
      route: "/new-installation",
      access: [ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ENGINEER],
    },
    {
      name: translations.menu.firmware,
      icon: Settings,
      route: "/firmware",
      access: [ROLES.ADMIN],
    },
    {
      name: translations.menu.users,
      icon: Users,
      route: "/users",
      access: [ROLES.ADMIN, ROLES.COUNTRY_CHIEF, ROLES.ANALYST, ROLES.ENGINEER],
    },
  ];

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out z-20 flex flex-col`}
      style={{
        backgroundColor: currentColors.headerSidebarBg,
        width: isSidebarExpanded ? "250px" : "77px",
      }}>
      <nav className="flex-grow">
        <ul className="space-y-2 py-4">
          {navItems.map((item) => {
            const hasAccess = item.access.includes(profileUser?.role);
            const isActive = location.pathname === item.route;

            return (
              <li key={item.route}>
                <Link
                  to={item.route}
                  onClick={(e) => {
                    if (!hasAccess) {
                      e.preventDefault();
                      setShowDialog(true);
                      setDialogTitle(translations.users.accessDeniedTitle);
                      setDialogMessage(translations.users.accessDeniedMessage);
                      setDialogType("alert");
                      setDialogCallback(() => () => setShowDialog(false));
                    }
                  }}
                  className={`flex items-center rounded-lg font-medium transition-colors duration-200
                    ${
                      isSidebarExpanded
                        ? "py-2 px-3"
                        : "py-2 px-2 justify-center"
                    }
                    ${isActive ? "mx-2" : "hover:bg-gray-700 mx-2"}
                    ${
                      !hasAccess
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }
                  `}
                  style={{
                    backgroundColor: isActive
                      ? currentColors.logoPrimaryBlue
                      : "transparent",
                    color: currentColors.whiteText,
                  }}>
                  <item.icon
                    size={20}
                    style={{ color: currentColors.whiteText }}
                  />
                  <span
                    className={`ml-3 overflow-hidden whitespace-nowrap ${
                      !isSidebarExpanded && "hidden"
                    }`}>
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`w-full ${
          isSidebarExpanded ? "px-3 pb-4" : "pb-4 flex justify-center"
        }`}>
        <label htmlFor="language-select" className="sr-only">
          Language Select
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none cursor-pointer
            ${
              isSidebarExpanded
                ? "w-full py-2 px-3 text-left"
                : "w-16 py-2 text-center text-sm"
            }
          `}
          style={{
            backgroundColor: currentColors.headerSidebarBg,
            color: currentColors.whiteText,
            borderColor: currentColors.mediumGrayText,
          }}>
          <option value="en">{isSidebarExpanded ? "English" : "en"}</option>
          <option value="tr">{isSidebarExpanded ? "Türkçe" : "tr"}</option>
          <option value="ru">{isSidebarExpanded ? "Русский" : "ru"}</option>
          <option value="pl">{isSidebarExpanded ? "Polski" : "pl"}</option>
        </select>
      </div>
    </aside>
  );
};

export default Sidebar;
