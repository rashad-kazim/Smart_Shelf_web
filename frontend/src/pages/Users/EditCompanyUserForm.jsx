// src/pages/Users/EditCompanyUserForm.js
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { mockStores } from "../../data/mockStores";
import { Camera, Eye, EyeOff } from "lucide-react";
import AccessDeniedPage from "../misc/AccessDeniedPage";

const EditCompanyUserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    profileUser,
    currentColors: colors,
    appTranslations,
    language,
    companyUsers,
    setCompanyUsers,
  } = useAuth();
  const translations = appTranslations[language]?.users || {};

  const userToEdit = useMemo(
    () => companyUsers.find((user) => user.id === parseInt(userId, 10)),
    [companyUsers, userId]
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

  const countryOptions = useMemo(() => {
    if (isAdmin) {
      return [...new Set(mockStores.map((s) => s.country))]
        .map((c) => ({ value: c, label: c }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else if (isCountryChief) {
      return [{ value: profileUser?.country, label: profileUser?.country }];
    }
    return [];
  }, [profileUser, isAdmin, isCountryChief]);

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

  const roleOptions = useMemo(() => {
    if (isAdmin) {
      return [
        { value: ROLES.COUNTRY_CHIEF, label: "Country Chief" },
        { value: ROLES.ANALYST, label: "Analyst" },
        { value: ROLES.ENGINEER, label: "Engineer" },
      ];
    } else if (isCountryChief) {
      return [
        { value: ROLES.ANALYST, label: "Analyst" },
        { value: ROLES.ENGINEER, label: "Engineer" },
      ];
    }
    return [];
  }, [isAdmin, isCountryChief]);

  useEffect(() => {
    if (userToEdit) {
      setFormData({ ...userToEdit, repeatPassword: userToEdit.password });
    }
  }, [userToEdit]);

  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };
  if (!userToEdit) {
    return <div>User not found...</div>;
  }
  if (
    !isAdmin &&
    isCountryChief &&
    userToEdit.country !== profileUser.country
  ) {
    return <AccessDeniedPage />;
  }

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePictureClick = () => fileInputRef.current.click();
  const validateForm = () => {
    let errors = {};
    let isValid = true;
    const requiredFields = [
      "name",
      "surname",
      "country",
      "city",
      "role",
      "email",
      "password",
      "repeatPassword",
    ];

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
    });

    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword =
        translations.passwordMismatch || "Passwords do not match.";
      isValid = false;
    }

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
      setCompanyUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
      navigate("/users/company");
    }
  };
  if (!userToEdit) {
    return <AccessDeniedPage />;
  }
  if (
    !isAdmin &&
    isCountryChief &&
    userToEdit.country !== profileUser.country
  ) {
    return <AccessDeniedPage />;
  }

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: colors.pureWhite,
        color: colors.darkText,
      }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.editCompanyUserTitle || "Edit Company User"}:{" "}
        {formData.name} {formData.surname}
      </h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div className="md:col-span-2 flex flex-col items-center mb-4">
          <label htmlFor="profilePicture">
            {translations.profilePictureLabel}
          </label>
          <div
            onClick={handleProfilePictureClick}
            className="w-32 h-32 rounded-full border-2 cursor-pointer flex items-center justify-center">
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
          />
        </div>
        <div>
          <label htmlFor="name">{translations.employeeNameLabel}*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.name ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
        </div>
        <div>
          <label htmlFor="surname">{translations.employeeSurnameLabel}*</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.surname ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
        </div>
        <div>
          <label htmlFor="role">{translations.roleLabel}*</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.role ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}>
            {roleOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="country">{translations.countryLabel}*</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            disabled={!isAdmin}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.country ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}>
            {countryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="city">{translations.cityLabel}</label>
          <select
            id="city"
            name="city"
            value={formData.city}
            disabled={!formData.country}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.city ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}>
            <option value="">{translations.selectCity}</option>
            {cityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="email">{translations.mailLabel}*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.email ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
        </div>
        <div className="relative">
          <label htmlFor="password">{translations.passwordLabel}*</label>
          <div className="flex items-center">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.password ? "border-red-500" : ""
              }`}
              style={{
                ...inputStyle,
                borderColor: formErrors.name
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
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
          <div className="flex items-center">
            <input
              type={showRepeatPassword ? "text" : "password"}
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.repeatPassword ? "border-red-500" : ""
              }`}
              style={{
                ...inputStyle,
                borderColor: formErrors.name
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
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
          onClick={() => navigate("/users/company")}
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

export default EditCompanyUserForm;
