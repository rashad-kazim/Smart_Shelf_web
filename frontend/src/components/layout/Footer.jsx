// src/components/layout/Footer.js

import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Footer = () => {
  const { currentColors, appTranslations, language } = useAuth();

  const footerTranslations = useMemo(
    () => appTranslations[language]?.footer,
    [appTranslations, language]
  );

  return (
    <footer
      className="w-full p-6 text-center text-sm leading-relaxed transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: currentColors.headerSidebarBg,
        color: currentColors.whiteText,
        // Add style prop for dynamic margin
      }}>
      <p className="mb-2">
        &copy;{new Date().getFullYear()} EilSense.io.{" "}
        {footerTranslations.rights}
      </p>
      <p className="mb-2">{footerTranslations.address}</p>
      <p className="mb-2">
        {footerTranslations.email} info@eilsense.io | {footerTranslations.phone}{" "}
        +48 733 427 798
      </p>
      <p>
        <Link
          to="/privacy-policy"
          className="underline hover:text-gray-300 mx-2">
          {footerTranslations.privacy}
        </Link>{" "}
        |
        <Link to="/terms-of-use" className="underline hover:text-gray-300 mx-2">
          {footerTranslations.terms}
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
