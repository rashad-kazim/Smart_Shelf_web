// src/pages/Dashboard/DashboardPage.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const DashboardPage = () => {
  // FIX: Now gets everything it needs directly from context
  const { currentColors, appTranslations, language, profileUser } = useAuth();

  // This was where the error was. appTranslations is no longer undefined.
  const dashboardTranslations = useMemo(
    () => appTranslations[language]?.dashboard,
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  const welcomeText = `${dashboardTranslations.welcomeMessage} ${
    profileUser?.name || commonTranslations.genericUser
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
        {dashboardTranslations.title}
      </h1>
      <p className="mb-4">{welcomeText}</p>
      <p className="mb-4">{dashboardTranslations.instructionText}</p>
    </div>
  );
};

export default DashboardPage;
