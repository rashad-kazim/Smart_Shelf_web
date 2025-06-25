// src/pages/Users/UsersAndRolesPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Users } from "lucide-react";

const UsersAndRolesPage = () => {
  const { currentColors, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const translations = appTranslations[language]?.users || {};

  const cardData = [
    {
      title: translations.userForSupermarketTitle || "User For Supermarket",
      description:
        translations.userForSupermarketDesc ||
        "Manage users for supermarket branches.",
      icon: Users,
      route: "/users/supermarket",
    },
    {
      title: translations.userForCompanyTitle || "User For Company",
      description:
        translations.userForCompanyDesc || "Manage users for the main company.",
      icon: Users,
      route: "/users/company",
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
        {translations.usersRolesTitle || "Users & Roles"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

export default UsersAndRolesPage;
