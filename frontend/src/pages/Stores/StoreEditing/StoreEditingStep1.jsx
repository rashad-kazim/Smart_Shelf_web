// src/pages/Stores/StoreEditing/StoreEditingStep1.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { ROLES } from "../../../config/roles";
import { ChevronDown } from "lucide-react";
import AutocompleteInput from "../../../components/common/AutocompleteInput";

const StoreEditingStep1 = ({
  wizardData,
  updateWizardData,
  onBack,
  onNext,
}) => {
  const { profileUser, isDarkMode, appTranslations, language } = useAuth();
  const isAdmin = profileUser?.role === ROLES.ADMIN;

  const [countryOptions, setCountryOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );
  const editStoreTranslations = useMemo(
    () => appTranslations[language]?.["stores.editStore"],
    [appTranslations, language]
  );

  const capitalize = (s) =>
    s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  const timeOptions = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  useEffect(() => {
    if (isAdmin) {
      axiosInstance
        .get("/api/utils/countries")
        .then((res) => setCountryOptions((res.data || []).map(capitalize)))
        .catch((err) => {});
    } else if (profileUser?.country) {
      setCountryOptions([capitalize(profileUser.country)]);
    }
  }, [profileUser, isAdmin]);

  useEffect(() => {
    if (wizardData.country) {
      setCitiesOptions([]);
      axiosInstance
        .get(`/api/utils/cities?country=${wizardData.country.toLowerCase()}`)
        .then((res) => setCitiesOptions((res.data || []).map(capitalize)))
        .catch((err) => setCitiesOptions([]));
    } else {
      setCitiesOptions([]);
    }
  }, [wizardData.country]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateWizardData({ [name]: type === "checkbox" ? checked : value });
  };

  const handleCountryChange = (value) =>
    updateWizardData({ country: value || "", city: "" });
  const handleCityChange = (value) => updateWizardData({ city: value || "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    onNext();
  };

  const labelClass = `block text-sm font-bold mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const inputClass = `w-full p-2 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "bg-white text-gray-800 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto p-8 rounded-lg shadow-lg"
      style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}>
      <h2 className={`text-xl font-semibold mb-6 text-center ${labelClass}`}>
        {editStoreTranslations.step1Title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Country and City (no change) */}
        <div>
          <label className={labelClass}>
            {storesTranslations.countryLabel}
          </label>
          <AutocompleteInput
            options={countryOptions}
            selected={wizardData.country}
            setSelected={handleCountryChange}
            disabled={!isAdmin}
          />
        </div>
        <div>
          <label className={labelClass}>{storesTranslations.cityLabel}</label>
          <AutocompleteInput
            options={citiesOptions}
            selected={wizardData.city || ""}
            setSelected={handleCityChange}
            disabled={!wizardData.country}
          />
        </div>
        {/* Store Name (no change) */}
        <div className="md:col-span-2">
          <label htmlFor="name" className={labelClass}>
            {storesTranslations.storeNameLabel}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={wizardData.name || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        {/* Add Branch (no change) */}
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={wizardData.addBranch || false}
            onChange={handleChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="addBranch" className={`${labelClass} mb-0`}>
            {storesTranslations.addBranchLabel}
          </label>
        </div>
        {wizardData.addBranch && (
          <div className="md:col-span-2">
            <label htmlFor="branch" className={labelClass}>
              {storesTranslations.branchNameLabel}
            </label>
            <input
              id="branch"
              type="text"
              name="branch"
              value={wizardData.branch || ""}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        )}
        {/* Address (no change) */}
        <div className="md:col-span-2">
          <label htmlFor="address" className={labelClass}>
            {storesTranslations.storeBranchAddressLabel}
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={wizardData.address || ""}
            onChange={handleChange}
            className={`${inputClass} resize-y`}></textarea>
        </div>
        {/* --- FIXED SECTION: Working Hours --- */}
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="all_day_open"
            name="all_day_open" // matches the key in `wizardData`
            checked={wizardData.all_day_open || false} // matches the key in `wizardData`
            onChange={handleChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="all_day_open" className={`${labelClass} mb-0`}>
            {storesTranslations.allDayOpenLabel}
          </label>
        </div>
        <div
          className={`grid grid-cols-2 gap-6 md:col-span-2 ${
            wizardData.all_day_open ? "opacity-50" : ""
          }`}>
          <div className="relative">
            <label htmlFor="opening_hour" className={labelClass}>
              {storesTranslations.openingHourLabel}
            </label>
            <select
              id="opening_hour"
              name="opening_hour" // matches the key in `wizardData`
              value={wizardData.opening_hour || "09:00"} // matches the key in `wizardData`
              onChange={handleChange}
              disabled={wizardData.all_day_open}
              className={`${inputClass} appearance-none`}>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
          <div className="relative">
            <label htmlFor="closing_hour" className={labelClass}>
              {storesTranslations.closingHourLabel}
            </label>
            <select
              id="closing_hour"
              name="closing_hour" // matches the key in `wizardData`
              value={wizardData.closing_hour || "21:00"} // matches the key in `wizardData`
              onChange={handleChange}
              disabled={wizardData.all_day_open}
              className={`${inputClass} appearance-none`}>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-10 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
          </div>
        </div>
        {/* Owner Information (no change) */}
        <div>
          <label htmlFor="owner_name" className={labelClass}>
            {storesTranslations.ownerNameLabel}
          </label>
          <input
            id="owner_name"
            type="text"
            name="owner_name"
            value={wizardData.owner_name || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="owner_surname" className={labelClass}>
            {storesTranslations.ownerSurnameLabel}
          </label>
          <input
            id="owner_surname"
            type="text"
            name="owner_surname"
            value={wizardData.owner_surname || ""}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          {storesTranslations.previousButton}
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700">
          {storesTranslations.nextButton}
        </button>
      </div>
    </form>
  );
};

export default StoreEditingStep1;
