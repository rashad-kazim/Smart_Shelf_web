// src/components/InstallationSteps/Step5.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { CheckCircle, Server, Battery } from "lucide-react";

const Step5 = ({
  logs,
  handleCompleteInstallation,
  onBack,
  isGlobalLoading,
}) => {
  const { currentColors: colors, appTranslations, language } = useAuth();

  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );
  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  return (
    <div
      className={`p-6 rounded-lg shadow-md max-w-2xl mx-auto ${
        colors.isDarkMode ? "bg-gray-800" : "bg-white"
      }`}>
      <h2
        className={`text-xl font-semibold mb-4 ${
          colors.isDarkMode ? "text-white" : "text-gray-900"
        }`}>
        {wizardTranslations.step5Title}
      </h2>
      <p
        className={`mb-6 text-sm ${
          colors.isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}>
        {wizardTranslations.step5Description}
      </p>

      {/* Log Display Section */}
      {logs.length > 0 ? (
        <div
          className={`p-4 rounded-md border ${
            colors.isDarkMode
              ? "bg-gray-900/50 border-gray-700"
              : "bg-gray-50 border-gray-200"
          } max-h-[400px] overflow-y-auto`}>
          <div className="space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow-sm ${
                  colors.isDarkMode ? "bg-gray-700" : "bg-white"
                }`}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div
                      className={`mr-2 p-1.5 rounded-full ${
                        log.source.includes("Device")
                          ? "bg-blue-500/20"
                          : "bg-indigo-500/20"
                      }`}>
                      {log.source.includes("Device") ? (
                        <Battery size={16} className="text-blue-400" />
                      ) : (
                        <Server size={16} className="text-indigo-400" />
                      )}
                    </div>
                    <span
                      className={`font-bold text-md ${
                        colors.isDarkMode ? "text-gray-200" : "text-gray-800"
                      }`}>
                      {log.source}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      log.status === "Online" || log.status.includes("Ready")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                    {log.status}
                  </span>
                </div>
                <div className="text-xs space-y-1 pl-1 border-l-2 border-gray-400 dark:border-gray-500 ml-3">
                  {Object.entries(log.details).map(([key, value]) => (
                    <p key={key} className="pl-3">
                      <span className="font-semibold capitalize text-gray-500 dark:text-gray-400">
                        {key}:
                      </span>
                      <span
                        className={`ml-2 font-mono ${
                          colors.isDarkMode ? "text-gray-300" : "text-gray-700"
                        }`}>
                        {value}
                      </span>
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed rounded-lg">
          <p>{wizardTranslations.loadingStatus}</p>
        </div>
      )}

      <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-300 dark:border-gray-600">
        <button
          onClick={onBack}
          disabled={isGlobalLoading}
          className={`font-bold py-2 px-6 rounded-md transition-all ${
            isGlobalLoading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}>
          {storesTranslations.previousButton}
        </button>

        <button
          onClick={handleCompleteInstallation}
          disabled={isGlobalLoading || logs.length === 0}
          className={`font-bold py-2 px-8 rounded-md flex items-center justify-center transition-all ${
            isGlobalLoading || logs.length === 0
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}>
          {isGlobalLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {wizardTranslations.installingText}
            </>
          ) : (
            <>
              <CheckCircle size={20} className="mr-2" />
              {wizardTranslations.completeInstallationButton}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Step5;
