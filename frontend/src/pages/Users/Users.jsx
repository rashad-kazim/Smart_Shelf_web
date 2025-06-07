import React from "react";

// Users Page Component
function UsersPage({ colors, translations }) {
  return (
    <>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: colors.darkText }}>
        {translations.users.title}
      </h1>
      <div
        className="p-8 rounded-lg shadow-md"
        style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
        <p>{translations.users.introText}</p>
        <p className="mt-4" style={{ color: colors.mediumGrayText }}>
          {translations.users.instructionText}
        </p>
        <p className="mt-4" style={{ color: colors.mediumGrayText }}>
          {translations.users.futureFeatures}
        </p>
      </div>
    </>
  );
}

export default UsersPage;
