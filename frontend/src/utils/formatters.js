// src/utils/formatters.js

/**
 * Converts a date string to a local and readable format.
 * @param {string} dateString - The date to be converted.
 * @param {object} translations - Translation object, should include the 'notAvailable' key.
 * @returns {string} Formatted date or "N/A" (not available).
 */
export const formatDateTime = (dateString, translations) => {
  // If there is no date string or it is empty, return the "not available" text from translations.
  if (!dateString) return translations?.notAvailable || "N/A";

  const date = new Date(dateString);

  // If the date is invalid, return the "not available" text.
  if (isNaN(date.getTime())) return translations?.notAvailable || "N/A";

  // Format the date according to the United Kingdom (GB) format (DD/MM/YYYY, 24-hour).
  return date.toLocaleString("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

// Additional formatting functions can be added here in the future.
// For example: currency formatting, text shortening, etc.
