// src/components/InstallationSteps/Step1.jsx
import React from "react";
import { ChevronDown } from "lucide-react";

const Step1 = ({
  storeForm,
  setStoreForm,
  citiesOptions,
  setCitiesOptions,
  countryOptions,
  colors,
  translations,
  timeOptions,
  formErrors,
  setFormErrors,
  onNext,
  isCountryFilterDisabled,
  isAdmin,
}) => {
  const handleStoreFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setStoreForm((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "country") {
      if (value === "Poland") {
        setCitiesOptions([
          { value: "Warsaw", label: "Warsaw" },
          { value: "Krakow", label: "Krakow" },
          { value: "Gdansk", label: "Gdansk" },
        ]);
      } else if (value === "Azerbaijan") {
        setCitiesOptions([
          { value: "Baku", label: "Baku" },
          { value: "Ganja", label: "Ganja" },
          { value: "Sumgait", label: "Sumgait" },
        ]);
      } else {
        setCitiesOptions([]);
      }
      setStoreForm((prev) => ({ ...prev, city: "" }));
    }
  };

  const handleNextClick = () => {
    let isValid = true;
    const newErrors = {};
    let firstInvalidFieldElement = null;

    const requiredFields = [
      "country",
      "city",
      "storeName",
      "address",
      "ownerName",
      "ownerSurname",
      "installerName",
      "installerSurname",
    ];

    if (!storeForm.allDayOpen) {
      requiredFields.push("openingHour", "closingHour");
    }
    if (storeForm.addBranch) {
      requiredFields.push("branchName");
    }

    for (const field of requiredFields) {
      if (
        !storeForm[field] ||
        (typeof storeForm[field] === "string" && storeForm[field].trim() === "")
      ) {
        isValid = false;
        newErrors[field] =
          translations?.requiredFieldWarning || "This field is required.";
        if (!firstInvalidFieldElement) {
          firstInvalidFieldElement = document.getElementById(field);
        }
      }
    }

    setFormErrors(newErrors);

    if (isValid) {
      onNext();
    } else if (firstInvalidFieldElement) {
      firstInvalidFieldElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  const disabledInputStyle = {
    backgroundColor: colors.lightGrayBg,
    color: colors.mediumGrayText,
    cursor: "not-allowed",
    borderColor: colors.mediumGrayText,
  };
  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };
  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2 className="text-xl font-semibold mb-6">
        {translations?.step1Title || "Store Information"}
      </h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="country" className="block text-sm font-bold mb-2">
              {translations?.countryLabel || "Country"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="country"
                name="country"
                value={storeForm.country}
                onChange={handleStoreFormChange}
                disabled={isCountryFilterDisabled} // the disabled property is bound here
                className={`w-full p-2 border rounded-md appearance-none ${
                  formErrors.country ? "border-red-500" : ""
                }`}
                style={
                  isCountryFilterDisabled
                    ? disabledInputStyle
                    : {
                        ...inputStyle,
                        borderColor: formErrors.country
                          ? colors.errorRed
                          : colors.mediumGrayText,
                      }
                }>
                {isAdmin && (
                  <option value="">
                    {translations?.countryPlaceholder || "Select Country"}
                  </option>
                )}
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            {formErrors.country && (
              <p className="text-red-500 text-xs mt-1">{formErrors.country}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-bold mb-2">
              {translations?.cityLabel || "City"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="city"
                name="city"
                value={storeForm.city}
                onChange={handleStoreFormChange}
                className={`w-full p-2 border rounded-md appearance-none ${
                  formErrors.city ? "border-red-500" : ""
                }`}
                disabled={!storeForm.country}
                style={{
                  backgroundColor: !storeForm.country
                    ? colors.lightGrayBg
                    : colors.pureWhite,
                  color: colors.darkText,
                  borderColor: formErrors.city
                    ? colors.errorRed
                    : colors.mediumGrayText,
                }}>
                <option value="">
                  {translations?.cityPlaceholder || "Select City"}
                </option>
                {citiesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            {formErrors.city && (
              <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="storeName" className="block text-sm font-bold mb-2">
            {translations?.storeNameLabel || "Store Name"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={storeForm.storeName}
            onChange={handleStoreFormChange}
            className={`w-full p-2 border rounded-md ${
              formErrors.storeName ? "border-red-500" : ""
            }`}
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
              borderColor: formErrors.storeName
                ? colors.errorRed
                : colors.mediumGrayText,
            }}
          />
          {formErrors.storeName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.storeName}</p>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={storeForm.addBranch}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="addBranch">
            {translations?.addBranchLabel || "Add Branch"}
          </label>
        </div>
        {storeForm.addBranch && (
          <div className="mb-4">
            <label
              htmlFor="branchName"
              className="block text-sm font-bold mb-2">
              {translations?.branchNameLabel || "Branch Name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={storeForm.branchName}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.branchName ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
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
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-bold mb-2">
            {translations?.storeBranchAddressLabel || "Store/Branch Address"}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={storeForm.address}
            onChange={handleStoreFormChange}
            className={`w-full p-2 border rounded-md resize-y ${
              formErrors.address ? "border-red-500" : ""
            }`}
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
              borderColor: formErrors.address
                ? colors.errorRed
                : colors.mediumGrayText,
            }}></textarea>
          {formErrors.address && (
            <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="allDayOpen"
            name="allDayOpen"
            checked={storeForm.allDayOpen}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="allDayOpen">
            {translations?.allDayOpenLabel || "All Day Open (24/7)"}
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="openingHour"
              className="block text-sm font-bold mb-2">
              {translations?.openingHourLabel || "Opening Hour"}{" "}
              {!storeForm.allDayOpen && <span className="text-red-500">*</span>}
            </label>
            <select
              id="openingHour"
              name="openingHour"
              value={storeForm.openingHour}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.openingHour ? "border-red-500" : ""
              }`}
              disabled={storeForm.allDayOpen}
              style={{
                backgroundColor: storeForm.allDayOpen
                  ? colors.lightGrayBg
                  : colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.openingHour
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}>
              <option value="">
                {translations?.selectHour || "Select Hour"}
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {formErrors.openingHour && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.openingHour}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="closingHour"
              className="block text-sm font-bold mb-2">
              {translations?.closingHourLabel || "Closing Hour"}{" "}
              {!storeForm.allDayOpen && <span className="text-red-500">*</span>}
            </label>
            <select
              id="closingHour"
              name="closingHour"
              value={storeForm.closingHour}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.closingHour ? "border-red-500" : ""
              }`}
              disabled={storeForm.allDayOpen}
              style={{
                backgroundColor: storeForm.allDayOpen
                  ? colors.lightGrayBg
                  : colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.closingHour
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}>
              <option value="">
                {translations?.selectHour || "Select Hour"}
              </option>
              {timeOptions.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            {formErrors.closingHour && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.closingHour}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="ownerName" className="block text-sm font-bold mb-2">
              {translations?.ownerNameLabel || "Owner Name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={storeForm.ownerName}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.ownerName ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.ownerName
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {formErrors.ownerName && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.ownerName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ownerSurname"
              className="block text-sm font-bold mb-2">
              {translations?.ownerSurnameLabel || "Owner Surname"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ownerSurname"
              name="ownerSurname"
              value={storeForm.ownerSurname}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.ownerSurname ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.ownerSurname
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {formErrors.ownerSurname && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.ownerSurname}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="installerName"
              className="block text-sm font-bold mb-2">
              {translations?.installerNameLabel || "Installer Name"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="installerName"
              name="installerName"
              value={storeForm.installerName}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.installerName ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.installerName
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {formErrors.installerName && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.installerName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="installerSurname"
              className="block text-sm font-bold mb-2">
              {translations?.installerSurnameLabel || "Installer Surname"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="installerSurname"
              name="installerSurname"
              value={storeForm.installerSurname}
              onChange={handleStoreFormChange}
              className={`w-full p-2 border rounded-md ${
                formErrors.installerSurname ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
                borderColor: formErrors.installerSurname
                  ? colors.errorRed
                  : colors.mediumGrayText,
              }}
            />
            {formErrors.installerSurname && (
              <p className="text-red-500 text-xs mt-1">
                {formErrors.installerSurname}
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="flex justify-end p-4 bg-transparent mt-4 border-t">
        <button
          onClick={handleNextClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton || "Next"}
        </button>
      </div>
    </div>
  );
};
export default Step1;
