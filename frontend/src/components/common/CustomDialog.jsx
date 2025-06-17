// CustomDialog.js
// Modal/Dialog component
// src/components/common/CustomDialog.js
import React, { useState } from "react";

const CustomDialog = ({
  title,
  message,
  type,
  onConfirm,
  onCancel,
  colors,
  storeNameForConfirmation,
  translations,
}) => {
  const [localConfirmInput, setLocalConfirmInput] = useState("");
  const [localConfirmInputError, setLocalConfirmInputError] = useState("");

  const handleConfirm = () => {
    if (type === "confirm" && storeNameForConfirmation) {
      if (localConfirmInput.trim() === storeNameForConfirmation) {
        onConfirm(localConfirmInput.trim());
      } else {
        setLocalConfirmInputError(translations.deleteConfirmationMismatch);
      }
    } else {
      onConfirm();
    }
  };

  const handleCancel = () => {
    setLocalConfirmInput("");
    setLocalConfirmInputError("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
        style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors.darkText }}>
          {title}
        </h3>
        <p className="mb-6">{message}</p>

        {type === "confirm" && storeNameForConfirmation && (
          <div className="mb-4">
            <label
              htmlFor="confirmInput"
              className="block text-sm font-medium mb-2"
              style={{ color: colors.darkText }}>
              {translations.deleteConfirmationPrompt}
            </label>
            <input
              type="text"
              id="confirmInput"
              value={localConfirmInput}
              onChange={(e) => {
                setLocalConfirmInput(e.target.value);
                setLocalConfirmInputError("");
              }}
              placeholder={translations.deleteConfirmationPlaceholder}
              className={`w-full p-2 rounded-md border ${
                localConfirmInputError ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
              }}
            />
            {localConfirmInputError && (
              <p className="text-red-500 text-xs italic mt-1">
                {localConfirmInputError}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          {type === "confirm" && (
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
              style={{ backgroundColor: colors.prevButtonBg }}>
              {translations.noButton || "No"}
            </button>
          )}
          <button
            onClick={type === "confirm" ? handleConfirm : onCancel}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200
              ${
                type === "confirm" &&
                storeNameForConfirmation &&
                localConfirmInput.trim() !== storeNameForConfirmation
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }
            `}
            style={{ backgroundColor: colors.logoSecondaryBlue }}
            disabled={
              type === "confirm" &&
              storeNameForConfirmation &&
              localConfirmInput.trim() !== storeNameForConfirmation
            }>
            {type === "confirm" ? translations.yesButton || "Yes" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
