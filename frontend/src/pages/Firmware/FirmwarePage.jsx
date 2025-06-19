// FirmwarePage.js
// Firmware update page
// src/pages/Firmware/FirmwarePage.js
import React from "react";
import { useAuth } from "../../context/AuthContext";

const FirmwarePage = () => {
  const { currentColors, appTranslations, language } = useAuth();
  const translations = appTranslations[language]?.firmware || {};

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
        {translations.title || "Firmware Updates"}
      </h1>
      <p className="mb-4">
        {translations.introText ||
          "This section is where you manage firmware updates."}
      </p>
      <p className="mb-4">
        {translations.instructionText ||
          "You can distribute new software to devices from here."}
      </p>
      <p className="mb-4">
        {translations.futureFeatures ||
          "Upcoming: Features to view current firmware versions and distribute new versions will be added."}
      </p>
    </div>
  );
};

export default FirmwarePage;
