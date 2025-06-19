// StoresPage.js
// Store management main page
// src/pages/Stores/StoresPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash2, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";

// This page now gets its data directly from context and its own props, not from App.js.
const StoresPage = () => {
  const { profileUser, currentColors, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const translations = appTranslations[language]?.stores || {};

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;

  // Data for action cards
  const cardData = [
    {
      title: translations.createStoreTitle || "Create New Store",
      description: translations.createStoreDesc || "",
      icon: PlusCircle,
      route: "/new-installation",
      // Only Admin, Country Chief, and Engineer can access
      access: isAdmin || isCountryChief || profileUser?.role === ROLES.ENGINEER,
    },
    {
      title: translations.editStoreTitle || "Edit Store Information",
      description: translations.editStoreDesc || "",
      icon: Edit,
      route: "/edit-store-details", // We will create this route later
      // Only Admin, Country Chief, and Engineer can access
      access: isAdmin || isCountryChief || profileUser?.role === ROLES.ENGINEER,
    },
    {
      title: translations.deleteStoreTitle || "Delete Store",
      description: translations.deleteStoreDesc || "",
      icon: Trash2,
      route: "/delete-store", // We will create this route later
      // Only Admin and Country Chief can access
      access: isAdmin || isCountryChief,
    },
    {
      title: translations.viewLogsTitle || "View Logs",
      description: translations.viewLogsDesc || "",
      icon: List,
      route: "/view-logs", // We will create this route later
      // Everyone can access (within permitted roles)
      access: true,
    },
  ];

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: currentColors.pureWhite,
        color: currentColors.darkText,
      }}>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: currentColors.darkText }}>
        {translations.title || "Stores & Branches"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => {
          return (
            <div
              key={index}
              className="p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 cursor-pointer"
              style={{
                backgroundColor: currentColors.pureWhite,
                color: currentColors.darkText,
              }}
              onClick={() => navigate(card.route)}>
              <card.icon
                size={48}
                className="mb-4"
                style={{ color: currentColors.logoPrimaryBlue }}
              />
              <h2
                className="text-xl font-semibold mb-2"
                style={{ color: currentColors.darkText }}>
                {card.title}
              </h2>
              <p
                className="text-sm"
                style={{ color: currentColors.mediumGrayText }}>
                {card.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoresPage;
