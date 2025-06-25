// src/components/common/GlobalLoader.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";

const GlobalLoader = () => {
  const { appTranslations, language } = useAuth();

  const translations = appTranslations[language]?.users || {};

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Dönen animasyonlu çember */}
        <div className="w-16 h-16 border-4 border-t-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
        {/* Yükleniyor yazısı */}
        <p className="mt-4 text-white text-lg font-semibold">
          {translations?.LoadingTitle || "Loading"}
        </p>
      </div>
    </div>
  );
};

export default GlobalLoader;
