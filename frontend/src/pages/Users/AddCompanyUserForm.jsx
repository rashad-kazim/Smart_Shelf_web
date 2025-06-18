// src/pages/Users/AddCompanyUserForm.js
// src/pages/Users/AddCompanyUserForm.js
import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { mockStores } from "../../data/mockStores";
import { Camera, Eye, EyeOff } from "lucide-react";

const AddCompanyUserForm = () => {
  // 1. DÜZELTME: Gerekli tüm global verileri ve fonksiyonları useAuth'dan alıyoruz
  const {
    profileUser,
    currentColors: colors,
    appTranslations,
    language,
    companyUsers,
    setCompanyUsers,
  } = useAuth();
  const navigate = useNavigate();

  // 2. DÜZELTME: Çeviri nesnesini doğru şekilde oluşturuyoruz
  const translations = appTranslations[language]?.users || {};
  const fileInputRef = useRef(null);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;

  const initialCountry = isAdmin ? "" : profileUser?.country || "";

  // 3. DÜZELTME: ID'yi ve rolü doğru şekilde başlatıyoruz
  const [formData, setFormData] = useState({
    id:
      companyUsers.length > 0
        ? Math.max(...companyUsers.map((u) => u.id)) + 1
        : 101,
    name: "",
    surname: "",
    dob: "",
    country: initialCountry,
    city: "",
    role: isCountryChief ? ROLES.ANALYST : ROLES.COUNTRY_CHIEF,
    email: "",
    password: "",
    repeatPassword: "",
    profilePicture: null,
  });

  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

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
    if (formData.country) {
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
  }, [formData.country]);

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
    let isValid = true;

    // Gerekli alanları tanımla
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

    // Gerekli alanların boş olup olmadığını kontrol et
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

    // Şifrelerin eşleşip eşleşmediğini kontrol et
    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword =
        translations.passwordMismatch || "Passwords do not match.";
      isValid = false;
    }

    // E-posta formatını kontrol et
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
      const newUser = { ...formData };
      delete newUser.repeatPassword;
      setCompanyUsers((prev) => [...prev, newUser]);
      navigate("/users/company");
    }
  };

  // Define styles for the form inputs
  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };

  const disabledInputStyle = {
    backgroundColor: colors.lightGrayBg,
    color: colors.mediumGrayText,
    borderColor: colors.mediumGrayText,
    cursor: "not-allowed",
  };

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.addCompanyUserTitle || "Add New Company User"}
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
            onClick={handleProfilePictureClick}
            style={{ borderColor: colors.mediumGrayText }}>
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={64} color={colors.mediumGrayText} />
            )}
          </div>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleFormChange}
            ref={fileInputRef}
            className="hidden"
          />
          {formErrors.profilePicture && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.profilePicture}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            {translations.employeeNameLabel}*
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.name ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.name
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="surname" className="block text-sm font-medium mb-1">
            {translations.employeeSurnameLabel}*
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.surname ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.surname
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          {formErrors.surname && (
            <p className="text-red-500 text-xs mt-1">{formErrors.surname}</p>
          )}
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium mb-1">
            {translations.countryLabel}*
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleFormChange}
            disabled={isCountryChief}
            className={`w-full p-2 rounded-md border ${
              formErrors.country ? "border-red-500" : ""
            }`}
            style={
              isCountryChief
                ? disabledInputStyle
                : {
                    ...inputStyle,
                    borderColor: formErrors.country
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }
            }>
            <option value="">{translations.selectCountry}</option>
            {countryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formErrors.country && (
            <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-medium mb-1">
            {translations.cityLabel}
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleFormChange}
            disabled={!formData.country}
            className={`w-full p-2 rounded-md border ${
              formErrors.city ? "border-red-500" : ""
            }`}
            style={
              !formData.country
                ? disabledInputStyle
                : {
                    ...inputStyle,
                    borderColor: formErrors.city
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }
            }>
            <option value="">{translations.selectCity}</option>
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formErrors.city && (
            <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
          )}
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            {translations.roleLabel}*
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.role ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.role
                ? colors.errorRed
                : colors.mediumGrayText,
            }}>
            <option value="">{translations.selectRole}</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formErrors.role && (
            <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {translations.mailLabel}*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.email ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.email
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        <div className="relative">
          <label htmlFor="password">{translations.passwordLabel}*</label>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleFormChange}
            className={`w-full p-2 pr-10 border rounded-md ${
              formErrors.password ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.password
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-7"
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
              <EyeOff size={18} color={colors.mediumGrayText} />
            ) : (
              <Eye size={18} color={colors.mediumGrayText} />
            )}
          </span>
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>
        <div className="relative">
          <label htmlFor="repeatPassword">
            {translations.repeatPasswordLabel}*
          </label>
          <input
            type={showRepeatPassword ? "text" : "password"}
            id="repeatPassword"
            name="repeatPassword"
            value={formData.repeatPassword}
            onChange={handleFormChange}
            className={`w-full p-2 pr-10 border rounded-md ${
              formErrors.repeatPassword ? "border-red-500" : ""
            }`}
            style={{
              ...inputStyle,
              borderColor: formErrors.repeatPassword
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          <span
            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer top-7"
            onClick={() => setShowRepeatPassword(!showRepeatPassword)}>
            {showRepeatPassword ? (
              <EyeOff size={18} color={colors.mediumGrayText} />
            ) : (
              <Eye size={18} color={colors.mediumGrayText} />
            )}
          </span>
          {formErrors.repeatPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.repeatPassword}
            </p>
          )}
        </div>
      </form>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={() => navigate("/users/company")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md"
          style={{ backgroundColor: colors.prevButtonBg }}>
          {translations.removeProcessButton || "Cancel"}
        </button>
        <button
          type="button"
          onClick={handleSaveUser}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md"
          style={{ backgroundColor: colors.logoPrimaryBlue }}>
          {translations.saveButton || "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddCompanyUserForm;
