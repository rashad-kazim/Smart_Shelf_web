// DashboardPage.js
// Dashboard main page
// src/pages/Dashboard/DashboardPage.js
import React from "react";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = ({ appTranslations, currentColors }) => {
  const { profileUser } = useAuth();

  // Get the correct data for language and theme from props
  const language = localStorage.getItem("language") || "en";
  const translations = appTranslations[language] || appTranslations.en;

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
        {translations.dashboard.title}
      </h1>
      <p className="mb-4 text-lg">
        {translations.dashboard.welcomeText.replace(
          "John Doe",
          `${profileUser.name} ${profileUser.surname}`
        )}
      </p>
      <p className="mb-4" style={{ color: currentColors.mediumGrayText }}>
        {translations.dashboard.instructionText}
      </p>
      <p
        className="text-sm italic"
        style={{ color: currentColors.mediumGrayText }}>
        {translations.dashboard.note}
      </p>
    </div>
  );
};

export default DashboardPage;
