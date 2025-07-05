// src/pages/Users/EditSupermarketUserForm.jsx

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import { Camera, Eye, EyeOff } from "lucide-react";
import GlobalLoader from "../../components/common/GlobalLoader";

const EditSupermarketUserForm = () => {
  const { isDarkMode, appTranslations, language } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Çeviri nesneleri
  const translations = useMemo(
    () => appTranslations[language]?.["users.editUserForm"],
    [appTranslations, language]
  );

  const pageTranslations = useMemo(
    () => appTranslations[language]?.["users.addUserForm"],
    [appTranslations, language]
  );

  const addSuperMTranslations = useMemo(
    () => appTranslations[language]?.["users.addSupermarketUserForm"],
    [appTranslations, language]
  );

  const labelTranslations = useMemo(
    () => appTranslations[language]?.profile,
    [appTranslations, language]
  );

  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  // State'ler
  const [formData, setFormData] = useState(null); // Başlangıçta null, veri çekilene kadar
  const [stores, setStores] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const fileInputRef = useRef(null);

  // Sayfa yüklendiğinde, hem kullanıcıyı hem de mağazaları çek
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userPromise = axiosInstance.get(`/api/users/${userId}`);
        const storesPromise = axiosInstance.get("/api/stores");

        const [userResponse, storesResponse] = await Promise.all([
          userPromise,
          storesPromise,
        ]);

        setFormData({
          name: userResponse.data.name || "",
          surname: userResponse.data.surname || "",
          email: userResponse.data.email || "",
          role: userResponse.data.role || "",
          assigned_store_id: userResponse.data.assigned_store_id || "",
          profile_picture: userResponse.data.profile_picture || null,
          password: "", // Şifre alanları her zaman boş başlar
          repeatPassword: "",
        });
        setStores(storesResponse.data || []);
      } catch (err) {
        setError(commonTranslations.couldNotLoadData);
      }
    };
    fetchInitialData();
  }, [userId, commonTranslations.couldNotLoadData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_picture" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profile_picture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Yeni şifre girilmişse, eşleşip eşleşmediklerini kontrol et
    if (formData.password && formData.password !== formData.repeatPassword) {
      setError(translations.passwordMismatchError);
      return;
    }

    setIsSubmitting(true);

    const { repeatPassword, ...userData } = formData;
    // Eğer şifre alanı boşsa, backend'e bu alanı hiç gönderme
    if (!userData.password) {
      delete userData.password;
    }

    try {
      await axiosInstance.put(`/api/users/${userId}`, userData);
      navigate("/users/supermarket");
    } catch (err) {
      let errorMessage = translations.genericError;
      const errorDetail = err.response?.data?.detail;
      if (typeof errorDetail === "string") {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail) && errorDetail.length > 0) {
        errorMessage = errorDetail[0].msg;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Veri yüklenene kadar loader göster
  if (!formData) {
    return <GlobalLoader />;
  }

  const formContainerClass = isDarkMode
    ? "bg-gray-800 border border-gray-700"
    : "bg-white";
  const labelClass = isDarkMode ? "text-gray-300" : "text-gray-700";
  const inputClass = `w-full p-2 border rounded-md shadow-sm transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;

  return (
    <div className="p-4 sm:p-6">
      <PageHeader
        title={translations.titleSupermarket}
        subtitle={`${translations.subtitlePrefix} ${formData.name} ${formData.surname}`}
      />
      <div className="max-w-2xl mx-auto mt-6">
        <form
          onSubmit={handleSubmit}
          className={`p-8 rounded-lg shadow-lg ${formContainerClass}`}>
          <div className="flex flex-col items-center mb-6">
            <label className={`block text-sm font-medium mb-2 ${labelClass}`}>
              {pageTranslations.profilePictureLabel}
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
                {pageTranslations.nameLabel}
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
                {pageTranslations.surnameLabel}
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
                {pageTranslations.emailLabel}
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
              {translations.changePasswordTitle}
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
                {labelTranslations.newPasswordLabel}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-6"
                onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </span>
            </div>
            <div className="relative ">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {labelTranslations.repeatPasswordLabel}
              </label>
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                className={`${inputClass} pr-10`}
              />
              <span
                className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-6"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
                {showRepeatPassword ? (
                  <EyeOff size={18} className="text-gray-400" />
                ) : (
                  <Eye size={18} className="text-gray-400" />
                )}
              </span>
            </div>

            <div className="md:col-span-2">
              <label className={`block text-sm font-medium ${labelClass}`}>
                {addSuperMTranslations.assignStoreLabel}
              </label>
              <select
                name="assigned_store_id"
                value={formData.assigned_store_id}
                onChange={handleChange}
                required
                className={`${inputClass} cursor-pointer`}>
                <option value="" disabled>
                  {addSuperMTranslations.selectStore}
                </option>
                {stores.map((store) => (
                  <option
                    key={store.id}
                    value={store.id}
                    className={`cursor-pointer`}>
                    {`${store.name} (${store.city}, ${store.country})`}
                  </option>
                ))}
              </select>
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
              {commonTranslations.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
              {isSubmitting
                ? commonTranslations.saving
                : labelTranslations.saveButton}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSupermarketUserForm;
