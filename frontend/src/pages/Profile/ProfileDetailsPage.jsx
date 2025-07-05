// src/pages/Profile/ProfileDetailsPage.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { Camera, Eye, EyeOff } from "lucide-react";
import PageHeader from "../../components/common/PageHeader";
import axiosInstance from "../../api/axiosInstance";
import GlobalLoader from "../../components/common/GlobalLoader";

const ProfileDetailsPage = () => {
  const { profileUser, isDarkMode, appTranslations, language, setProfileUser } =
    useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.profile,
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (profileUser) {
      setFormData({
        name: profileUser.name || "",
        surname: profileUser.surname || "",
        email: profileUser.email || "",
        profile_picture: profileUser.profile_picture || null,
        password: "",
        repeatPassword: "",
      });
    }
  }, [profileUser]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Clear error and success messages
    setError("");
    setSuccess("");

    if (name === "profile_picture" && files && files[0]) {
      const file = files[0];

      // File size check (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError(translations.profilePictureSizeError);
        return;
      }

      // File type check
      if (!file.type.startsWith("image/")) {
        setError(translations.profilePictureTypeError);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_picture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Form validation function
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError(translations.nameRequired);
      return false;
    }

    if (!formData.surname.trim()) {
      setError(translations.surnameRequired);
      return false;
    }

    if (!formData.email.trim()) {
      setError(translations.emailRequired);
      return false;
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(translations.invalidEmail);
      return false;
    }

    // Password check - if password is entered
    if (formData.password || formData.repeatPassword) {
      if (formData.password !== formData.repeatPassword) {
        setError(translations.passwordMismatchError);
        return false;
      }

      if (formData.password.length < 6) {
        setError(translations.passwordLengthError);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare payload
      const payload = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        email: formData.email.trim(),
      };

      // Add profile picture if exists
      if (
        formData.profile_picture &&
        formData.profile_picture !== profileUser.profile_picture
      ) {
        payload.profile_picture = formData.profile_picture;
      }

      // Add password if changed
      if (formData.password && formData.password.length > 0) {
        payload.password = formData.password;
      }

      const userId = profileUser?.id;

      if (!userId) {
        throw new Error("User ID not found.");
      }

      await axiosInstance.put(`/api/users/${userId}`, payload);

      // Fetch updated user data and update context
      const updatedUserResponse = await axiosInstance.get("/api/users/me");
      const updatedUserData = updatedUserResponse.data;

      // Update profileUser in AuthContext
      // This ensures updated data is shown throughout the app
      setProfileUser(updatedUserData);

      // Also update form data (except password fields)
      setFormData((prev) => ({
        ...prev,
        name: updatedUserData.name || "",
        surname: updatedUserData.surname || "",
        email: updatedUserData.email || "",
        profile_picture: updatedUserData.profile_picture || null,
        password: "", // Clear password field
        repeatPassword: "", // Clear repeat password field
      }));

      setSuccess(translations.updateSuccess);

      // Redirect after 2 seconds (optional)
      // setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      let errorMessage = translations.updateError;

      if (err.response?.status === 422) {
        errorMessage = translations.updateInvalidDataError;
      } else if (err.response?.status === 401) {
        errorMessage = translations.sessionExpiredError;
      } else if (err.response?.status === 403) {
        errorMessage = translations.permissionError;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!profileUser || !formData) {
    return <GlobalLoader />;
  }

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
      <PageHeader title={translations.detailsTitle} />
      <div className="max-w-2xl mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-lg shadow-lg ${formContainerClass}`}>
          <div className="flex flex-col items-center mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              {translations.profilePictureLabel}
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
                  alt="Profile"
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
                {translations.nameLabel}
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
                {translations.surnameLabel}
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
                {translations.emailLabel}
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

            <div
              className="md:col-span-2 my-4 border-t"
              style={{
                borderColor: isDarkMode
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.1)",
              }}></div>

            <h4
              className={`md:col-span-2 text-lg font-semibold mb-0 -mt-4 ${labelClass}`}>
              {translations.changePasswordTitle}
              <span
                className={`block text-xs font-normal mt-1 ${
                  isDarkMode ? "text-gray-400" : "text-gray-500"
                }`}>
                ({translations.changePasswordSubtitle})
              </span>
            </h4>

            <div className="relative">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {translations.newPasswordLabel}
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
                {translations.repeatPasswordLabel}
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
          {success && (
            <p className="mt-6 text-center text-sm text-green-500 dark:text-green-400">
              {success}
            </p>
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting
                ? commonTranslations.saving
                : translations.saveButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
