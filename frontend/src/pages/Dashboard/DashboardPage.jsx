// src/pages/Dashboard/DashboardPage.jsx
import React from "react";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  // FIX: Now gets everything it needs directly from context
  const { currentColors, appTranslations, language, profileUser } = useAuth();

  // This was where the error was. appTranslations is no longer undefined.
  const translations = appTranslations[language]?.dashboard || {};
  const welcomeText = `${translations.welcomeText || "Welcome!"} ${
    profileUser?.name || "User"
  }`;

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
        {translations.title || "Dashboard"}
      </h1>
      <p className="mb-4">{welcomeText}</p>
      <p className="mb-4">
        {translations.instructionText ||
          "This area will summarize the overall status of your system..."}
      </p>
    </div>
  );
};

export default DashboardPage;
