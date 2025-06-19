// src/components/common/CustomDialog.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CustomDialog = () => {
  // All necessary state and functions are taken directly from context
  const {
    showDialog,
    setShowDialog,
    dialogTitle,
    dialogMessage,
    dialogType,
    dialogCallback,
    dialogConfirmationText,
    setDialogConfirmationText,
    appTranslations,
    language,
    currentColors: colors,
  } = useAuth();

  const translations = appTranslations[language]?.users || {};

  // Component-specific states: user input and error state
  const [confirmInput, setConfirmInput] = useState("");
  const [confirmError, setConfirmError] = useState(false);

  // Clear input and error when dialog opens
  useEffect(() => {
    if (showDialog) {
      setConfirmInput("");
      setConfirmError(false);
    }
  }, [showDialog]);

  // Show nothing if dialog is closed
  if (!showDialog) {
    return null;
  }

  const handleConfirm = () => {
    // If this is a confirmation dialog and confirmation text is required
    if (dialogType === "confirm" && dialogConfirmationText) {
      if (confirmInput.trim() === dialogConfirmationText) {
        if (dialogCallback) dialogCallback(); // Trigger the actual delete operation
        handleClose(); // Close the dialog
      } else {
        setConfirmError(true); // Set error state
      }
    } else {
      if (dialogCallback) dialogCallback();
      handleClose();
    }
  };

  const handleClose = () => {
    setShowDialog(false);
    // Clear states for next use
    setConfirmInput("");
    setConfirmError(false);
    if (setDialogConfirmationText) {
      setDialogConfirmationText("");
    }
  };

  // Disable "Yes" button if confirmation text is not entered correctly
  const isConfirmDisabled =
    dialogType === "confirm" &&
    dialogConfirmationText &&
    confirmInput.trim() !== dialogConfirmationText;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className="p-6 rounded-lg shadow-xl max-w-sm w-full"
        style={{ backgroundColor: colors.pureWhite }}>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors.darkText }}>
          {dialogTitle}
        </h3>
        <p className="mb-4" style={{ color: colors.mediumGrayText }}>
          {dialogMessage}
        </p>

        {/* FIX: Show this input only when confirmation text is required */}
        {dialogType === "confirm" && dialogConfirmationText && (
          <div className="mb-4">
            <label
              className="block text-sm mb-2"
              style={{ color: colors.darkText }}>
              {translations.deleteConfirmationPrompt ||
                "Please type the following to confirm:"}{" "}
              <strong className="font-mono select-all">
                {dialogConfirmationText}
              </strong>
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => {
                setConfirmInput(e.target.value);
                setConfirmError(false);
              }}
              placeholder={
                translations.deleteConfirmationPlaceholder ||
                "Type full name here"
              }
              className={`w-full p-2 rounded-md border ${
                confirmError ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: confirmError
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {confirmError && (
              <p className="text-red-500 text-xs mt-1">
                {translations.deleteConfirmationMismatch ||
                  "The entered text does not match."}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-4">
          {dialogType === "confirm" && (
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-md font-bold"
              style={{
                backgroundColor: colors.prevButtonBg,
                color: colors.whiteText,
              }}>
              {translations.noButton || "No"}
            </button>
          )}
          <button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 rounded-md font-bold text-white transition-opacity ${
              isConfirmDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-opacity-80"
            }`}
            style={{ backgroundColor: colors.logoPrimaryBlue }}>
            {dialogType === "confirm" ? translations.yesButton || "Yes" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
