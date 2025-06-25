// src/components/common/CustomDialog.jsx

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const CustomDialog = ({
  title,
  message,
  type,
  onConfirm,
  onCancel,
  confirmationText,
}) => {
  const { currentColors: colors, appTranslations, language } = useAuth();
  const translations = appTranslations[language]?.dialogs || {};

  const [confirmInput, setConfirmInput] = useState("");
  const isConfirmDisabled =
    confirmationText && confirmInput.trim() !== confirmationText;

  useEffect(() => {
    setConfirmInput("");
  }, [confirmationText]);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div
        className="p-6 rounded-lg shadow-xl max-w-sm w-full"
        style={{ backgroundColor: colors.pureWhite }}>
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors.darkText }}>
          {title}
        </h3>
        <p className="mb-4 text-sm" style={{ color: colors.mediumGrayText }}>
          {message}
        </p>

        {confirmationText && (
          <div className="mb-4">
            <label
              className="block text-sm mb-2"
              style={{ color: colors.darkText }}>
              {translations.deleteConfirmationPrompt ||
                "Onaylamak için lütfen şunu yazın:"}{" "}
              <strong className="font-mono select-all">
                {confirmationText}
              </strong>
            </label>
            <input
              type="text"
              value={confirmInput}
              onChange={(e) => setConfirmInput(e.target.value)}
              className="w-full p-2 rounded-md border"
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: colors.mediumGrayText,
              }}
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 mt-6">
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-md font-bold"
              style={{
                backgroundColor: colors.prevButtonBg,
                color: colors.whiteText,
              }}>
              {translations.noButton || "Hayır"}
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={isConfirmDisabled}
            className={`px-4 py-2 rounded-md font-bold text-white transition-opacity ${
              isConfirmDisabled
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-opacity-80"
            }`}
            style={{
              backgroundColor: isConfirmDisabled
                ? colors.mediumGrayText
                : colors.logoPrimaryBlue,
            }}>
            {type === "confirm"
              ? translations.yesButton || "Evet"
              : translations.okButton || "Tamam"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
