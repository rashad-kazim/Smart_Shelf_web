// src/pages/Firmware/FirmwarePage.js

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const FirmwarePage = () => {
  const { currentColors, appTranslations, language } = useAuth();
  const translations = useMemo(
    () => appTranslations[language]?.firmware,
    [appTranslations, language]
  );

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
      <p className="mb-4">{translations.introText}</p>
      <p className="mb-4">{translations.instructionText}</p>
      <p className="mb-4">{translations.futureFeatures}</p>
    </div>
  );
};

export default FirmwarePage;
