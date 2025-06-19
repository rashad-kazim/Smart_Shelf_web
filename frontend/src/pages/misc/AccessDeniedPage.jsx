// src/pages/misc/AccessDeniedPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const AccessDeniedPage = () => {
  const navigate = useNavigate();
  // Now we get colors and translations from the centralized context!
  const { currentColors, appTranslations, language } = useAuth();

  const translations = appTranslations[language]?.users || {};

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100"
      style={{ backgroundColor: currentColors.lightGrayBg }}>
      <div
        className="p-8 rounded-lg shadow-md flex flex-col items-center justify-center text-center max-w-lg"
        style={{
          backgroundColor: currentColors.pureWhite,
          color: currentColors.errorRed,
        }}>
        <X size={64} className="mb-4" />
        <h1
          className="text-3xl font-semibold mb-4"
          style={{ color: currentColors.darkText }}>
          {translations.accessDeniedTitle || "Access Denied"}
        </h1>
        <p
          className="text-lg mb-6"
          style={{ color: currentColors.mediumGrayText }}>
          {translations.accessDeniedMessage ||
            "You do not have permission to access this page."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 rounded-md font-medium transition-colors duration-200 cursor-pointer"
          style={{
            backgroundColor: currentColors.logoPrimaryBlue,
            color: currentColors.whiteText,
          }}>
          {translations.goBackButton || "Go Back"}
        </button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
