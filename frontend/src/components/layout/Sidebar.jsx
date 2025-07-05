// src/components/layout/Sidebar.jsx

import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Store, PlusCircle, Settings, Users } from "lucide-react";

const Sidebar = ({ isSidebarExpanded }) => {
  // All necessary state and functions are taken from context
  const {
    user,
    currentColors: colors,
    appTranslations,
    language,
    changeLanguage,
  } = useAuth();

  const menuTranslations = useMemo(
    () => appTranslations[language]?.menu,
    [appTranslations, language]
  );
  const languageList = useMemo(
    () => appTranslations[language]?.languages,
    [appTranslations, language]
  );
  const languagesShort = useMemo(
    () => appTranslations[language]?.languagesShort,
    [appTranslations, language]
  );
  const availableLanguages = Object.keys(languageList);

  const navItems = useMemo(
    () => [
      {
        name: menuTranslations.dashboard,
        icon: Home,
        route: "/",
      },
      {
        name: menuTranslations.stores,
        icon: Store,
        route: "/stores",
      },
      {
        name: menuTranslations.newInstallation,
        icon: PlusCircle,
        route: "/new-installation",
      },
      {
        name: menuTranslations.firmware,
        icon: Settings,
        route: "/firmware",
      },
      {
        name: menuTranslations.users,
        icon: Users,
        route: "/users",
      },
    ],
    [menuTranslations]
  );

  // If user info is not yet available, do not show the sidebar
  if (!user) {
    return null;
  }

  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto shadow-lg transition-all duration-300 z-30 flex flex-col`}
      style={{
        backgroundColor: colors.headerSidebarBg,
        width: isSidebarExpanded ? "250px" : "77px",
      }}>
      <nav className="flex-grow">
        <ul className="space-y-2 py-4">
          {navItems.map((item) => (
            <li key={item.route}>
              <NavLink
                to={item.route}
                end={item.route === "/"}
                className={({ isActive }) =>
                  `flex items-center rounded-lg font-medium transition-colors duration-200 ${
                    isSidebarExpanded ? "py-2 px-3" : "p-3 justify-center"
                  } ${
                    isActive
                      ? "mx-2"
                      : "text-gray-400 hover:text-white hover:bg-white/10 mx-2"
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive
                    ? colors.logoPrimaryBlue
                    : "transparent",
                  color: colors.whiteText,
                })}>
                <item.icon size={20} />
                <span
                  className={`ml-3 overflow-hidden ${
                    !isSidebarExpanded && "hidden"
                  }`}>
                  {item.name}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={`w-full p-2 flex justify-center`}>
        <select
          id="language-select"
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className={`rounded-md text-white border focus:outline-none cursor-pointer ${
            isSidebarExpanded
              ? "w-full py-2 px-3 text-left"
              : "w-auto py-1 px-1 text-center"
          }`}
          style={{
            backgroundColor: colors.headerSidebarBg,
            borderColor: colors.mediumGrayText,
          }}>
          {availableLanguages.map((langKey) => (
            <option key={langKey} value={langKey}>
              {isSidebarExpanded
                ? languageList[langKey]
                : languagesShort[langKey]}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};
export default Sidebar;
