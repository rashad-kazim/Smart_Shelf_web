// src/components/common/FilterControls.jsx
// STATUS: FINAL (Central and reusable filter component for all store pages)

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { RotateCcw, X } from "lucide-react";

// This component receives filtering logic (hook) and data from outside, only renders the UI.
const FilterControls = ({
  profileUser,
  countryOptions,
  cityOptions,
  selectedCountries,
  selectedCities,
  onCountryChange,
  onCityChange,
  onReset,
  isCountryDisabled = false,
  isMultiCountry = true,
  isMultiCity = true,
}) => {
  const { isDarkMode, appTranslations, language } = useAuth();

  const selectClass = `w-full p-2 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-white text-gray-800 border-gray-300"
  }`;
  const disabledSelectClass = `cursor-not-allowed ${
    isDarkMode ? "bg-gray-800 text-gray-500" : "bg-gray-100 text-gray-500"
  }`;

  const translations = useMemo(
    () => appTranslations[language]?.["stores.filterControls"],
    [appTranslations, language]
  );

  return (
    <div
      className={`p-4 rounded-lg border mb-6 ${
        isDarkMode
          ? "bg-gray-900/50 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}>
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">
            {translations?.country}
          </label>
          <select
            value={isMultiCountry ? "" : selectedCountries[0] || ""}
            onChange={(e) => onCountryChange(e.target.value)}
            disabled={isCountryDisabled}
            className={`${selectClass} ${
              isCountryDisabled ? disabledSelectClass : ""
            }`}>
            <option value="">{translations?.allCountries}</option>
            {countryOptions.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-1">
            {translations?.city}
          </label>
          <select
            value={isMultiCity ? "" : selectedCities[0] || ""}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={
              countryOptions.length === 0 && selectedCountries.length === 0
            }
            className={`${selectClass} ${
              countryOptions.length === 0 && selectedCountries.length === 0
                ? disabledSelectClass
                : ""
            }`}>
            <option value="">{translations?.allCities}</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-5">
          <button
            onClick={onReset}
            className="flex items-center px-4 py-2 rounded-md font-medium text-white bg-gray-500 hover:bg-gray-600 transition-colors"
            title={translations?.resetButton}>
            <RotateCcw size={16} className="mr-2" />
            {translations?.resetButton}
          </button>
        </div>
      </div>

      {(selectedCountries.length > 0 || selectedCities.length > 0) && (
        <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
          {selectedCountries.map((country) => (
            <span
              key={country}
              className="flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-blue-900 dark:text-blue-300">
              {country}
              <button
                onClick={() => onCountryChange(country)}
                className="ml-1.5 text-blue-500 hover:text-blue-700">
                <X size={14} />
              </button>
            </span>
          ))}
          {selectedCities.map((city) => (
            <span
              key={city}
              className="flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full dark:bg-green-900 dark:text-green-300">
              {city}
              <button
                onClick={() => onCityChange(city)}
                className="ml-1.5 text-green-500 hover:text-green-700">
                <X size={14} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterControls;
