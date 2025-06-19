// src/pages/Stores/StoreEditingStep1.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

const StoreEditingStep1 = ({
  editableStoreForm,
  formErrors,
  handleStoreFormChange,
  handleStoreInfoNext,
  countryOptions,
  citiesOptions,
  timeOptions,
  colors,
  translations,
  isCountrySelectDisabled,
}) => {
  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };
  const disabledInputStyle = {
    backgroundColor: colors.lightGrayBg,
    color: colors.mediumGrayText,
    cursor: "not-allowed",
    borderColor: colors.mediumGrayText,
  };

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2
        className="text-xl font-semibold mb-6 text-center"
        style={{ color: colors.darkText }}>
        {translations.editStoreDetailsStep1Title || "Store Information"}
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <label htmlFor="country" className="block text-sm font-bold mb-1">
            {translations.countryLabel}*
          </label>
          <div className="relative">
            <select
              id="country"
              name="country"
              value={editableStoreForm.country}
              onChange={handleStoreFormChange}
              disabled={isCountrySelectDisabled}
              className={`w-full p-2 border rounded-md appearance-none`}
              style={
                isCountrySelectDisabled
                  ? disabledInputStyle
                  : {
                      ...inputStyle,
                      borderColor: formErrors.country
                        ? colors.errorRed
                        : colors.mediumGrayText,
                    }
              }>
              <option value="">
                {translations.selectCountry || "Select Country"}
              </option>
              {countryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
          {formErrors.country && (
            <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
          )}
        </div>
        <div>
          <label htmlFor="city" className="block text-sm font-bold mb-1">
            {translations.cityLabel}*
          </label>
          <div className="relative">
            <select
              id="city"
              name="city"
              value={editableStoreForm.city}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md appearance-none`}
              disabled={!editableStoreForm.country}
              style={
                !editableStoreForm.country
                  ? disabledInputStyle
                  : {
                      ...inputStyle,
                      borderColor: formErrors.city
                        ? colors.errorRed
                        : colors.mediumGrayText,
                    }
              }>
              <option value="">
                {translations.selectCity || "Select City"}
              </option>
              {citiesOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
            />
          </div>
          {formErrors.city && (
            <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
          )}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="storeName" className="block text-sm font-bold mb-1">
            {translations.storeNameLabel}*
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={editableStoreForm.storeName || ""}
            onChange={handleStoreFormChange}
            className={`w-full p-2 border rounded-md`}
            style={{
              ...inputStyle,
              borderColor: formErrors.storeName
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          {formErrors.storeName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.storeName}</p>
          )}
        </div>
        <div className="md:col-span-2 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={editableStoreForm.addBranch}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="addBranch" className="text-sm font-medium">
            {translations.addBranchLabel}
          </label>
        </div>
        {editableStoreForm.addBranch && (
          <div className="md:col-span-2">
            <label
              htmlFor="branchName"
              className="block text-sm font-bold mb-1">
              {translations.branchNameLabel}*
            </label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={editableStoreForm.branchName || ""}
              onChange={handleStoreFormChange}
              className="w-full p-2 border rounded-md"
              style={{
                ...inputStyle,
                borderColor: formErrors.branchName
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {formErrors.branchName && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.branchName}
              </p>
            )}
          </div>
        )}
        <div className="md:col-span-2">
          <label htmlFor="address" className="block text-sm font-bold mb-1">
            {translations.storeBranchAddressLabel}*
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={editableStoreForm.address || ""}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md resize-y"
            style={{
              ...inputStyle,
              borderColor: formErrors.address
                ? colors.errorRed
                : colors.mediumGrayText,
            }}></textarea>
          {formErrors.address && (
            <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
          )}
        </div>
        <div className="flex items-center md:col-span-2">
          <input
            type="checkbox"
            id="allDayOpen"
            name="allDayOpen"
            checked={editableStoreForm.allDayOpen}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="allDayOpen">{translations?.allDayOpenLabel}</label>
        </div>
        <div>
          <label htmlFor="openingHour">
            {translations?.openingHourLabel}
            {!editableStoreForm.allDayOpen && "*"}
          </label>
          <select
            id="openingHour"
            name="openingHour"
            value={editableStoreForm.openingHour}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            disabled={editableStoreForm.allDayOpen}
            style={
              editableStoreForm.allDayOpen ? disabledInputStyle : inputStyle
            }>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="closingHour">
            {translations?.closingHourLabel}
            {!editableStoreForm.allDayOpen && "*"}
          </label>
          <select
            id="closingHour"
            name="closingHour"
            value={editableStoreForm.closingHour}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            disabled={editableStoreForm.allDayOpen}
            style={
              editableStoreForm.allDayOpen ? disabledInputStyle : inputStyle
            }>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ownerName">{translations?.ownerNameLabel}*</label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={editableStoreForm.ownerName || ""}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="ownerSurname">
            {translations?.ownerSurnameLabel}*
          </label>
          <input
            type="text"
            id="ownerSurname"
            name="ownerSurname"
            value={editableStoreForm.ownerSurname || ""}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="installerName">
            {translations?.installerNameLabel}*
          </label>
          <input
            type="text"
            id="installerName"
            name="installerName"
            value={editableStoreForm.installerName || ""}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="installerSurname">
            {translations?.installerSurnameLabel}*
          </label>
          <input
            type="text"
            id="installerSurname"
            name="installerSurname"
            value={editableStoreForm.installerSurname || ""}
            onChange={handleStoreFormChange}
            className="w-full p-2 border rounded-md"
            style={inputStyle}
          />
        </div>
      </form>
      <div className="flex justify-end mt-6">
        <button
          onClick={handleStoreInfoNext}
          className="px-6 py-2 rounded-md font-bold text-white"
          style={{ backgroundColor: colors.nextButtonBg }}>
          {translations.nextButton || "Next"}
        </button>
      </div>
    </div>
  );
};

export default StoreEditingStep1;
