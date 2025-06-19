// src/components/InstallationSteps/Step2.jsx
import React from "react";
import { Copy } from "lucide-react";

const Step2 = ({
  serverToken,
  serverConnectionStatus,
  colors,
  translations,
  onNext,
  onBack,
  handleGenerateServerToken,
  handleCheckConnection,
  setShowDialog,
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) => {
  const handleNextClick = () => {
    const successMessage =
      translations?.connectionSuccess || "Connection successful!";
    if (!serverToken) {
      setShowDialog(true);
      setDialogTitle(translations?.errorTitle || "Error");
      setDialogMessage(
        translations?.generateTokenFirst || "Please generate a token first."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }
    if (serverConnectionStatus !== successMessage) {
      setShowDialog(true);
      setDialogTitle(translations?.cannotProceedTitle || "Cannot Proceed");
      setDialogMessage(
        translations?.checkConnectionFirst ||
          "Please press 'Check Connection' and ensure it's successful."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }
    onNext();
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(serverToken).then(() => {
      setShowDialog(true);
      setDialogTitle(translations?.copiedMessage || "Success");
      setDialogMessage("Token copied to clipboard!");
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
    });
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2 className="text-xl font-semibold mb-6">
        {translations?.step2Title || "Server Token Generation"}
      </h2>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateServerToken}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
            {translations?.generateTokenButton || "Generate Token"}
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              readOnly
              value={serverToken}
              className="shadow-inner border rounded-md w-full py-2 px-3 bg-gray-100"
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
              }}
            />
            {serverToken && (
              <button
                onClick={handleCopyToClipboard}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-800">
                <Copy size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={handleCheckConnection}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md">
          {translations?.checkConnectionButton || "Check Connection"}
        </button>
        {serverConnectionStatus && (
          <p
            className={`mt-2 font-semibold ${
              serverConnectionStatus ===
              (translations?.connectionSuccess || "Connection successful!")
                ? "text-green-600"
                : "text-red-600"
            }`}>
            {serverConnectionStatus}
          </p>
        )}
      </div>
      <div className="flex justify-between p-4 bg-transparent mt-4 border-t">
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
export default Step2;
