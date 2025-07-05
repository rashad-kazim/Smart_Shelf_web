// src/components/InstallationSteps/Step2.jsx

import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Copy, RefreshCw } from "lucide-react";

const Step2 = ({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  displayDialog,
}) => {
  const { isDarkMode, appTranslations, language } = useAuth();

  // LOCAL LOADING STATE - Instead of global state
  const [isLoading, setIsLoading] = useState(false);
  const serverToken = wizardData.server_token;
  const [serverConnectionStatus, setServerConnectionStatus] = useState(
    wizardData.connection_status || ""
  );
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );
  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  // Token generation function
  const handleGenerateToken = useCallback(async () => {
    if (!wizardData?.storeId) {
      setError(wizardTranslations.storeIdNotFoundError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post(
        `/api/stores/${wizardData.storeId}/generate-server-token`
      );
      const newToken = response.data.server_token;

      await axiosInstance.put(`/api/stores/${wizardData.storeId}`, {
        server_token: newToken,
      });

      // --- MAIN CHANGE: Save the token to the central state. ---
      updateWizardData({ server_token: newToken });
      setServerConnectionStatus("");
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      setError(
        typeof errorDetail === "string"
          ? errorDetail
          : wizardTranslations.tokenGenerationError
      );
    } finally {
      setIsLoading(false);
    }
  }, [wizardData, wizardTranslations, updateWizardData]);

  // Connection check function
  const handleCheckConnection = useCallback(async () => {
    if (!serverToken) return;

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(
        "/api/ops/heartbeat",
        {},
        {
          headers: { "X-Server-Token": serverToken },
        }
      );
      const successMessage = wizardTranslations.connectionSuccess;
      setServerConnectionStatus(successMessage);
      updateWizardData({ connection_status: successMessage });
    } catch (error) {
      const detail = error.response?.data?.detail || "Unknown error";
      setServerConnectionStatus(
        `${wizardTranslations.connectionError} ${detail}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [serverToken, wizardTranslations, updateWizardData]);

  const handleNextClick = () => {
    const successMessage = wizardTranslations?.connectionSuccess;
    if (!serverToken) {
      displayDialog(
        wizardTranslations?.errorTitle,
        wizardTranslations?.generateTokenFirst
      );
      return;
    }
    if (wizardData.connection_status !== successMessage) {
      displayDialog(
        wizardTranslations?.cannotProceedTitle,
        wizardTranslations?.checkConnectionFirst
      );
      return;
    }
    onNext();
  };

  const handleCopyToClipboard = () => {
    if (!serverToken) return;
    navigator.clipboard.writeText(serverToken).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formContainerClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const labelClass = `block text-sm font-bold mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const inputClass = `w-full p-3 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-900 text-white border-gray-600"
      : "bg-gray-100 text-gray-800 border-gray-300"
  }`;

  return (
    <div
      className={`max-w-2xl mx-auto p-8 rounded-lg shadow-lg ${formContainerClass}`}>
      <div className="text-center">
        <h2 className={`text-xl font-semibold mb-2 ${labelClass}`}>
          {wizardTranslations.step2Title}
        </h2>
        <p
          className={`mb-6 text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-600"
          }`}>
          {wizardTranslations.step2Description}
        </p>
      </div>
      <div className="mb-4">
        <div className="flex items-stretch space-x-2">
          <button
            type="button"
            onClick={handleGenerateToken}
            disabled={isLoading}
            className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            <RefreshCw
              size={18}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading
              ? wizardTranslations.generating
              : wizardTranslations.generateTokenButton}
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              readOnly
              value={serverToken || ""}
              className={`${inputClass} pr-10 font-mono tracking-wider`}
              placeholder={wizardTranslations.tokenPlaceholder}
            />
            {serverToken && (
              <button
                type="button"
                onClick={handleCopyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:bg-gray-300 rounded-full transition-colors p-2"
                title={wizardTranslations.copyToClipboardButton}>
                <Copy size={18} />
              </button>
            )}
          </div>
        </div>
        {copied && (
          <p className="text-green-500 text-xs text-center mt-2">
            {wizardTranslations.copiedMessage}
          </p>
        )}
      </div>

      <div className="mb-4 text-center">
        <button
          type="button"
          onClick={handleCheckConnection}
          disabled={!serverToken || isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isLoading
            ? wizardTranslations.checking
            : wizardTranslations?.checkConnectionButton}
        </button>
        {serverConnectionStatus && (
          <p
            className={`mt-2 font-semibold text-sm ${
              serverConnectionStatus.startsWith(
                wizardTranslations?.connectionSuccess
              )
                ? "text-green-500"
                : "text-red-500"
            }`}>
            {serverConnectionStatus}
          </p>
        )}
      </div>

      {error && (
        <p className="mt-6 text-center text-sm text-red-500">{error}</p>
      )}

      <div
        className="mt-8 flex justify-between border-t pt-6"
        style={{
          borderColor: isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
        }}>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          {storesTranslations.previousButton}
        </button>
        <button
          type="button"
          onClick={handleNextClick}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {storesTranslations.nextButton}
        </button>
      </div>
    </div>
  );
};

export default Step2;
