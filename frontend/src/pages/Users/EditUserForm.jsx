// src/pages/Users/EditUserForm.js
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { mockStores } from "../../data/mockStores";
import { Camera, Eye, EyeOff } from "lucide-react";
import AccessDeniedPage from "../misc/AccessDeniedPage";

const EditUserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    profileUser,
    currentColors,
    appTranslations,
    language,
    users,
    setUsers,
  } = useAuth();
  const translations = appTranslations[language]?.users || {};

  const userToEdit = useMemo(
    () => users.find((user) => user.id === parseInt(userId, 10)),
    [users, userId]
  );

  const [formData, setFormData] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userToEdit) {
      setFormData({ ...userToEdit, repeatPassword: userToEdit.password });
    }
  }, [userToEdit]);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;
  const isAnalyst = profileUser?.role === ROLES.ANALYST;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;

  const countryOptions = useMemo(() => {
    if (isAdmin || (isEngineer && profileUser?.country === "Global")) {
      return [...new Set(mockStores.map((s) => s.country))]
        .map((c) => ({ value: c, label: c }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else if (
      isCountryChief ||
      isAnalyst ||
      (isEngineer && profileUser?.country !== "Global")
    ) {
      return [{ value: profileUser?.country, label: profileUser?.country }];
    }
    return [];
  }, [profileUser, isAdmin, isCountryChief, isAnalyst, isEngineer]);

  const cityOptions = useMemo(() => {
    if (formData?.country) {
      return [
        ...new Set(
          mockStores
            .filter((s) => s.country === formData.country)
            .map((s) => s.city)
        ),
      ]
        .map((c) => ({ value: c, label: c }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return [];
  }, [formData?.country]);

  const storeNameOptions = useMemo(() => {
    if (formData?.country && formData?.city) {
      return [
        ...new Set(
          mockStores
            .filter(
              (s) => s.country === formData.country && s.city === formData.city
            )
            .map((s) => s.name)
        ),
      ]
        .map((s) => ({ value: s, label: s }))
        .sort((a, b) => a.label.localeCompare(b.label));
    }
    return [];
  }, [formData?.country, formData?.city]);

  const roleOptions = [{ value: "Runner", label: "Runner" }];

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleProfilePictureClick = () => fileInputRef.current.click();
  const validateForm = () => {
    let errors = {};

    let isValid = true; // Gerekli alanları tanımla

    const requiredFields = [
      "name",

      "surname",

      "country",

      "city",

      "role",

      "email",

      "password",

      "repeatPassword",
    ]; // Gerekli alanların boş olup olmadığını kontrol et

    requiredFields.forEach((field) => {
      if (
        !formData[field] ||
        (typeof formData[field] === "string" && formData[field].trim() === "")
      ) {
        errors[field] =
          translations.requiredFieldWarning ||
          "This field cannot be left blank.";

        isValid = false;
      }
    }); // Şifrelerin eşleşip eşleşmediğini kontrol et

    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword =
        translations.passwordMismatch || "Passwords do not match.";

      isValid = false;
    } // E-posta formatını kontrol et

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email =
        translations.invalidEmail || "Please enter a valid email address.";

      isValid = false;
    }

    setFormErrors(errors);

    return isValid;
  };

  const handleSaveUser = () => {
    if (validateForm()) {
      const updatedUser = { ...formData };
      delete updatedUser.repeatPassword;
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      navigate("/users/supermarket");
    }
  };

  if (!userToEdit) {
    return <div>User not found...</div>;
  }
  if (!formData) {
    return <div>Loading...</div>;
  }

  if (!userToEdit || !formData) {
    return <AccessDeniedPage />;
  }

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: currentColors.pureWhite,
        color: currentColors.darkText,
      }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.editUserTitle || "Edit User"}: {formData.name}{" "}
        {formData.surname}
      </h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2 flex flex-col items-center mb-4">
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium mb-2">
            {translations.profilePictureLabel}
          </label>
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer"
            onClick={handleProfilePictureClick}>
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <Camera size={64} />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFormChange}
            name="profilePicture"
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {translations.employeeNameLabel}*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ""}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.name ? "border-red-500" : ""
            }`}
          />
        </div>
        <div>
          <label htmlFor="surname" className="block text-sm font-medium mb-1">
            {translations.employeeSurnameLabel}*
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname || ""}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.surname ? "border-red-500" : ""
            }`}
          />
        </div>
        <div>
          <label htmlFor="dob" className="block text-sm font-medium mb-1">
            {translations.dobLabel}*
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob || ""}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.dob ? "border-red-500" : ""
            }`}
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            {translations.countryLabel}*
          </label>
          <select
            id="country"
            name="country"
            value={formData.country || ""}
            onChange={handleFormChange}
            disabled={!isAdmin}
            className={`w-full p-2 border rounded-md ${
              formErrors.country ? "border-red-500" : ""
            }`}>
            <option value="">{translations.selectCountry}</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            {translations.cityLabel}*
          </label>
          <select
            id="city"
            name="city"
            value={formData.city || ""}
            onChange={handleFormChange}
            disabled={!formData.country}
            className={`w-full p-2 border rounded-md ${
              formErrors.city ? "border-red-500" : ""
            }`}>
            <option value="">{translations.selectCity}</option>
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="storeName" className="block text-sm font-medium mb-1">
            {translations.storeNameLabel}*
          </label>
          <select
            id="storeName"
            name="storeName"
            value={formData.storeName || ""}
            onChange={handleFormChange}
            disabled={!formData.city}
            className={`w-full p-2 border rounded-md ${
              formErrors.storeName ? "border-red-500" : ""
            }`}>
            <option value="">{translations.selectStore}</option>
            {storeNameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            {translations.roleLabel}*
          </label>
          <select
            id="role"
            name="role"
            value={formData.role || ""}
            readOnly
            className={`w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed`}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {translations.mailLabel}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.email ? "border-red-500" : ""
            }`}
          />
        </div>
        <div className="relative">
          <label htmlFor="password">{translations.passwordLabel}*</label>
          <div
            className={`flex items-center rounded-md border ${
              formErrors.password ? "border-red-500" : ""
            }`}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password || ""}
              onChange={handleFormChange}
              className="w-full p-2 focus:outline-none bg-transparent"
            />
            <span
              className="p-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>
        <div className="relative">
          <label htmlFor="repeatPassword">
            {translations.repeatPasswordLabel}*
          </label>
          <div
            className={`flex items-center rounded-md border ${
              formErrors.repeatPassword ? "border-red-500" : ""
            }`}>
            <input
              type={showRepeatPassword ? "text" : "password"}
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword || ""}
              onChange={handleFormChange}
              className="w-full p-2 focus:outline-none bg-transparent"
            />
            <span
              className="p-2 cursor-pointer"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
              {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
        </div>
      </form>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => navigate("/users/supermarket")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md">
          {translations.discardButton || "Discard Changes"}
        </button>
        <button
          type="button"
          onClick={handleSaveUser}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
          {translations.saveChangesButton || "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditUserForm;
