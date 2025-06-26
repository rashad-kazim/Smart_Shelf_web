// src/components/common/PageHeader.jsx

import React from "react";
import { useAuth } from "../../context/AuthContext";

const PageHeader = ({ title, subtitle, children }) => {
  const { currentColors } = useAuth();

  return (
    <div
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-4 border-b"
      style={{ borderColor: currentColors.borderColor }}>
      <div className="mb-4 sm:mb-0">
        <h1
          className="text-2xl sm:text-3xl font-bold"
          style={{ color: currentColors.darkText }}>
          {title}
        </h1>
        {subtitle && (
          <p
            className="mt-1 text-sm"
            style={{ color: currentColors.mediumGrayText }}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
};

export default PageHeader;
