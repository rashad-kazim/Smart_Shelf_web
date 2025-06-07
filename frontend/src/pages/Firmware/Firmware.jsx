import React from "react";

// Firmware Page Component
function FirmwarePage({ colors, translations }) {
  return (
    <>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: colors.darkText }}>
        {translations.firmware.title}
      </h1>
      <div
        className="p-8 rounded-lg shadow-md"
        style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
        <p>{translations.firmware.introText}</p>
        <p className="mt-4" style={{ color: colors.mediumGrayText }}>
          {translations.firmware.instructionText}
        </p>
        <p className="mt-4" style={{ color: colors.mediumGrayText }}>
          {translations.firmware.futureFeatures}
        </p>
      </div>
    </>
  );
}

export default FirmwarePage;
