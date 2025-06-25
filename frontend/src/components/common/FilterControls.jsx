import React from "react";
import { RotateCcw, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const FilterControls = ({
  countryOptions = [],
  cityOptions = [],
  selectedCountries = [],
  selectedCities = [], // Artık bu da bir dizi
  toggleCountry,
  toggleCity, // Çoklu şehir seçimi için yeni fonksiyon
  resetFilters,
  isCountryDisabled = false,
}) => {
  const { currentColors, appTranslations, language } = useAuth();
  const translations = appTranslations[language]?.stores || {};
  const inputStyle = {
    backgroundColor: currentColors.pureWhite,
    color: currentColors.darkText,
    borderColor: currentColors.mediumGrayText,
  };

  // Şehir dropdown'ı, en az bir ülke seçilmeden aktif olmaz.
  const isCityDisabled = selectedCountries.length === 0;

  return (
    <div
      className="p-4 rounded-lg mb-6"
      style={{ backgroundColor: currentColors.secondaryBackground }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Ülke Filtresi */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.country || "Country"}
          </label>
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value) toggleCountry(value);
            }}
            disabled={isCountryDisabled}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
            value="" // Her seçimden sonra başa dönmesi için
          >
            {isCountryDisabled && selectedCountries.length > 0 ? (
              <option value={selectedCountries[0]}>
                {selectedCountries[0]}
              </option>
            ) : (
              <>
                <option value="" disabled>
                  {translations.select || "Select..."}
                </option>
                {countryOptions
                  .filter((country) => !selectedCountries.includes(country))
                  .map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
              </>
            )}
          </select>
        </div>

        {/* Şehir Filtresi */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {translations.city || "City"}
          </label>
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value) toggleCity(value);
            }}
            disabled={isCityDisabled}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
            value="" // Her seçimden sonra başa dönmesi için
          >
            <option value="" disabled>
              {translations.select || "Select..."}
            </option>
            {cityOptions
              .filter((city) => !selectedCities.includes(city))
              .map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>

        {/* Reset Butonu */}
        <button
          onClick={resetFilters}
          className="flex items-center justify-center px-4 py-2 rounded-md font-medium text-white h-10"
          style={{ backgroundColor: currentColors.logoPrimaryBlue }}>
          <RotateCcw size={18} className="mr-2" />
          {translations.resetFilters || "Reset Filters"}
        </button>
      </div>

      {/* Seçili Filtre Etiketleri */}
      <div className="flex flex-wrap gap-2 mt-4 min-h-[28px]">
        {selectedCountries.map((country) => (
          <span
            key={country}
            className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {country}
            {!isCountryDisabled && (
              <button
                onClick={() => toggleCountry(country)}
                className="ml-2 text-blue-500 hover:text-blue-700">
                <X size={14} />
              </button>
            )}
          </span>
        ))}
        {selectedCities.map((city) => (
          <span
            key={city}
            className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {city}
            <button
              onClick={() => toggleCity(city)}
              className="ml-2 text-green-500 hover:text-green-700">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default FilterControls;
