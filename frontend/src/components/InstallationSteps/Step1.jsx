// src/components/InstallationSteps/Step1.jsx
// STATUS: FINAL v4 (Only store creation, no update) - Bug Fixed

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { ROLES } from "../../config/roles";
import { ChevronDown } from "lucide-react";
import AutocompleteInput from "../common/AutocompleteInput";

const Step1 = ({ wizardData, updateWizardData, onBack, onNext }) => {
  const { profileUser, isDarkMode, appTranslations, language } = useAuth();
  const isAdmin = profileUser?.role === ROLES.ADMIN;

  const capitalize = (s) =>
    s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [Error, setError] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [citiesOptions, setCitiesOptions] = useState([]);

  const timeOptions = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );

  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );
  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common || appTranslations.en?.common,
    [appTranslations, language]
  );

  // Helper function to convert error message to string
  const getErrorMessage = (error) => {
    if (typeof error === "string") {
      return error;
    }
    if (typeof error === "object" && error !== null) {
      // If error is an object, check for msg or message field
      if (error.msg) return error.msg;
      if (error.message) return error.message;
      // If not, convert to JSON string
      return JSON.stringify(error);
    }
    return String(error);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    updateWizardData({ [name]: type === "checkbox" ? checked : value });
  };

  const handleCountryChange = (value) => {
    updateWizardData({ country: value || "", city: "" });
  };

  const handleCityChange = (value) => {
    updateWizardData({ city: value || "" });
  };

  useEffect(() => {
    if (isAdmin) {
      axiosInstance
        .get("/api/utils/countries")
        .then((res) => setCountryOptions((res.data || []).map(capitalize)))
        .catch((err) => console.error("Failed to fetch countries", err));
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    setFormErrors({});
    const newErrors = {};
    let isValid = true;

    let firstErrorFieldId = null;

    const requiredFields = [
      "country",
      "city",
      "name",
      "address",
      "ownerName",
      "ownerSurname",
    ];

    if (!wizardData.allDayOpen) {
      requiredFields.push("openingHour", "closingHour");
    }
    if (wizardData.addBranch) {
      requiredFields.push("branch");
    }

    for (const field of requiredFields) {
      if (
        !wizardData[field] ||
        (typeof wizardData[field] === "string" &&
          wizardData[field].trim() === "")
      ) {
        isValid = false;
        newErrors[field] = wizardTranslations.requiredFieldWarning;
        if (!firstErrorFieldId) {
          firstErrorFieldId = document.getElementById(field);
        }
      }
    }
    setFormErrors(newErrors);

    // If form is not valid, stop here.
    if (!isValid) {
      firstErrorFieldId?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    // Calculate working hours
    let working_hours = "24/7";
    if (
      !wizardData.allDayOpen &&
      wizardData.openingHour &&
      wizardData.closingHour
    ) {
      working_hours = `${wizardData.openingHour}-${wizardData.closingHour}`;
    }

    // Prepare payload - only store information
    const payload = {
      country: wizardData.country,
      city: wizardData.city,
      name: wizardData.name,
      address: wizardData.address,
      ownerName: wizardData.ownerName,
      ownerSurname: wizardData.ownerSurname,
      working_hours,
      devices: [],
      ...(wizardData.addBranch && { branch: wizardData.branch }),
    };

    try {
      // Only create new store (no PUT)
      const response = await axiosInstance.post("/api/stores", payload);

      // Save store ID to wizardData
      updateWizardData({ storeId: response.data.id });

      // Continue only with store ID
      onNext(response.data.id);
    } catch (err) {
      // Properly handle error message from API
      let errorMessage = "An error occurred.";

      if (err.response?.data?.detail) {
        errorMessage = getErrorMessage(err.response.data.detail);
      } else if (err.response?.data?.message) {
        errorMessage = getErrorMessage(err.response.data.message);
      } else if (err.message) {
        errorMessage = getErrorMessage(err.message);
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const formContainerClass = isDarkMode ? "bg-gray-800" : "bg-white";
  const labelClass = `block text-sm font-bold mb-2 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const inputClass = `w-full p-2 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;

  const errorBorderClass = "border-red-500";

  return (
    <form
      onSubmit={handleSubmit}
      className={`max-w-4xl mx-auto p-8 rounded-lg shadow-lg ${formContainerClass}`}>
      <h2 className={`text-xl font-semibold mb-6 ${labelClass}`}>
        {wizardTranslations.step1Title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            {storesTranslations.countryLabel}
          </label>
          <AutocompleteInput
            id="country"
            options={countryOptions}
            selected={wizardData.country}
            setSelected={handleCountryChange}
            disabled={!isAdmin}
            placeholder={commonTranslations.searchPlaceholder}
          />
          {formErrors.country && (
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.country)}
            </p>
          )}
        </div>
        <div>
          <label className={labelClass}>{storesTranslations.cityLabel}</label>
          <AutocompleteInput
            id="city"
            options={citiesOptions}
            selected={wizardData.city}
            setSelected={handleCityChange}
            disabled={!wizardData.country}
            placeholder={commonTranslations.searchPlaceholder}
          />
          {formErrors.city && (
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.city)}
            </p>
          )}
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>
            {storesTranslations.storeNameLabel}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={wizardData.name}
            onChange={handleChange}
            required
            className={`${inputClass} ${
              formErrors.name ? errorBorderClass : ""
            }`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.name)}
            </p>
          )}
        </div>
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={wizardData.addBranch}
            onChange={handleChange}
            className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="addBranch" className={`${labelClass} mt-1.5`}>
            {wizardTranslations.addBranchLabel}
          </label>
        </div>
        {wizardData.addBranch && (
          <div className="md:col-span-2">
            <label htmlFor="branch" className={labelClass}>
              {storesTranslations.branchNameLabel}
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={wizardData.branch}
              onChange={handleChange}
              required
              className={`${inputClass} ${
                formErrors.branch ? errorBorderClass : ""
              }`}
            />
            {formErrors.branch && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage(formErrors.branch)}
              </p>
            )}
          </div>
        )}
        <div className="md:col-span-2">
          <label className={labelClass}>
            {storesTranslations.storeBranchAddressLabel}
          </label>
          <textarea
            name="address"
            rows="3"
            value={wizardData.address}
            onChange={handleChange}
            required
            className={`${inputClass} resize-y ${
              formErrors.address ? errorBorderClass : ""
            }`}></textarea>
          {formErrors.address && (
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.address)}
            </p>
          )}
        </div>
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="allDayOpen"
            name="allDayOpen"
            checked={wizardData.allDayOpen}
            onChange={handleChange}
            className="mr-2 h-4 w-4 rounded text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allDayOpen" className={`${labelClass} mt-2`}>
            {storesTranslations.allDayOpenLabel}
          </label>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 md:col-span-2 ${
            wizardData.allDayOpen ? "opacity-50" : ""
          }`}>
          <div className="relative">
            <label className={labelClass}>
              {storesTranslations.openingHourLabel}
            </label>
            <select
              id="openingHour"
              name="openingHour"
              value={wizardData.openingHour}
              onChange={handleChange}
              disabled={wizardData.allDayOpen}
              required={!wizardData.allDayOpen}
              className={`${inputClass} appearance-none ${
                formErrors.openingHour ? errorBorderClass : ""
              }`}>
              <option value="">{storesTranslations.selectHour}</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
              size={18}
            />
          </div>
          <div className="relative">
            <label className={labelClass}>
              {storesTranslations.closingHourLabel}
            </label>
            <select
              id="closingHour"
              name="closingHour"
              value={wizardData.closingHour}
              onChange={handleChange}
              disabled={wizardData.allDayOpen}
              required={!wizardData.allDayOpen}
              className={`${inputClass} appearance-none ${
                formErrors.closingHour ? errorBorderClass : ""
              }`}>
              <option value="">{storesTranslations.selectHour}</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
              size={18}
            />
          </div>
        </div>

        {formErrors.openingHour && (
          <div className="md:col-span-2">
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.openingHour)}
            </p>
          </div>
        )}
        {formErrors.closingHour && (
          <div className="md:col-span-2">
            <p className="text-red-500 text-xs mt-1">
              {getErrorMessage(formErrors.closingHour)}
            </p>
          </div>
        )}

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              {storesTranslations.ownerNameLabel}
            </label>
            <input
              id="ownerName"
              type="text"
              name="ownerName"
              value={wizardData.ownerName}
              onChange={handleChange}
              required
              className={`${inputClass} ${
                formErrors.ownerName ? errorBorderClass : ""
              }`}
            />
            {formErrors.ownerName && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage(formErrors.ownerName)}
              </p>
            )}
          </div>
          <div>
            <label className={labelClass}>
              {storesTranslations.ownerSurnameLabel}
            </label>
            <input
              id="ownerSurname"
              type="text"
              name="ownerSurname"
              value={wizardData.ownerSurname}
              onChange={handleChange}
              required
              className={`${inputClass} ${
                formErrors.ownerSurname ? errorBorderClass : ""
              }`}
            />
            {formErrors.ownerSurname && (
              <p className="text-red-500 text-xs mt-1">
                {getErrorMessage(formErrors.ownerSurname)}
              </p>
            )}
          </div>
        </div>
      </div>

      {Error && (
        <p className="mt-6 text-center text-sm text-red-500">
          {getErrorMessage(Error)}
        </p>
      )}

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={(e) => {
            onBack();
          }}
          className="px-6 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
          {commonTranslations.cancelButton || "Cancel"}
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isLoading
            ? commonTranslations.saving || "Saving..."
            : commonTranslations.nextButton || "Next"}
        </button>
      </div>
    </form>
  );
};

export default Step1;
