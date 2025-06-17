// ProfileDetailsPage.js
// Profile details page
// src/pages/Profile/ProfileDetailsPage.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Camera } from "lucide-react";

const ProfileDetailsPage = () => {
  const {
    profileUser,
    setProfileUser,
    currentColors,
    appTranslations,
    language,
  } = useAuth();
  const navigate = useNavigate();
  const translations = appTranslations[language]?.users || {};

  const [formData, setFormData] = useState(profileUser || {});
  const [formErrors] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(profileUser || {});
  }, [profileUser]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profilePicture" && files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePicture: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = () => {
    // Basit bir doğrulama
    if (formData.name && formData.surname) {
      setProfileUser(formData);
      navigate("/"); // Kaydettikten sonra anasayfaya yönlendir
    } else {
      alert("Name and surname are required.");
    }
  };

  if (!profileUser) {
    return <div>Loading profile...</div>;
  }

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{
        backgroundColor: currentColors.pureWhite,
        color: currentColors.darkText,
      }}>
      <h1 className="text-3xl font-semibold mb-6 text-center">
        {translations.profileDetailsTitle || "Profile Details"}
      </h1>

      <div className="flex flex-col items-center mb-6">
        <div
          onClick={handleProfilePictureClick}
          className="w-32 h-32 rounded-full overflow-hidden border-2 flex items-center justify-center cursor-pointer"
          style={{ borderColor: currentColors.mediumGrayText }}>
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
          ref={fileInputRef}
          name="profilePicture"
          accept="image/*"
          onChange={handleFormChange}
          className="hidden"
        />
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 max-w-2xl mx-auto">
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
            className={`w-full p-2 rounded-md border ${
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
            className={`w-full p-2 rounded-md border ${
              formErrors.surname ? "border-red-500" : ""
            }`}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            {translations.mailLabel}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email || ""}
            readOnly
            className="w-full p-2 rounded-md border bg-gray-100 cursor-not-allowed"
            style={{
              backgroundColor: currentColors.lightGrayBg,
              color: currentColors.mediumGrayText,
            }}
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium mb-1">
            {translations.roleLabel}
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role || ""}
            readOnly
            className="w-full p-2 rounded-md border bg-gray-100 cursor-not-allowed"
            style={{
              backgroundColor: currentColors.lightGrayBg,
              color: currentColors.mediumGrayText,
            }}
          />
        </div>
      </form>

      <div className="flex justify-center space-x-4 mt-8">
        <button
          onClick={() => navigate("/")}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: currentColors.prevButtonBg }}>
          {translations.discardChangesButton || "Discard"}
        </button>
        <button
          onClick={handleSave}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: currentColors.logoPrimaryBlue }}>
          {translations.saveButton || "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileDetailsPage;
