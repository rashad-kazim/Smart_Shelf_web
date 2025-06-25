// src/components/layout/Sidebar.jsx
// src/components/layout/Sidebar.jsx

import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Home, Store, PlusCircle, Settings, Users } from "lucide-react";

const Sidebar = ({ isSidebarExpanded }) => {
  // Gerekli tüm state ve fonksiyonlar context'ten alınıyor
  const {
    user,
    currentColors: colors,
    appTranslations,
    language,
    changeLanguage,
  } = useAuth();
  const translations = appTranslations[language] || appTranslations.en;

  const navItems = [
    {
      name: translations.menu?.dashboard || "Dashboard",
      icon: Home,
      route: "/",
    },
    {
      name: translations.menu?.stores || "Stores",
      icon: Store,
      route: "/stores",
    },
    { name: "New Installation", icon: PlusCircle, route: "/new-installation" },
    {
      name: translations.menu?.firmware || "Firmware",
      icon: Settings,
      route: "/firmware",
    },
    { name: translations.menu?.users || "Users", icon: Users, route: "/users" },
  ];

  // Eğer kullanıcı bilgisi henüz gelmediyse, sidebar'ı gösterme
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
          onChange={(e) => changeLanguage(e.target.value)} // Artık context'teki changeLanguage fonksiyonunu kullanıyor
          className={`rounded-md text-white border focus:outline-none cursor-pointer ${
            isSidebarExpanded
              ? "w-full py-2 px-3 text-left"
              : "w-auto py-1 px-1 text-center"
          }`}
          style={{
            backgroundColor: colors.headerSidebarBg,
            borderColor: colors.mediumGrayText,
          }}>
          <option value="en">{isSidebarExpanded ? "English" : "EN"}</option>
          <option value="az">{isSidebarExpanded ? "Azerbaycan" : "AZ"}</option>
          <option value="tr">{isSidebarExpanded ? "Türkçe" : "TR"}</option>
          <option value="ru">{isSidebarExpanded ? "Русский" : "RU"}</option>
          <option value="pl">{isSidebarExpanded ? "Polski" : "PL"}</option>
        </select>
      </div>
    </aside>
  );
};
export default Sidebar;
