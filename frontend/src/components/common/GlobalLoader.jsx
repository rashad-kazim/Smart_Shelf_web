// src/components/common/GlobalLoader.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const GlobalLoader = ({ message }) => {
  const { appTranslations, language } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.loader,
    [appTranslations, language]
  );

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Spinning animated circle */}
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        {/* Loading text */}
        <p className="mt-4 text-white text-lg font-semibold">
          {message || translations?.LoadingTitle}
        </p>
        {/* Progress indicator */}
        <div className="mt-2 w-32 h-1 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalLoader;
