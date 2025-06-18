// src/components/InstallationSteps/Step3.jsx
import React from "react";
import { Copy } from "lucide-react";

const Step3 = ({
  esp32Token,
  colors,
  translations,
  onNext,
  onBack,
  handleGenerateEsp32Token,
  setShowDialog,
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) => {
  const handleNextClick = () => {
    if (!esp32Token) {
      setShowDialog(true);
      setDialogTitle(translations?.errorTitle || "Error");
      setDialogMessage(
        translations?.generateTokenFirst ||
          "Please generate an ESP32 token before proceeding."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }
    onNext();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(esp32Token);
    setShowDialog(true);
    setDialogTitle(translations?.copiedMessage || "Copied!");
    setDialogMessage("ESP32 Token copied to clipboard!");
    setDialogType("alert");
    setDialogCallback(() => () => setShowDialog(false));
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2 className="text-xl font-semibold mb-6">
        {translations?.step3Title || "ESP32 Token Generation"}
      </h2>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateEsp32Token}
            // DÜZELTME: py-1.5 -> py-2 yapıldı ve whitespace-nowrap eklendi
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md whitespace-nowrap">
            {translations?.generateTokenButton || "Generate Token"}
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              readOnly
              value={esp32Token}
              className="shadow-inner border rounded-md w-full py-2 px-3 bg-gray-100"
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {esp32Token && (
              <button
                onClick={handleCopyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800">
                <Copy size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between p-4 bg-transparent mt-8 border-t">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton || "Previous"}
        </button>
        <button
          onClick={handleNextClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton || "Next"}
        </button>
      </div>
    </div>
  );
};

export default Step3;
