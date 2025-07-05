// NotFoundPage.js
// 404 Not Found page
// src/pages/misc/NotFoundPage.js
import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  const { currentColors, appTranslations, language } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.notFound,
    [appTranslations, language]
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="p-8 rounded-lg shadow-md flex flex-col items-center justify-center text-center max-w-lg"
        style={{
          backgroundColor: currentColors.pureWhite,
          color: currentColors.darkText,
        }}>
        <AlertTriangle
          size={64}
          className="mb-4"
          style={{ color: currentColors.warningOrange }}
        />
        <h1
          className="text-3xl font-semibold mb-4"
          style={{ color: currentColors.darkText }}>
          {translations.notFoundTitle}
        </h1>
        <p
          className="text-lg mb-6"
          style={{ color: currentColors.mediumGrayText }}>
          {translations.notFoundMessage}
        </p>
        <Link
          to="/"
          className="mt-6 px-6 py-3 rounded-md font-medium transition-colors duration-200 cursor-pointer"
          style={{
            backgroundColor: currentColors.logoPrimaryBlue,
            color: currentColors.whiteText,
          }}>
          {translations.backToHomeButton}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
