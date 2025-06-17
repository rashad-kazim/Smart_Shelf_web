// AddUserForm.js
// Add user form
// src/pages/Users/AddUserForm.js
import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../config/roles";
import { mockStores } from "../../data/mockStores";
import { Camera, Eye, EyeOff } from "lucide-react";

const AddUserForm = () => {
  const {
    profileUser,
    currentColors,
    appTranslations,
    language,
    users,
    setUsers,
  } = useAuth();
  const navigate = useNavigate();
  const translations = appTranslations[language]?.users || {};

  const fileInputRef = useRef(null);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;

  const initialCountry =
    isAdmin || (isEngineer && profileUser?.country === "Global")
      ? ""
      : profileUser?.country || "";

  const [formData, setFormData] = useState({
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name: "",
    surname: "",
    dob: "",
    country: initialCountry,
    city: "",
    storeName: "",
    addBranch: false,
    branch: "",
    role: ROLES.RUNNER,
    email: "",
    password: "",
    repeatPassword: "",
    profilePicture: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  // Form select options
  const countryOptions = useMemo(() => {
    if (isAdmin || (isEngineer && profileUser?.country === "Global")) {
      return [...new Set(mockStores.map((s) => s.country))]
        .map((c) => ({ value: c, label: c }))
        .sort((a, b) => a.label.localeCompare(b.label));
    } else if (isCountryChief || isEngineer) {
      return [{ value: profileUser?.country, label: profileUser?.country }];
    }
    return [];
  }, [profileUser, isAdmin, isCountryChief, isEngineer]);

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

  const storeNameOptions = useMemo(() => {
    if (formData.country && formData.city) {
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
  }, [formData.country, formData.city]);

  const roleOptions = [{ value: "Runner", label: "Runner" }];

  const handleFormChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const validateForm = () => {
    let errors = {};
    let isValid = true;

    const requiredFields = [
      "name",
      "surname",
      "dob",
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
        errors[field] = translations.requiredFieldWarning;
        isValid = false;
      }
    });

    if (formData.password !== formData.repeatPassword) {
      errors.repeatPassword = translations.passwordMismatch;
      isValid = false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = translations.invalidEmail;
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSaveUser = () => {
    if (validateForm()) {
      const newUser = { ...formData };
      delete newUser.repeatPassword;
      setUsers((prevUsers) => [...prevUsers, newUser]);
      console.log("New User Saved:", newUser);
      navigate("/users/supermarket");
    }
  };

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: currentColors.pureWhite,
        color: currentColors.darkText,
      }}>
      <h1 className="text-3xl font-semibold mb-6">
        {translations.addNewUserTitle || "Add New User"}
      </h1>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {/* Profile Picture Upload */}
        <div className="md:col-span-2 flex flex-col items-center mb-4">
          <label
            htmlFor="profilePicture"
            className="block text-sm font-medium mb-2"
            style={{ color: currentColors.darkText }}>
            {translations.profilePictureLabel}
          </label>
          <div
            className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300 flex items-center justify-center mb-3 cursor-pointer hover:border-blue-500 transition-colors duration-200"
            style={{ borderColor: currentColors.mediumGrayText }}
            onClick={handleProfilePictureClick}>
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera size={64} color={currentColors.mediumGrayText} />
            )}
          </div>
          <input
            type="file"
            id="profilePicture"
            name="profilePicture"
            accept="image/*"
            onChange={handleFormChange}
            ref={fileInputRef} // Assign ref
            className="hidden" // Hide the default file input
          />
          {formErrors.profilePicture && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.profilePicture}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.employeeNameLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.name ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
          />
          {formErrors.name && (
            <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="surname"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.employeeSurnameLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.surname ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
          />
          {formErrors.surname && (
            <p className="text-red-500 text-xs mt-1">{formErrors.surname}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="dob"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.dobLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.dob ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
          />
          {formErrors.dob && (
            <p className="text-red-500 text-xs mt-1">{formErrors.dob}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.countryLabel} <span className="text-red-500">*</span>
          </label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.country ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
            disabled={
              !isAdmin && !(isEngineer && profileUser?.country === "Global")
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
          <label
            htmlFor="city"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.cityLabel} <span className="text-red-500">*</span>
          </label>
          <select
            id="city"
            name="city"
            value={formData.city}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.city ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
            disabled={!formData.country}>
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
          <label
            htmlFor="storeName"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.storeNameLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <select
            id="storeName"
            name="storeName"
            value={formData.storeName}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.storeName ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
            disabled={!formData.country || !formData.city}>
            <option value="">{translations.selectStore}</option>
            {storeNameOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {formErrors.storeName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.storeName}</p>
          )}
        </div>
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={formData.addBranch}
            onChange={handleFormChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            style={{ borderColor: currentColors.mediumGrayText }}
          />
          <label
            htmlFor="addBranch"
            className="text-sm"
            style={{ color: currentColors.darkText }}>
            {translations.addBranchLabel}
          </label>
        </div>
        {formData.addBranch && (
          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium mb-1"
              style={{ color: currentColors.darkText }}>
              {translations.branchLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="branch"
              name="branch"
              value={formData.branch}
              onChange={handleFormChange}
              className={`w-full p-2 rounded-md border ${
                formErrors.branch ? "border-red-500" : "border-gray-300"
              }`}
              style={{
                backgroundColor: currentColors.pureWhite,
                color: currentColors.darkText,
              }}
            />
            {formErrors.branch && (
              <p className="text-red-500 text-xs mt-1">{formErrors.branch}</p>
            )}
          </div>
        )}
        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.roleLabel} <span className="text-red-500">*</span>
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.role ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
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
          <label
            htmlFor="email"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.mailLabel} <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            className={`w-full p-2 rounded-md border ${
              formErrors.email ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        <div className="relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.passwordLabel} <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center rounded-md border ${
              formErrors.password ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="w-full p-2 focus:outline-none focus:ring-0 bg-transparent"
              style={{ color: currentColors.darkText }}
            />
            <span
              className="p-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
              style={{ color: currentColors.mediumGrayText }}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
          )}
        </div>
        <div className="relative">
          <label
            htmlFor="repeatPassword"
            className="block text-sm font-medium mb-1"
            style={{ color: currentColors.darkText }}>
            {translations.repeatPasswordLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <div
            className={`flex items-center rounded-md border ${
              formErrors.repeatPassword ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              backgroundColor: currentColors.pureWhite,
              color: currentColors.darkText,
            }}>
            <input
              type={showRepeatPassword ? "text" : "password"}
              id="repeatPassword"
              name="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleFormChange}
              className="w-full p-2 focus:outline-none focus:ring-0 bg-transparent"
              style={{ color: currentColors.darkText }}
            />
            <span
              className="p-2 cursor-pointer"
              onClick={() => setShowRepeatPassword(!showRepeatPassword)}
              style={{ color: currentColors.mediumGrayText }}>
              {showRepeatPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>
          {formErrors.repeatPassword && (
            <p className="text-red-500 text-xs mt-1">
              {formErrors.repeatPassword}
            </p>
          )}
        </div>
      </form>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/users/supermarket")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md">
          {translations.removeProcessButton || "Cancel"}
        </button>
        <button
          onClick={handleSaveUser}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
          {translations.saveButton || "Save"}
        </button>
      </div>
    </div>
  );
};

export default AddUserForm;
