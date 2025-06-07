import React from "react";

// Dashboard Sayfası Bileşeni
function DashboardPage({ colors, translations }) {
  return (
    <>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: colors.darkText }}>
        {translations.dashboard.title}
      </h1>

      <div
        className="p-8 rounded-lg shadow-md"
        style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
        <p>{translations.dashboard.welcomeText}</p>
        <p className="mt-4" style={{ color: colors.mediumGrayText }}>
          {translations.dashboard.instructionText}
        </p>
        <div
          className="mt-6 p-4 rounded-md text-sm"
          style={{
            backgroundColor: colors.logoPrimaryBlue,
            color: colors.whiteText,
          }}>
          <p>{translations.dashboard.note}</p>
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
