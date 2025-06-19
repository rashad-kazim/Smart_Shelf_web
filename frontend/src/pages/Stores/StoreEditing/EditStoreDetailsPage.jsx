// src/pages/Stores/EditStoreDetailsPage.jsx
import React, { useState, useMemo, useRef, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../config/roles";
import { ChevronDown, RotateCcw, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EditStoreDetailsPage = () => {
  const {
    profileUser,
    stores,
    currentColors: colors,
    appTranslations,
    language,
    isDarkMode,
  } = useAuth();

  const navigate = useNavigate();
  const translations = useMemo(
    () => appTranslations[language]?.stores || {},
    [appTranslations, language]
  );

  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [countryInput, setCountryInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryInputRef.current &&
        !countryInputRef.current.contains(event.target)
      ) {
        setShowCountrySuggestions(false);
      }
      if (
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target)
      ) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCountryInputChange = (e) => setCountryInput(e.target.value);
  const handleCityInputChange = (e) => setCityInput(e.target.value);

  const addFilter = (value, type) => {
    if (type === "country" && value && !selectedCountries.includes(value)) {
      setSelectedCountries([...selectedCountries, value]);
      setCountryInput("");
      setShowCountrySuggestions(false);
    } else if (type === "city" && value && !selectedCities.includes(value)) {
      setSelectedCities([...selectedCities, value]);
      setCityInput("");
      setShowCitySuggestions(false);
    }
  };

  const removeFilter = (value, type) => {
    if (type === "country")
      setSelectedCountries(selectedCountries.filter((item) => item !== value));
    else if (type === "city")
      setSelectedCities(selectedCities.filter((item) => item !== value));
  };

  const handleResetFilters = () => {
    setSelectedCountries([]);
    setSelectedCities([]);
    setCountryInput("");
    setCityInput("");
  };

  const handleEditStore = (storeId) => {
    navigate(`/edit-store-workflow/${storeId}`);
  };

  const availableStores = useMemo(() => {
    if (isAdmin) return stores;
    if (isCountryChief || isEngineer) {
      // Engineers will now also see their own country
      return stores.filter((store) => store.country === profileUser.country);
    }
    return [];
  }, [stores, profileUser, isAdmin, isCountryChief, isEngineer]);

  // FIX: Added isEngineer role to uniqueCountries logic
  const uniqueCountries = useMemo(() => {
    if (isAdmin)
      return [...new Set(availableStores.map((store) => store.country))]
        .filter(
          (c) =>
            c.toLowerCase().includes(countryInput.toLowerCase()) &&
            !selectedCountries.includes(c)
        )
        .sort();
    if (isCountryChief || isEngineer) {
      // Engineers will only see their own country
      return [profileUser.country].filter(Boolean);
    }
    return [];
  }, [
    availableStores,
    countryInput,
    selectedCountries,
    isAdmin,
    isCountryChief,
    isEngineer,
    profileUser.country,
  ]);

  const uniqueCities = useMemo(() => {
    let relevantStores = availableStores;
    if (selectedCountries.length > 0) {
      relevantStores = relevantStores.filter((store) =>
        selectedCountries.includes(store.country)
      );
    }
    return [...new Set(relevantStores.map((store) => store.city))]
      .filter(
        (c) =>
          c.toLowerCase().includes(cityInput.toLowerCase()) &&
          !selectedCities.includes(c)
      )
      .sort();
  }, [availableStores, selectedCountries, cityInput, selectedCities]);

  const filteredStores = useMemo(() => {
    return availableStores.filter((store) => {
      const countryMatch =
        selectedCountries.length === 0 ||
        selectedCountries.includes(store.country);
      const cityMatch =
        selectedCities.length === 0 || selectedCities.includes(store.city);
      return countryMatch && cityMatch;
    });
  }, [availableStores, selectedCountries, selectedCities]);

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.editStoreTitle || "Edit Store Information"}
      </h1>
      <div className="flex flex-wrap items-start gap-4 mb-4">
        <div className="relative" ref={countryInputRef}>
          <label className="block text-sm font-medium mb-1">
            {translations.country || "Country"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={countryInput}
              onChange={handleCountryInputChange}
              onFocus={() => setShowCountrySuggestions(true)}
              placeholder={translations.typeToFilter || "Type to filter..."}
              className="p-2 w-full border rounded-md"
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: colors.mediumGrayText,
              }}
            />
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          {showCountrySuggestions && uniqueCountries.length > 0 && (
            <ul
              className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
              style={{
                backgroundColor: colors.pureWhite,
                borderColor: colors.mediumGrayText,
              }}>
              {uniqueCountries.map((country) => (
                <li
                  key={country}
                  onMouseDown={() => addFilter(country, "country")}
                  className={`px-4 py-2 cursor-pointer ${
                    isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200 hover:text-black"
                  }`}>
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="relative" ref={cityInputRef}>
          <label className="block text-sm font-medium mb-1">
            {translations.city || "City"}
          </label>
          <div className="relative">
            <input
              type="text"
              value={cityInput}
              onChange={handleCityInputChange}
              onFocus={() => setShowCitySuggestions(true)}
              placeholder={translations.typeToFilter || "Type to filter..."}
              className="p-2 w-full border rounded-md"
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: colors.mediumGrayText,
              }}
            />
            <ChevronDown
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          {showCitySuggestions && uniqueCities.length > 0 && (
            <ul
              className="absolute z-10 w-full bg-white border mt-1 rounded-md shadow-lg max-h-60 overflow-y-auto"
              style={{
                backgroundColor: colors.pureWhite,
                borderColor: colors.mediumGrayText,
              }}>
              {uniqueCities.map((city) => (
                <li
                  key={city}
                  onMouseDown={() => addFilter(city, "city")}
                  className={`px-4 py-2 cursor-pointer ${
                    isDarkMode
                      ? "hover:bg-gray-700"
                      : "hover:bg-gray-200 hover:text-black"
                  }`}>
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-end self-end mb-0.5 h-full">
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-md font-medium flex items-center"
            style={{
              backgroundColor: colors.logoPrimaryBlue,
              color: colors.whiteText,
            }}>
            <RotateCcw size={18} className="mr-2" />
            {translations.resetFilters || "Reset Filters"}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedCountries.map((country) => (
          <span
            key={country}
            className="flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
            {country}
            <button
              onClick={() => removeFilter(country, "country")}
              className="ml-2 text-blue-500 hover:text-blue-700">
              <X size={14} />
            </button>
          </span>
        ))}
        {selectedCities.map((city) => (
          <span
            key={city}
            className="flex items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            {city}
            <button
              onClick={() => removeFilter(city, "city")}
              className="ml-2 text-green-500 hover:text-green-700">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>
      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: colors.mediumGrayText }}>
        <table
          className="min-w-full divide-y"
          style={{ borderColor: colors.mediumGrayText }}>
          <thead style={{ backgroundColor: colors.lightGrayBg }}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.nameHeader || "Store Name"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.countryHeader || "Country"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.cityHeader || "City"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.branchHeader || "Branch"}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: colors.pureWhite }}>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <tr
                  key={store.id}
                  className={`border-t ${
                    isDarkMode
                      ? "text-gray-100 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-200 hover:text-black"
                  }`}
                  style={{ borderColor: colors.lightGrayBg }}>
                  <td className="px-6 py-4">{store.name}</td>
                  <td className="px-6 py-4">{store.country}</td>
                  <td className="px-6 py-4">{store.city}</td>
                  <td className="px-6 py-4">{store.branch || "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEditStore(store.id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1.5 px-3 rounded-md">
                      {translations.editButton || "Edit"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  {translations.noStoresFound || "No stores found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EditStoreDetailsPage;
