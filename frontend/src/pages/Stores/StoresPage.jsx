// Store management main page
// src/pages/Stores/StoresPage.js
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit, Trash2, List } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const StoresPage = () => {
  const { currentColors, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const translations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  // Data for action cards
  const cardData = [
    {
      title: translations.createStoreTitle,
      description: translations.createStoreDesc,
      icon: PlusCircle,
      route: "/new-installation",
    },
    {
      title: translations.editStoreTitle,
      description: translations.editStoreDesc,
      icon: Edit,
      route: "/edit-store-details",
    },
    {
      title: translations.deleteStoreTitle,
      description: translations.deleteStoreDesc,
      icon: Trash2,
      route: "/delete-store",
    },
    {
      title: translations.viewLogsTitle,
      description: translations.viewLogsDesc,
      icon: List,
      route: "/view-logs",
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
        {translations.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card) => {
          return (
            <div
              key={card.title}
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
