import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { ROLES, ROLES_LIST } from "../../config/roles";
import AutocompleteInput from "../../components/common/AutocompleteInput";
import GlobalLoader from "../../components/common/GlobalLoader";
import { Eye, EyeOff } from "lucide-react";

const EditCompanyUserForm = () => {
  const { profileUser, isDarkMode, appTranslations, language } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const capitalize = (s) =>
    s && typeof s === "string" ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const translations = useMemo(
    () => appTranslations[language]?.users?.editUserForm || {},
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common || {},
    [appTranslations, language]
  );

  useEffect(() => {
    axiosInstance
      .get(`/api/users/${userId}`)
      .then((res) => {
        setFormData({
          name: res.data.name || "",
          surname: res.data.surname || "",
          email: res.data.email || "",
          role: res.data.role || "",
          country: res.data.country ? capitalize(res.data.country) : "",
          city: res.data.city ? capitalize(res.data.city) : "",
          password: "",
          repeatPassword: "",
        });
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setError("Could not load user data. The user may not exist.");
      });
  }, [userId]);

  useEffect(() => {
    if (profileUser?.role === ROLES.ADMIN) {
      axiosInstance
        .get("/api/utils/countries")
        .then((res) => setCountryOptions((res.data || []).map(capitalize)))
        .catch((err) => console.error("Failed to fetch countries", err));
    } else if (profileUser?.country) {
      setCountryOptions([capitalize(profileUser.country)]);
    }
  }, [profileUser]);

  useEffect(() => {
    if (formData?.country) {
      axiosInstance
        .get(`/api/utils/cities?country=${formData.country.toLowerCase()}`)
        .then((res) => setCityOptions((res.data || []).map(capitalize)))
        .catch((err) => setCityOptions([]));
    } else {
      setCityOptions([]);
    }
  }, [formData?.country]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value) =>
    setFormData((prev) => ({ ...prev, country: value || "", city: "" }));
  const handleCityChange = (value) =>
    setFormData((prev) => ({ ...prev, city: value || "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password && formData.password !== formData.repeatPassword) {
      setError(translations.passwordMismatchError || "Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    const { repeatPassword, ...userData } = formData;
    if (!userData.password) {
      delete userData.password;
    }

    try {
      await axiosInstance.put(`/api/users/${userId}`, userData);
      navigate("/users/company");
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      setError(
        typeof errorDetail === "string"
          ? errorDetail
          : translations.genericError || "An error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!formData) {
    return <GlobalLoader />;
  }

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
        title={translations.title || "Edit User"}
        subtitle={`${translations.subtitlePrefix || "Update the details for"} ${
          formData.name
        } ${formData.surname}`}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-lg shadow-lg ${formContainerClass}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.nameLabel || "Name"}
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
                {translations.surnameLabel || "Surname"}
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
                {translations.emailLabel || "Email"}
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
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.roleLabel || "Role"}
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className={inputClass}>
                <option value="" disabled>
                  {translations.selectRole || "Select a role"}
                </option>
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.countryLabel || "Country"}
              </label>
              <AutocompleteInput
                options={countryOptions}
                selected={formData.country}
                setSelected={handleCountryChange}
                disabled={!isAdmin}
                placeholder={translations.countryPlaceholder || "Search..."}
              />
            </div>
            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.cityLabel || "City"}
              </label>
              <AutocompleteInput
                options={cityOptions}
                selected={formData.city}
                setSelected={handleCityChange}
                disabled={!formData.country}
                placeholder={translations.cityPlaceholder || "Search..."}
              />
            </div>

            <div className="md:col-span-2 my-4">
              <div
                className="w-full border-t"
                style={{
                  borderColor: isDarkMode
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                }}></div>
            </div>

            <h4
              className={`md:col-span-2 text-lg font-semibold mb-0 -mt-4 ${labelClass}`}>
              {translations.changePasswordTitle || "Change Password"}
              <span
                className={`block text-xs font-normal mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                (
                {translations.changePasswordSubtitle ||
                  "Leave blank to keep current password"}
                )
              </span>
            </h4>

            <div className="relative">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.newPasswordLabel || "New Password"}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
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
                {translations.repeatPasswordLabel || "Repeat New Password"}
              </label>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
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
              {commonTranslations.cancel || "Cancel"}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting
                ? commonTranslations.saving || "Saving..."
                : translations.saveButton || "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCompanyUserForm;
