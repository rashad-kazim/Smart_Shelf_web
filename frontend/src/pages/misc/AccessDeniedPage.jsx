// src/pages/misc/AccessDeniedPage.jsx

import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShieldAlert } from "lucide-react";

const AccessDeniedPage = () => {
  const { currentColors: colors, appTranslations, language } = useAuth();
  const navigate = useNavigate();
  const translations = useMemo(
    () => appTranslations[language]?.accessDenied,
    [appTranslations, language]
  );

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-sm mx-auto">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/50">
          <ShieldAlert
            className="h-6 w-6 text-red-600 dark:text-red-400"
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
          {translations.title}
        </h3>
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          <p>{translations.message}</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white transition-colors"
            style={{ backgroundColor: colors.logoPrimaryBlue }}>
            {translations.goBackButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
