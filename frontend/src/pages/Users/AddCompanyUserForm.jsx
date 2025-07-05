// src/pages/Users/AddCompanyUserForm.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { ROLES, ROLES_LIST } from "../../config/roles";
import AutocompleteInput from "../../components/common/AutocompleteInput";
import { Camera, Eye, EyeOff } from "lucide-react";

const AddCompanyUserForm = () => {
  const { profileUser, isDarkMode, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const capitalize = (s) =>
    s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const addUserTranslations = useMemo(
    () => appTranslations[language]?.["users.addUserForm"],
    [appTranslations, language]
  );

  const commonTranslation = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "",
    country:
      profileUser?.role === ROLES.ADMIN
        ? ""
        : profileUser?.country
        ? capitalize(profileUser.country)
        : "",
    city: "",
    profile_picture: null,
  });

  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profileUser?.role === ROLES.ADMIN) {
      axiosInstance
        .get("/api/utils/countries")
        .then((res) => setCountryOptions((res.data || []).map(capitalize)))
        .catch((err) => {});
    } else if (profileUser?.country) {
      setCountryOptions([capitalize(profileUser.country)]);
    }
  }, [profileUser]);

  useEffect(() => {
    if (formData.country) {
      axiosInstance
        .get(`/api/utils/cities?country=${formData.country.toLowerCase()}`)
        .then((res) => setCityOptions((res.data || []).map(capitalize)))
        .catch((err) => setCityOptions([]));
    } else {
      setCityOptions([]);
    }
  }, [formData.country]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_picture: reader.result })); // Base64 string
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCountryChange = (value) =>
    setFormData((prev) => ({ ...prev, country: value || "", city: "" }));
  const handleCityChange = (value) =>
    setFormData((prev) => ({ ...prev, city: value || "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.repeatPassword) {
      setError(addUserTranslations.passwordMismatchError);
      return;
    }
    if (!formData.role) {
      setError(addUserTranslations.roleRequiredError);
      return;
    }

    setIsSubmitting(true);
    const { repeatPassword, ...userData } = formData;
    try {
      await axiosInstance.post("/api/users", userData);
      navigate("/users/company");
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      setError(
        typeof errorDetail === "string"
          ? errorDetail
          : commonTranslation.genericError
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const companyRoles = ROLES_LIST.company || [];
  const availableRoles = isAdmin
    ? companyRoles
    : companyRoles.filter((role) => role !== ROLES.ADMIN);

  const formContainerClass = isDarkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-white";
  const labelClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const inputClass = `mt-1 block w-full p-2 border rounded-md shadow-sm transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title={addUserTranslations.title}
        subtitle={addUserTranslations.subtitle}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-lg shadow-lg ${formContainerClass}`}>
          <div className="flex flex-col items-center mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              {addUserTranslations.profilePictureLabel}
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className={`w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer transition-colors ${
                isDarkMode
                  ? "border-gray-600 hover:border-blue-500"
                  : "border-gray-300 hover:border-blue-500"
              }`}>
              {formData.profile_picture ? (
                <img
                  src={formData.profile_picture}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera
                  size={48}
                  className={isDarkMode ? "text-gray-500" : "text-gray-400"}
                />
              )}
            </div>
            <input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.nameLabel}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.surnameLabel}
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.emailLabel}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </div>
            <div className="relative">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.passwordLabel}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={`${inputClass} pr-10`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-7"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </span>
            </div>
            <div className="relative">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.repeatPasswordLabel}
              </label>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                className={`${inputClass} pr-10`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-7"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                {showRepeatPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </span>
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.roleLabel}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={inputClass}>
                <option value="" disabled>
                  {addUserTranslations.selectRole}
                </option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {appTranslations[language]?.roles[role]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.countryLabel}
              </label>
              <AutocompleteInput
                options={countryOptions}
                selected={formData.country}
                setSelected={handleCountryChange}
                disabled={!isAdmin}
                placeholder={commonTranslation.searchPlaceholder}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addUserTranslations.cityLabel}
              </label>
              <AutocompleteInput
                options={cityOptions}
                selected={formData.city}
                setSelected={handleCityChange}
                disabled={!formData.country}
                placeholder={commonTranslation.searchPlaceholder}
              />
            </div>
          </div>

          {error && (
            <p className="mt-6 text-center text-sm text-red-500 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-md text-sm font-medium bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              {commonTranslation.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting
                ? commonTranslation.saving
                : addUserTranslations.saveButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCompanyUserForm;
