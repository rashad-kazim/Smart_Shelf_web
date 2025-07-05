// src/components/InstallationSteps/Step3.jsx

import React, { useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { Copy, RefreshCw } from "lucide-react";
import CustomDialog from "../common/CustomDialog";

const Step3 = ({ wizardData, updateWizardData, onNext, onBack }) => {
  const { isDarkMode, appTranslations, language } = useAuth();

  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  // Translation comes from translations.js with useMemo
  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );
  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const displayDialog = (title, message) => {
    setDialogContent({
      title,
      message,
      type: "alert",
      onConfirm: () => setShowDialog(false),
    });
    setShowDialog(true);
  };

  const handleGenerateToken = useCallback(async () => {
    if (!wizardData?.storeId) {
      setError(wizardTranslations.storeIdNotFoundError);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post(
        `/api/stores/${wizardData.storeId}/generate-esp32-token`
      );
      const newToken = response.data.esp32_token;

      await axiosInstance.put(`/api/stores/${wizardData.storeId}`, {
        esp32_token: newToken,
      });

      updateWizardData({ esp32_token: newToken });
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
  }, [wizardData, updateWizardData, wizardTranslations]);

  const handleNextClick = () => {
    if (!wizardData.esp32_token) {
      displayDialog(
        wizardTranslations?.errorTitle,
        wizardTranslations?.generateTokenFirst
      );
      return;
    }
    onNext();
  };

  const handleCopyToClipboard = () => {
    if (!wizardData.esp32_token) return;
    navigator.clipboard.writeText(wizardData.esp32_token).then(() => {
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
    <>
      {showDialog && (
        <CustomDialog
          {...dialogContent}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <div
        className={`max-w-2xl mx-auto p-8 rounded-lg shadow-lg ${formContainerClass}`}>
        <div className="text-center">
          <h2 className={`text-xl font-semibold mb-2 ${labelClass}`}>
            {wizardTranslations.step3Title}
          </h2>
          <p
            className={`mb-6 text-sm ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}>
            {wizardTranslations.step3Description}
          </p>
        </div>

        <div className="relative mb-4">
          <label htmlFor="esp32Token" className={labelClass}>
            {wizardTranslations.esp32TokenLabel}
          </label>
          <input
            id="esp32Token"
            type="text"
            value={wizardData.esp32_token || ""}
            readOnly
            className={`${inputClass} pr-10 font-mono tracking-wider`}
            placeholder={wizardTranslations.tokenPlaceholder}
          />
          {wizardData.esp32_token && (
            <button
              onClick={handleCopyToClipboard}
              className="absolute right-2 top-2 p-2 text-gray-500 hover:bg-gray-300 rounded-full transition-colors"
              title={wizardTranslations.copyToClipboardButton}>
              <Copy size={18} />
            </button>
          )}
        </div>
        {copied && (
          <p className="text-green-500 text-xs text-center mb-4">
            {wizardTranslations.copiedMessage}
          </p>
        )}

        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerateToken}
            disabled={isLoading}
            className="flex items-center justify-center bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:bg-gray-400 transition-colors">
            <RefreshCw
              size={18}
              className={`mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading
              ? wizardTranslations.generating
              : wizardTranslations.generateTokenButton}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-center text-sm text-red-500">{error}</p>
        )}

        <div
          className="mt-8 flex justify-between border-t pt-6"
          style={{
            borderColor: isDarkMode
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
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
            disabled={isLoading || !wizardData.esp32_token}
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
            {storesTranslations.nextButton}
          </button>
        </div>
      </div>
    </>
  );
};

export default Step3;
