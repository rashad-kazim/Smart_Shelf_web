// Footer.js
// Footer bar component
// src/components/layout/Footer.js
import React from "react";
import { Link } from "react-router-dom";

const Footer = ({ currentColors, appTranslations }) => {
  const translations = appTranslations.en; // When language dynamic is added, this will be appTranslations[language]

  return (
    <footer
      className="w-full p-6 text-center text-sm leading-relaxed"
      style={{
        backgroundColor: currentColors.headerSidebarBg,
        color: currentColors.whiteText,
      }}>
      <p className="mb-2">
        &copy;{new Date().getFullYear()} EilSense.io.{" "}
        {translations.footer.rights}
      </p>
      <p className="mb-2">{translations.footer.address}</p>
      <p className="mb-2">
        {translations.footer.email} info@eilsense.io |{" "}
        {translations.footer.phone} +48 733 427 798
      </p>
      <p>
        <Link
          to="/privacy-policy"
          className="underline hover:text-gray-300 mx-2">
          {translations.footer.privacy}
        </Link>{" "}
        |
        <Link to="/terms-of-use" className="underline hover:text-gray-300 mx-2">
          {translations.footer.terms}
        </Link>
      </p>
    </footer>
  );
};

export default Footer;
