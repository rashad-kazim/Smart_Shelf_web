// App.js
import React, { useState, useRef } from "react";
// Lucide React icons
import {
  Menu,
  X,
  Home,
  Store,
  PlusCircle,
  Settings,
  Users,
  Sun,
  Moon,
  CheckCircle,
  Bluetooth, // Ensure Bluetooth icon is imported
  ChevronDown, // Add ChevronDown for select elements
} from "lucide-react";

// Step1 Bileşeni
function Step1({
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
  setShowDialog, // Dialog props added
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) {
  // Form alanlarındaki değişiklikleri yönetir
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
        setStoreForm((prev) => ({ ...prev, city: "" })); // Şehri temizle
      } else if (value === "Azerbaijan") {
        setCitiesOptions([
          { value: "Baku", label: "Baku" },
          { value: "Ganja", label: "Ganja" },
          { value: "Sumgait", label: "Sumgait" },
        ]);
        setStoreForm((prev) => ({ ...prev, city: "" })); // Şehri temizle
      } else {
        setCitiesOptions([]);
        setStoreForm((prev) => ({ ...prev, city: "" }));
      }
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
      if (!storeForm[field]) {
        isValid = false;
        newErrors[field] = translations?.requiredFieldWarning;
        if (!firstInvalidFieldElement) {
          firstInvalidFieldElement = document.getElementById(field);
        }
      }
    }
    setFormErrors(newErrors);

    if (isValid) {
      onNext();
    } else {
      if (firstInvalidFieldElement) {
        firstInvalidFieldElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step1Title}
      </h2>
      <form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="country"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.countryLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="country"
                name="country"
                value={storeForm.country}
                onChange={handleStoreFormChange}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  formErrors.country ? "border-red-500" : ""
                }`}
                required
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: "pointer", // Added pointer cursor
                }}>
                <option value="">{translations?.countryPlaceholder}</option>
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {formErrors.country && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.country}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="city"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.cityLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="city"
                name="city"
                value={storeForm.city}
                onChange={handleStoreFormChange}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  formErrors.city ? "border-red-500" : ""
                }`}
                disabled={!storeForm.country}
                required
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: storeForm.country ? "pointer" : "default", // Conditional cursor
                }}>
                <option value="">{translations?.cityPlaceholder}</option>
                {citiesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {formErrors.city && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.city}
              </p>
            )}
          </div>
        </div>
        <div className="mb-4">
          <label
            htmlFor="storeName"
            className="block text-gray-700 text-sm font-bold mb-2"
            style={{ color: colors?.darkText }}>
            {translations?.storeNameLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={storeForm.storeName}
            onChange={handleStoreFormChange}
            className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
              formErrors.storeName ? "border-red-500" : ""
            }`}
            required
            style={{
              backgroundColor: colors?.pureWhite,
              color: colors?.darkText,
              borderColor: colors?.mediumGrayText,
            }}
          />
          {formErrors.storeName && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.storeName}
            </p>
          )}
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="addBranch"
            name="addBranch"
            checked={storeForm.addBranch}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            style={{
              backgroundColor: colors?.pureWhite,
              borderColor: colors?.mediumGrayText,
            }}
          />
          <label
            htmlFor="addBranch"
            className="text-gray-700 text-sm"
            style={{ color: colors?.darkText }}>
            {translations?.addBranchLabel}
          </label>
        </div>
        {storeForm.addBranch && (
          <div className="mb-4">
            <label
              htmlFor="branchName"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.branchNameLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="branchName"
              name="branchName"
              value={storeForm.branchName}
              onChange={handleStoreFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.branchName ? "border-red-500" : ""
              }`}
              required
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {formErrors.branchName && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.branchName}
              </p>
            )}
          </div>
        )}
        <div className="mb-4">
          <label
            htmlFor="address"
            className="block text-gray-700 text-sm font-bold mb-2"
            style={{ color: colors?.darkText }}>
            {translations?.storeBranchAddressLabel}{" "}
            <span className="text-red-500">*</span>
          </label>
          <textarea
            id="address"
            name="address"
            rows="3"
            value={storeForm.address}
            onChange={handleStoreFormChange}
            className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 resize-y ${
              formErrors.address ? "border-red-500" : ""
            }`}
            required
            style={{
              backgroundColor: colors?.pureWhite,
              color: colors?.darkText,
              borderColor: colors?.mediumGrayText,
            }}></textarea>
          {formErrors.address && (
            <p className="text-red-500 text-xs italic mt-1">
              {formErrors.address}
            </p>
          )}
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="allDayOpen"
            name="allDayOpen"
            checked={storeForm.allDayOpen}
            onChange={handleStoreFormChange}
            className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            style={{
              backgroundColor: colors?.pureWhite,
              borderColor: colors?.mediumGrayText,
            }}
          />
          <label
            htmlFor="allDayOpen"
            className="text-gray-700 text-sm"
            style={{ color: colors?.darkText }}>
            {translations?.allDayOpenLabel}
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="openingHour"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.openingHourLabel}{" "}
              {!storeForm.allDayOpen && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="openingHour"
                name="openingHour"
                value={storeForm.openingHour}
                onChange={handleStoreFormChange}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  storeForm.allDayOpen ? "bg-gray-200" : ""
                } ${formErrors.openingHour ? "border-red-500" : ""}`}
                disabled={storeForm.allDayOpen}
                required={!storeForm.allDayOpen}
                style={{
                  backgroundColor: storeForm.allDayOpen
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: storeForm.allDayOpen ? "default" : "pointer",
                }}>
                <option value="">{translations?.selectHour}</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {formErrors.openingHour && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.openingHour}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="closingHour"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.closingHourLabel}{" "}
              {!storeForm.allDayOpen && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="closingHour"
                name="closingHour"
                value={storeForm.closingHour}
                onChange={handleStoreFormChange}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  storeForm.allDayOpen ? "bg-gray-200" : ""
                } ${formErrors.closingHour ? "border-red-500" : ""}`}
                disabled={storeForm.allDayOpen}
                required={!storeForm.allDayOpen}
                style={{
                  backgroundColor: storeForm.allDayOpen
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: storeForm.allDayOpen ? "default" : "pointer",
                }}>
                <option value="">{translations?.selectHour}</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {formErrors.closingHour && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.closingHour}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="ownerName"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.ownerNameLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={storeForm.ownerName}
              onChange={handleStoreFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.ownerName ? "border-red-500" : ""
              }`}
              required
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {formErrors.ownerName && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.ownerName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ownerSurname"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.ownerSurnameLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="ownerSurname"
              name="ownerSurname"
              value={storeForm.ownerSurname}
              onChange={handleStoreFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.ownerSurname ? "border-red-500" : ""
              }`}
              required
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {formErrors.ownerSurname && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.ownerSurname}
              </p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label
              htmlFor="installerName"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.installerNameLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="installerName"
              name="installerName"
              value={storeForm.installerName}
              onChange={handleStoreFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.installerName ? "border-red-500" : ""
              }`}
              required
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {formErrors.installerName && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.installerName}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="installerSurname"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.installerSurnameLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="installerSurname"
              name="installerSurname"
              value={storeForm.installerSurname}
              onChange={handleStoreFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                formErrors.installerSurname ? "border-red-500" : ""
              }`}
              required
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {formErrors.installerSurname && (
              <p className="text-red-500 text-xs italic mt-1">
                {formErrors.installerSurname}
              </p>
            )}
          </div>
        </div>
      </form>
      <div className="flex justify-end p-4 bg-transparent">
        <button
          onClick={handleNextClick}
          className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200`}
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton}
        </button>
      </div>
    </div>
  );
}

// Step2 Bileşeni
function Step2({
  serverToken,
  serverConnectionStatus,
  colors,
  translations,
  onNext,
  onBack,
  handleGenerateServerToken,
  handleCheckConnection,
  setShowDialog, // Dialog props added
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) {
  const handleNextClick = () => {
    // Check if serverToken is present and connection status is successful
    if (
      !serverToken ||
      serverConnectionStatus !== translations?.connectionSuccess
    ) {
      setDialogTitle("Cannot Proceed");
      setDialogMessage(translations?.cannotProceed);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }
    onNext();
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step2Title}
      </h2>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateServerToken}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
            {translations?.generateTokenButton}
          </button>
          <div className="relative flex-grow">
            <input
              type="text"
              readOnly
              value={serverToken}
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-100" // Removed pr-10
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
              }}
            />
            {/* Removed the copy button */}
          </div>
        </div>
      </div>
      <div className="mb-4">
        <button
          onClick={handleCheckConnection}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors duration-200">
          {translations?.checkConnectionButton}
        </button>
        {serverConnectionStatus && (
          <p
            className={`mt-2 ${
              serverConnectionStatus?.includes(translations?.connectionSuccess)
                ? "text-green-600"
                : "text-red-600"
            }`}
            style={{
              color: serverConnectionStatus?.includes(
                translations?.connectionSuccess
              )
                ? colors?.successGreen
                : colors?.errorRed,
            }}>
            {serverConnectionStatus}
          </p>
        )}
      </div>
      <div className="flex justify-between p-4 bg-transparent">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton}
        </button>
        <button
          onClick={handleNextClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton}
        </button>
      </div>
    </div>
  );
}

// Step3 Bileşeni
function Step3({
  esp32Token,
  colors,
  translations,
  onNext,
  onBack,
  handleGenerateEsp32Token,
  setShowDialog, // Dialog props added
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) {
  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step3Title}
      </h2>
      <div className="mb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleGenerateEsp32Token}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 whitespace-nowrap">
            {translations?.generateTokenButton}
          </button>
          <input
            type="text"
            readOnly
            value={esp32Token}
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-100"
            style={{
              backgroundColor: colors?.lightGrayBg,
              color: colors?.darkText,
              borderColor: colors?.mediumGrayText,
            }}
          />
        </div>
      </div>
      <div className="flex justify-between p-4 bg-transparent">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton}
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton}
        </button>
      </div>
    </div>
  );
}

// Step4 Bileşeni
function Step4({
  installedDevices,
  setInstalledDevices,
  currentInstallingDevice,
  setCurrentInstallingDevice,
  bluetoothConnectedDevice,
  setBluetoothConnectedDevice,
  deviceForm,
  setDeviceForm,
  isDeviceFormActive,
  setIsDeviceFormActive,
  fontSizes,
  screenSizes,
  deviceFormErrors,
  setDeviceFormErrors,
  colors,
  translations,
  timeOptions,
  storeForm,
  esp32Token,
  onNext,
  onBack,
  handleBluetoothConnect,
  handleSaveDevice,
  handleRemoveDevice,
  handleEditDevice,
  handleAddNewDevice,
  setShowDialog, // Added for custom dialog
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) {
  const newDeviceFormSectionRef = useRef(null);
  const installedDevicesSectionRef = useRef(null);

  // Form alanlarındaki değişiklikları yönetir
  const handleDeviceFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "id") {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue) && value !== "") {
        setDeviceFormErrors((prev) => ({
          ...prev,
          id: translations?.invalidID,
        }));
        return;
      } else {
        setDeviceFormErrors((prev) => ({ ...prev, id: "" }));
      }

      if (
        value !== "" &&
        installedDevices.some(
          (d) =>
            d.id === parsedValue &&
            d.id !== (currentInstallingDevice?.id || null)
        )
      ) {
        setDeviceFormErrors((prev) => ({
          ...prev,
          id: translations?.deviceIdExists,
        }));
      } else {
        setDeviceFormErrors((prev) => ({ ...prev, id: "" }));
      }
    }

    setDeviceForm((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSaveClick = () => {
    let isValid = true;
    const newErrors = {};

    if (!bluetoothConnectedDevice && !currentInstallingDevice) {
      // Replaced alert with custom dialog
      setDialogTitle("Device Connection Required");
      setDialogMessage(translations?.bluetoothNoDeviceSelected);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }

    const requiredDeviceFields = ["screenSize"];
    if (!deviceForm.allDayWork) {
      requiredDeviceFields.push("awakeTime", "sleepTime");
    }

    // Validate required fields
    for (const field of requiredDeviceFields) {
      if (!deviceForm[field]) {
        isValid = false;
        newErrors[field] = translations?.requiredFieldWarning;
      }
    }

    // Validate ID field specifically
    const parsedId = parseInt(deviceForm.id);
    if (isNaN(parsedId)) {
      isValid = false;
      newErrors.id = translations?.invalidID;
    } else if (
      installedDevices.some(
        (d) =>
          d.id === parsedId && d.id !== (currentInstallingDevice?.id || null)
      )
    ) {
      isValid = false;
      newErrors.id = translations?.deviceIdExists;
    }
    setDeviceFormErrors(newErrors);

    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const newInstalledDevice = { ...deviceForm, id: parsedId };

    setInstalledDevices((prev) => {
      let updatedDevices = [...prev];
      // If we are editing an existing device
      if (currentInstallingDevice) {
        const originalId = currentInstallingDevice.id;
        // Filter out the old version of the device based on its original ID
        updatedDevices = updatedDevices.filter((d) => d.id !== originalId);
      }

      // Add the new/updated device
      updatedDevices.push(newInstalledDevice);
      return updatedDevices;
    });

    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setBluetoothConnectedDevice(null);
    setDeviceForm({
      id:
        installedDevices.length > 0
          ? Math.max(...installedDevices.map((d) => d.id)) + 1
          : 1,
      country: storeForm.country,
      city: storeForm.city,
      token: esp32Token,
      allDayWork: storeForm.allDayOpen,
      awakeTime: "", // Removed default
      sleepTime: "", // Removed default
      productNameFontSize: 14, // Set default
      productPriceFontSizeBeforeDiscount: 14, // Set default
      productPriceFontSizeAfterDiscount: 14, // Set default
      productBarcodeFontSize: 14, // Set default
      productBarcodeNumbersFontSize: 14, // Set default
      screenSize: "", // Removed default
    });
    setDeviceFormErrors({});

    if (installedDevicesSectionRef.current) {
      installedDevicesSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleNextClick = () => {
    if (isDeviceFormActive) {
      // Replaced alert with custom dialog
      setDialogTitle("Action Required");
      setDialogMessage(
        "Please save or cancel the current device installation."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }

    // New check: Prevent proceeding if no devices are installed
    if (installedDevices.length === 0) {
      setDialogTitle("Cannot Proceed");
      setDialogMessage(
        "Please install at least one device before proceeding to the next step."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }

    onNext();
  };

  const handleEditDeviceClick = (deviceToEdit) => {
    handleEditDevice(deviceToEdit);
    if (newDeviceFormSectionRef.current) {
      newDeviceFormSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAddNewDeviceClick = () => {
    handleAddNewDevice();
    if (newDeviceFormSectionRef.current) {
      newDeviceFormSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step4Title}
      </h2>
      <div
        id="installed-devices-section"
        ref={installedDevicesSectionRef}
        className="mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors?.darkText }}>
          {translations?.installedDevicesTitle}
        </h3>
        {installedDevices.length === 0 ? (
          <p
            className="text-gray-600"
            style={{ color: colors?.mediumGrayText }}>
            No devices installed yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {installedDevices.map((device) => (
              <li
                key={device.id}
                className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
                style={{
                  backgroundColor: colors?.lightGrayBg,
                  color: colors?.darkText,
                }}>
                <span>
                  ID: {device.id} - Screen: {device.screenSize} - Token:{" "}
                  {device.token.substring(0, 8)}...
                </span>
                <button
                  onClick={() => handleEditDeviceClick(device)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-1 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200">
                  {translations?.editButton}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isDeviceFormActive && (
        <div
          id="new-device-form-section"
          ref={newDeviceFormSectionRef}
          className="border-t border-gray-200 pt-6 mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <h3
            className="text-lg font-semibold text-gray-800 mb-4 col-span-full"
            style={{ color: colors?.darkText }}>
            {currentInstallingDevice
              ? `Edit Device ID: ${currentInstallingDevice.id}`
              : `New Device Installation`}
          </h3>
          <div className="col-span-full text-center mb-4">
            <button
              onClick={handleBluetoothConnect}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-4 rounded-md flex items-center justify-center border-2 border-blue-700 transition-colors duration-200 shadow-lg
              ${
                bluetoothConnectedDevice || currentInstallingDevice
                  ? "opacity-50 cursor-default"
                  : ""
              }`}
              disabled={
                bluetoothConnectedDevice !== null ||
                currentInstallingDevice !== null
              }
              title={translations?.bluetoothConnectButton}>
              <Bluetooth size={28} className="mr-3" />
              <span>{translations?.bluetoothConnectButton}</span>
            </button>
            {bluetoothConnectedDevice && (
              <p
                className="mt-2 text-green-600"
                style={{ color: colors?.successGreen }}>
                Connected to {bluetoothConnectedDevice.name}
              </p>
            )}
            {!bluetoothConnectedDevice && !currentInstallingDevice && (
              <p
                className="mt-2 text-gray-500 text-sm"
                style={{ color: colors?.mediumGrayText }}>
                {translations?.bluetoothNoDeviceSelected}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="id"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.idLabel}
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={deviceForm.id}
              onChange={handleDeviceFormChange}
              className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                deviceFormErrors.id ? "border-red-500" : ""
              }`}
              disabled={!isDeviceFormActive}
              style={{
                backgroundColor: !isDeviceFormActive
                  ? colors?.lightGrayBg
                  : colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
                cursor: !isDeviceFormActive ? "default" : "text",
              }}
            />
            {deviceFormErrors.id && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.id}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label
              htmlFor="deviceCountry"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.countryLabel}
            </label>
            <input
              type="text"
              id="deviceCountry"
              name="country"
              value={deviceForm.country}
              readOnly
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-100"
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
                cursor: "default",
              }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="deviceCity"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.cityLabel}
            </label>
            <input
              type="text"
              id="deviceCity"
              name="city"
              value={deviceForm.city}
              readOnly
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-100"
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
                cursor: "default",
              }}
            />
          </div>
          <div className="col-span-1">
            <label
              htmlFor="deviceToken"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.tokenLabel}
            </label>
            <input
              type="text"
              id="deviceToken"
              name="token"
              value={deviceForm.token}
              readOnly
              className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 bg-gray-100"
              style={{
                backgroundColor: colors?.lightGrayBg,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
                cursor: "default",
              }}
            />
          </div>

          <div className="col-span-full mb-4 flex items-center">
            <input
              type="checkbox"
              id="allDayWork"
              name="allDayWork"
              checked={deviceForm.allDayWork}
              onChange={handleDeviceFormChange}
              disabled={!isDeviceFormActive}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              style={{
                backgroundColor: colors?.pureWhite,
                borderColor: colors?.mediumGrayText,
              }}
            />
            <label
              htmlFor="allDayWork"
              className="text-gray-700 text-sm"
              style={{ color: colors?.darkText }}>
              {translations?.allDayWorkLabel}
            </label>
          </div>

          <div className="col-span-1">
            <label
              htmlFor="awakeTime"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.awakeTimeLabel}{" "}
              {!deviceForm.allDayWork && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="awakeTime"
                name="awakeTime"
                value={deviceForm.awakeTime}
                onChange={handleDeviceFormChange}
                disabled={deviceForm.allDayWork || !isDeviceFormActive}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  deviceForm.allDayWork ? "bg-gray-200" : ""
                } ${deviceFormErrors.awakeTime ? "border-red-500" : ""}`}
                required={!deviceForm.allDayWork}
                style={{
                  backgroundColor: deviceForm.allDayWork
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor:
                    deviceForm.allDayWork || !isDeviceFormActive
                      ? "default"
                      : "pointer",
                }}>
                <option value="">Select Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {deviceFormErrors.awakeTime && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.awakeTime}
              </p>
            )}
          </div>
          <div className="col-span-1">
            <label
              htmlFor="sleepTime"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.sleepTimeLabel}{" "}
              {!deviceForm.allDayWork && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="sleepTime"
                name="sleepTime"
                value={deviceForm.sleepTime}
                onChange={handleDeviceFormChange}
                disabled={deviceForm.allDayWork || !isDeviceFormActive}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  deviceForm.allDayWork ? "bg-gray-200" : ""
                } ${deviceFormErrors.sleepTime ? "border-red-500" : ""}`}
                required={!deviceForm.allDayWork}
                style={{
                  backgroundColor: deviceForm.allDayWork
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor:
                    deviceForm.allDayWork || !isDeviceFormActive
                      ? "default"
                      : "pointer",
                }}>
                <option value="">Select Time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {deviceFormErrors.sleepTime && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.sleepTime}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="productNameFontSize"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productNameFontSizeLabel}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="productNameFontSize"
                name="productNameFontSize"
                value={deviceForm.productNameFontSize}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: !isDeviceFormActive ? "default" : "pointer",
                }}>
                <option value="">Select Font Size</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="productPriceFontSizeBeforeDiscount"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productPriceFontSizeBeforeDiscountLabel}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="productPriceFontSizeBeforeDiscount"
                name="productPriceFontSizeBeforeDiscount"
                value={deviceForm.productPriceFontSizeBeforeDiscount}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">Select Font Size</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="productPriceFontSizeAfterDiscount"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productPriceFontSizeAfterDiscountLabel}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="productPriceFontSizeAfterDiscount"
                name="productPriceFontSizeAfterDiscount"
                value={deviceForm.productPriceFontSizeAfterDiscount}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">Select Font Size</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="productBarcodeFontSize"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productBarcodeFontSizeLabel}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="productBarcodeFontSize"
                name="productBarcodeFontSize"
                value={deviceForm.productBarcodeFontSize}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">Select Font Size</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="productBarcodeNumbersFontSize"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productBarcodeNumbersFontSizeLabel}
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="productBarcodeNumbersFontSize"
                name="productBarcodeNumbersFontSize"
                value={deviceForm.productBarcodeNumbersFontSize}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">Select Font Size</option>
                {fontSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
          </div>
          <div className="col-span-1">
            <label
              htmlFor="screenSize"
              className="block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.screenSizeLabel}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {" "}
              {/* Added relative for arrow positioning */}
              <select
                id="screenSize"
                name="screenSize"
                value={deviceForm.screenSize}
                onChange={handleDeviceFormChange}
                disabled={!isDeviceFormActive}
                className={`shadow appearance-none border rounded-md w-full py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
                  deviceFormErrors.screenSize ? "border-red-500" : ""
                }`}
                required
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: !isDeviceFormActive ? "default" : "pointer",
                }}>
                <option value="">Select Screen Size</option>
                {screenSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />{" "}
              {/* Arrow icon */}
            </div>
            {deviceFormErrors.screenSize && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.screenSize}
              </p>
            )}
          </div>
          <div className="flex justify-between mt-6 col-span-full">
            {!(installedDevices.length === 0 && !currentInstallingDevice) && (
              <button
                onClick={() =>
                  handleRemoveDevice(
                    currentInstallingDevice?.id || deviceForm.id
                  )
                }
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
                {translations?.removeDeviceButton}
              </button>
            )}
            <button
              onClick={handleSaveClick}
              className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 ${
                installedDevices.length === 0 && !currentInstallingDevice
                  ? "mx-auto"
                  : ""
              }`}
              style={{
                marginLeft:
                  installedDevices.length === 0 && !currentInstallingDevice
                    ? "auto"
                    : "0",
              }}>
              {translations?.saveButton}
            </button>
          </div>
        </div>
      )}

      {!isDeviceFormActive && ( // Show "Add New Device" button only when form is not active
        <div className="mb-6 mt-6">
          <button
            onClick={handleAddNewDeviceClick}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 block mx-auto">
            {translations?.addNewDeviceButton}
          </button>
        </div>
      )}

      <div className="flex justify-between p-4 bg-transparent mt-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton}
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton}
        </button>
      </div>
    </div>
  );
}

// Step5 Bileşeni
function Step5({
  logs,
  setLogs,
  colors,
  translations,
  onBack,
  handleGetLogs,
  handleCompleteInstallation,
  setShowDialog, // Dialog props added
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) {
  const handleCompleteClick = () => {
    handleCompleteInstallation();
  };

  return (
    <div
      className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite, color: colors?.darkText }}>
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step5Title}
      </h2>
      <div className="mb-4">
        <button
          onClick={handleGetLogs}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
          {translations?.getLogsButton}
        </button>
        {logs.length > 0 && (
          <div
            className="mt-4 p-3 bg-gray-100 rounded-md"
            style={{
              backgroundColor: colors?.lightGrayBg,
              color: colors?.darkText,
            }}>
            <p className="font-semibold mb-2">
              {translations?.logsServerConnection}
            </p>
            <ul className="space-y-1">
              {logs.map((log, index) => (
                <li key={index} className="text-sm">
                  {translations?.logsDeviceStatus
                    ?.replace("{id}", log.id)
                    .replace("{status}", log.status)
                    .replace("{refreshRate}", log.refreshRate)
                    .replace("{batteryStatus}", log.batteryStatus)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex justify-between p-4 bg-transparent mt-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton}
        </button>
        <button
          onClick={handleCompleteClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200">
          {translations?.completeInstallationButton}
        </button>
      </div>
    </div>
  );
}

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [language, setLanguage] = useState("en"); // Dil durumu korunuyor ancak içerik İngilizce
  const [activeRoute, setActiveRoute] = useState("/new-installation");
  const [currentStep, setCurrentStep] = useState(1);

  // Custom Dialog States
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogType, setDialogType] = useState("alert"); // 'alert' or 'confirm'
  const [dialogCallback, setDialogCallback] = useState(null);

  // Adım tanımları: Her adımın ID'si, etiketi ve ilişkili bileşeni
  const steps = [
    { id: 1, label: "Store Info", component: Step1 },
    { id: 2, label: "Server Token", component: Step2 },
    { id: 3, label: "ESP32 Token", component: Step3 },
    { id: 4, label: "Device Installation", component: Step4 },
    { id: 5, label: "Complete Installation", component: Step5 },
  ];

  // currentStep'e göre doğru bileşeni bul
  const CurrentStepComponent = steps.find(
    (s) => s.id === currentStep
  )?.component;

  // Step 1 Form Alanları
  const [storeForm, setStoreForm] = useState({
    country: "",
    city: "",
    storeName: "",
    addBranch: false,
    branchName: "",
    address: "",
    allDayOpen: false,
    openingHour: "09:00",
    closingHour: "18:00",
    ownerName: "",
    ownerSurname: "",
    installerName: "",
    installerSurname: "",
  });
  const [citiesOptions, setCitiesOptions] = useState([]);
  const [countryOptions] = useState([
    { value: "Poland", label: "Poland" },
    { value: "Azerbaijan", label: "Azerbaijan" },
  ]);

  // Step 2 Form Alanları
  const [serverToken, setServerToken] = useState("");
  const [serverConnectionStatus, setServerConnectionStatus] = useState("");

  // Step 3 Form Alanları
  const [esp32Token, setEsp32Token] = useState("");

  // Step 4 Form Alanları
  const [installedDevices, setInstalledDevices] = useState([]);
  const [currentInstallingDevice, setCurrentInstallingDevice] = useState(null);
  const [bluetoothConnectedDevice, setBluetoothConnectedDevice] =
    useState(null);
  const [deviceForm, setDeviceForm] = useState({
    id: 1,
    country: "",
    city: "",
    token: "",
    allDayWork: false,
    awakeTime: "", // Removed default
    sleepTime: "", // Removed default
    productNameFontSize: 14, // Set default to 14
    productPriceFontSizeBeforeDiscount: 14, // Set default to 14
    productPriceFontSizeAfterDiscount: 14, // Set default to 14
    productBarcodeFontSize: 14, // Set default to 14
    productBarcodeNumbersFontSize: 14, // Set default to 14
    screenSize: "", // Removed default
  });
  const [isDeviceFormActive, setIsDeviceFormActive] = useState(false); // Default to false, user clicks "Add New Device"
  const [fontSizes] = useState(Array.from({ length: 33 }, (_, i) => i + 8));
  const [screenSizes] = useState(["130cm", "110cm", "80cm"]);
  const [deviceFormErrors, setDeviceFormErrors] = useState({});

  // Step 5 Form Alanları
  const [logs, setLogs] = useState([]);

  // Tema renk paletleri
  const lightColors = {
    headerSidebarBg: "#212B36",
    logoPrimaryBlue: "#00CFFF",
    logoSecondaryBlue: "#007BFF",
    pureWhite: "#FFFFFF",
    lightGrayBg: "#F0F2F5",
    darkText: "#1F2937",
    mediumGrayText: "#6B7280",
    whiteText: "#FFFFFF",
    successGreen: "#28A745",
    warningOrange: "#FFC107",
    errorRed: "#DC3545",
    progressBarBorder: "#D1D5DB",
    progressBarLine: "#D1D5DB",
    progressBarActive: "#28A745",
    nextButtonBg: "#28A745",
    prevButtonBg: "#B0B0B0",
  };

  const darkColors = {
    headerSidebarBg: "#1A202C",
    logoPrimaryBlue: "#00CFFF",
    logoSecondaryBlue: "#007BFF",
    pureWhite: "#2D3748",
    lightGrayBg: "#1A202C",
    darkText: "#E2E8F0",
    mediumGrayText: "#A0AEC0",
    whiteText: "#FFFFFF",
    successGreen: "#48BB78",
    warningOrange: "#ECC94B",
    errorRed: "#FC8181",
    progressBarBorder: "#4B5563",
    progressBarLine: "#4B5563",
    progressBarActive: "#48BB78",
    nextButtonBg: "#48BB78",
    prevButtonBg: "#6B7280",
  };

  const colors = isDarkMode ? darkColors : lightColors;

  // Tüm çevirileri içeren nesne (her zaman İngilizce içerik tutulacak)
  const translations = {
    en: {
      dashboard: {
        title: "Dashboard",
        welcomeText: "Welcome to EilSense.io Management Panel!",
        instructionText:
          "This area will summarize the overall status of your system, store performance, and critical notifications. Please select the relevant sections from the left menu to perform detailed operations.",
        note: "Note: The logo in the header bar above is a representation of your EilSense.io name and logo's visual tones. Your actual logo (a transparent PNG/SVG file) will appear exactly as you want it when integrated here.",
      },
      stores: {
        title: "Stores & Branches",
        createStoreTitle: "Create New Store",
        createStoreDesc: "Add a new store or branch to the system.",
        createStoreAction: "Create New Store action triggered!",
        editStoreTitle: "Edit Store Information",
        editStoreDesc: "Update details of existing stores or branches.",
        editStoreAction: "Edit Store Information action triggered!",
        deleteStoreTitle: "Delete Store",
        deleteStoreDesc: "Remove a store or branch from the system.",
        deleteStoreAction: "Delete Store action triggered!",
        viewLogsTitle: "View Logs",
        viewLogsDesc: "Access logs related to store operations.",
        viewLogsAction: "View Logs action triggered!",
        storeListTitle: "Stores",
        filterBy: "Filter by:",
        city: "City",
        cityPlaceholder: "Enter city",
        country: "Country",
        countryPlaceholder: "Enter country",
        openingHour: "Opening Hour",
        closingHour: "Closing Hour",
        selectHour: "Select Hour",
        allDayOpen: "All Day Open (24/7)",
        resetFilters: "Reset Filters",
        nameHeader: "Store Name",
        countryHeader: "Country",
        cityHeader: "City",
        branchHeader: "Branch",
        addressHeader: "Address",
        statusHeader: "Status",
        tokenHeader: "Server Token",
        workingHoursHeader: "Working Hours",
        createdAtHeader: "Created At",
        noStoresFound: "No stores found matching your criteria.",
        futureFeatures:
          "Upcoming: Store listing, adding, and deleting forms will be placed here.",
        storeDetailsTitle: "Store Details",
        dialogClose: "Close",
        typeToFilter: "Type to filter or select",
        noSuggestions: "No suggestions",
        registrationSuccess: "Store registered successfully! Server Token: ",
        registrationError: "Error registering store: ",
        // New Installation Sayfası için spesifik çeviriler
        step1Title: "Create New Store",
        countryLabel: "Country",
        cityLabel: "City",
        storeNameLabel: "Store Name",
        addBranchLabel: "Add Branch",
        branchNameLabel: "Branch Name",
        storeBranchAddressLabel: "Store/Branch Address",
        allDayOpenLabel: "All Day Open (24/7)",
        openingHourLabel: "Opening Hour",
        closingHourLabel: "Closing Hour",
        ownerNameLabel: "Owner Name",
        ownerSurnameLabel: "Owner Surname",
        installerNameLabel: "Installer Name",
        installerSurnameLabel: "Installer Surname",
        nextButton: "Next",
        previousButton: "Previous",
        requiredFieldWarning: "This field cannot be left blank.",
        // Step 2
        step2Title: "Server Token Generation",
        generateTokenButton: "Generate Token",
        copyToClipboardButton: "Copy to Clipboard",
        copiedMessage: "Copied to clipboard!",
        checkConnectionButton: "Check Connection",
        connectionSuccess: "Connection successful!",
        connectionError: "Connection failed: ",
        cannotProceed:
          "Cannot proceed to the next step without a successful connection.",
        // Step 3
        step3Title: "ESP32 Token Generation",
        // Step 4
        step4Title: "ESP32 Installation",
        installedDevicesTitle: "Installed Devices",
        editButton: "Edit",
        currentInstallationWarning:
          "A device is currently being installed, and editing is not allowed until the current operation is finished.",
        bluetoothConnectButton: "Connect via Bluetooth",
        bluetoothPopupTitle: "Connect to ESP32",
        bluetoothDeviceName: "ESP32",
        bluetoothNoDeviceSelected: "Please connect to an ESP32 device first.",
        idLabel: "ID",
        tokenLabel: "Token",
        allDayWorkLabel: "All Day Work",
        awakeTimeLabel: "Awake Time",
        sleepTimeLabel: "Sleep Time",
        productNameFontSizeLabel: "Product Name Font-Size",
        productPriceFontSizeBeforeDiscountLabel:
          "Product Price Font-Size (Before Discount)",
        productPriceFontSizeAfterDiscountLabel:
          "Product Price Font-Size (After Discount)", // Label added
        productBarcodeFontSizeLabel: "Product Barcode Font-Size", // Label added
        productBarcodeNumbersFontSizeLabel: "Product Barcode Numbers Font-Size", // Label added
        screenSizeLabel: "Screen Size",
        removeDeviceButton: "Remove This Device",
        saveButton: "Save",
        addNewDeviceButton: "Add New Device",
        deviceIdExists:
          "This ID is already assigned to another device. Please choose a different ID.",
        invalidID: "ID must be a number.",
        // Step 5
        step5Title: "Complete Installation",
        getLogsButton: "Get Logs",
        logsServerConnection: "Connection established with Server.",
        logsDeviceStatus:
          "Device ID: {id}, Connection Status: {status}, Refresh Rate: {refreshRate}, Battery Status: {batteryStatus}",
        completeInstallationButton: "Complete Installation",
        confirmCompletionTitle: "Confirm Installation",
        confirmCompletionMessage:
          "Are you sure you want to finish the installation?",
        yesButton: "Yes",
        noButton: "No",
      },
      firmware: {
        title: "Firmware Updates",
        introText: "This section is where you manage firmware updates.",
        instructionText:
          "You can distribute new software to devices from here.",
        futureFeatures:
          "Upcoming: Features to view current firmware versions and distribute new versions will be added.",
      },
      users: {
        title: "Users / Roles",
        introText: "This section is where you manage user accounts and roles.",
        instructionText: "You can add new users and define their permissions.",
        futureFeatures:
          "Upcoming: User listing, adding, editing, and deleting features will be added.",
      },
      menu: {
        dashboard: "Dashboard",
        stores: "Stores & Branches",
        newInstallation: "New Installation",
        firmware: "Firmware Updates",
        users: "Users / Roles",
      },
      profile: {
        userName: "John Doe",
      },
      footer: {
        rights: "All Rights Reserved.",
        address: "Address: Example St. No: 123, Example City, Country.",
        email: "Email:",
        phone: "Phone:",
        privacy: "Privacy Policy",
        terms: "Terms of Use",
      },
    },
  };

  // Menü öğeleri ve rotalar (içerik her zaman İngilizce)
  const navItems = [
    { name: translations.en.menu.dashboard, icon: Home, route: "/" },
    { name: translations.en.menu.stores, icon: Store, route: "/stores" },
    {
      name: translations.en.menu.newInstallation,
      icon: PlusCircle,
      route: "/new-installation",
    },
    { name: translations.en.menu.firmware, icon: Settings, route: "/firmware" },
    { name: translations.en.menu.users, icon: Users, route: "/users" },
  ];

  // Logo yer tutucu URL'sini headerSidebarBg rengine göre ayarla
  const logoPlaceholderUrl = `https://placehold.co/180x40/${colors.headerSidebarBg.substring(
    1
  )}/${colors.logoPrimaryBlue.substring(1)}?font=inter&text=EilSense.io`;

  // Tema değiştirme fonksiyonu
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Saati seçeneklerini oluştur (00:00 - 23:30, yarım saat arayla)
  const generateTimeOptions = () => {
    const hours = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, "0");
        const minute = m.toString().padStart(2, "0");
        hours.push(`${hour}:${minute}`);
      }
    }
    return hours;
  };
  const timeOptions = generateTimeOptions();

  // Progress Bar için ikonlar
  const StepIcon = ({ stepNumber, current, completed, colors }) => {
    const isCompleted = completed || currentStep > stepNumber;
    const isActive = current || currentStep === stepNumber;

    const circleColor = isCompleted ? colors?.progressBarActive : "transparent";
    const borderColor = isActive
      ? colors?.logoPrimaryBlue
      : colors?.progressBarBorder;
    const textColor = isCompleted
      ? colors?.whiteText
      : isActive
      ? colors?.logoPrimaryBlue
      : colors?.darkText;
    const iconColor = colors?.whiteText;

    return (
      <div
        className={`relative flex flex-col items-center transition-all duration-300 ease-in-out`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ease-in-out`}
          style={{
            backgroundColor: circleColor,
            borderColor: borderColor,
          }}>
          {isCompleted ? (
            <CheckCircle size={18} style={{ color: iconColor }} />
          ) : (
            <span className="font-semibold" style={{ color: textColor }}>
              {/* stepNumber kaldırıldı, sadece ikonlar gösteriliyor */}
            </span>
          )}
        </div>
        {stepNumber < steps.length && (
          <div
            className={`absolute h-0.5 top-1/2 left-full -translate-y-1/2 transition-all duration-300 ease-in-out`}
            style={{
              width: "calc(100% + 1rem)",
              backgroundColor:
                currentStep > stepNumber
                  ? colors?.progressBarActive
                  : colors?.progressBarLine,
              zIndex: -1,
            }}></div>
        )}
      </div>
    );
  };

  // Step ilerleme fonksiyonları
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Step 1 Form Alanları değişimini yönetir (App.js'te kalıyor, Step1'e prop olarak geçiyor)
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
        setStoreForm((prev) => ({ ...prev, city: "" }));
      } else if (value === "Azerbaijan") {
        setCitiesOptions([
          { value: "Baku", label: "Baku" },
          { value: "Ganja", label: "Ganja" },
          { value: "Sumgait", label: "Sumgait" },
        ]);
        setStoreForm((prev) => ({ ...prev, city: "" }));
      } else {
        setCitiesOptions([]);
        setStoreForm((prev) => ({ ...prev, city: "" }));
      }
    }
  };

  // Step 4 Cihaz Formu değişimini yönetir (App.js'te kalıyor, Step4'e prop olarak geçiyor)
  const handleDeviceFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "id") {
      const parsedValue = parseInt(value);
      if (isNaN(parsedValue) && value !== "") {
        setDeviceFormErrors((prev) => ({
          ...prev,
          id: translations.en.stores.invalidID,
        }));
        return;
      } else {
        setDeviceFormErrors((prev) => ({ ...prev, id: "" }));
      }

      if (
        value !== "" &&
        installedDevices.some(
          (d) =>
            d.id === parsedValue &&
            d.id !== (currentInstallingDevice?.id || null)
        )
      ) {
        setDeviceFormErrors((prev) => ({
          ...prev,
          id: translations.en.stores.deviceIdExists,
        }));
      } else {
        setDeviceFormErrors((prev) => ({ ...prev, id: "" }));
      }
    }

    setDeviceForm((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Hata mesajlarını göstermek için durum
  const [formErrors, setFormErrors] = useState({});

  // Step 2: Server Token Generation
  const handleGenerateServerToken = () => {
    const token =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    setServerToken(token);
    setServerConnectionStatus("");
  };

  // handleCopyServerToken removed as per user request

  const handleCheckConnection = async () => {
    if (!serverToken) {
      setServerConnectionStatus(
        translations.en.stores.connectionError + "Token is empty."
      );
      return;
    }
    try {
      setServerConnectionStatus(translations.en.stores.connectionSuccess);
    } catch (error) {
      setServerConnectionStatus(
        translations.en.stores.connectionError + error.message
      );
    }
  };

  // Step 3: ESP32 Token Generation
  const handleGenerateEsp32Token = () => {
    const token =
      "ESP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setEsp32Token(token);
    setDeviceForm((prev) => ({ ...prev, token: token }));
  };

  // Step 4: ESP32 Installation
  const handleBluetoothConnect = async () => {
    if (currentInstallingDevice) {
      setDialogTitle("Installation in Progress");
      setDialogMessage(translations.en.stores.currentInstallationWarning);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }

    try {
      setBluetoothConnectedDevice({ name: "ESP32_Device_123" });
      // isDeviceFormActive should already be true from handleAddNewDevice,
      // but ensure it's true here in case of direct connect initiation
      setIsDeviceFormActive(true);
      setDeviceForm((prev) => ({
        ...prev,
        id:
          installedDevices.length > 0
            ? Math.max(...installedDevices.map((d) => d.id)) + 1
            : 1,
        country: storeForm.country,
        city: storeForm.city,
        token: esp32Token,
        allDayWork: storeForm.allDayOpen,
      }));
      setCurrentInstallingDevice(null);
      setDeviceFormErrors({});
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      setDialogTitle("Bluetooth Connection Error");
      setDialogMessage("Bluetooth connection error: " + error.message);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
    }
  };

  const handleSaveDevice = () => {
    let isValid = true;
    const newErrors = {};

    if (!bluetoothConnectedDevice && !currentInstallingDevice) {
      setDialogTitle("Device Connection Required");
      setDialogMessage(translations.en.stores.bluetoothNoDeviceSelected);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }

    const requiredDeviceFields = ["screenSize"];
    if (!deviceForm.allDayWork) {
      requiredDeviceFields.push("awakeTime", "sleepTime");
    }

    for (const field of requiredDeviceFields) {
      if (!deviceForm[field]) {
        isValid = false;
        newErrors[field] = translations.en.stores.requiredFieldWarning;
      }
    }

    const parsedId = parseInt(deviceForm.id);
    if (isNaN(parsedId)) {
      isValid = false;
      newErrors.id = translations.en.stores.invalidID;
    } else if (
      installedDevices.some(
        (d) =>
          d.id === parsedId && d.id !== (currentInstallingDevice?.id || null)
      )
    ) {
      isValid = false;
      newErrors.id = translations.en.stores.deviceIdExists;
    }
    setDeviceFormErrors(newErrors);

    if (!isValid) {
      const firstErrorField = Object.keys(newErrors)[0];
      if (firstErrorField) {
        document
          .getElementById(firstErrorField)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    const newInstalledDevice = { ...deviceForm, id: parsedId };
    setInstalledDevices((prev) => {
      let updatedDevices = [...prev];
      // If we are editing an existing device, remove its old version first
      if (currentInstallingDevice) {
        updatedDevices = updatedDevices.filter(
          (d) => d.id !== currentInstallingDevice.id
        );
      }
      // Add the new/updated device
      updatedDevices.push(newInstalledDevice);
      return updatedDevices;
    });

    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setBluetoothConnectedDevice(null);
    setDeviceForm({
      id:
        installedDevices.length > 0
          ? Math.max(...installedDevices.map((d) => d.id)) + 1
          : 1,
      country: storeForm.country,
      city: storeForm.city,
      token: esp32Token,
      allDayWork: storeForm.allDayOpen,
      awakeTime: "",
      sleepTime: "",
      productNameFontSize: 14,
      productPriceFontSizeBeforeDiscount: 14,
      productPriceFontSizeAfterDiscount: 14,
      productBarcodeFontSize: 14,
      productBarcodeNumbersFontSize: 14,
      screenSize: "",
    });
    setDeviceFormErrors({});

    const installedDevicesSection = document.getElementById(
      "installed-devices-section"
    );
    if (installedDevicesSection) {
      installedDevicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleRemoveDevice = (idToRemove) => {
    setInstalledDevices((prev) =>
      prev.filter((device) => device.id !== idToRemove)
    );
    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setBluetoothConnectedDevice(null);
    setDeviceForm({
      id:
        installedDevices.length > 0
          ? Math.max(...installedDevices.map((d) => d.id)) + 1
          : 1,
      country: storeForm.country,
      city: storeForm.city,
      token: esp32Token,
      allDayWork: storeForm.allDayOpen,
      awakeTime: "",
      sleepTime: "",
      productNameFontSize: 14,
      productPriceFontSizeBeforeDiscount: 14,
      productPriceFontSizeAfterDiscount: 14,
      productBarcodeFontSize: 14,
      productBarcodeNumbersFontSize: 14,
      screenSize: "",
    });
    setDeviceFormErrors({});

    const installedDevicesSection = document.getElementById(
      "installed-devices-section"
    );
    if (installedDevicesSection) {
      installedDevicesSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleEditDevice = (deviceToEdit) => {
    if (isDeviceFormActive) {
      // Check if another form is active
      setDialogTitle("Installation in Progress");
      setDialogMessage(translations.en.stores.currentInstallationWarning);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }
    setDeviceForm({ ...deviceToEdit });
    setIsDeviceFormActive(true); // Activate the form for editing
    setBluetoothConnectedDevice({ name: "ESP32" }); // Simulate connection for enabling fields
    setCurrentInstallingDevice(deviceToEdit); // Set the device being edited
    setDeviceFormErrors({});

    const newDeviceFormSection = document.getElementById(
      "new-device-form-section"
    );
    if (newDeviceFormSection) {
      newDeviceFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAddNewDevice = () => {
    if (isDeviceFormActive) {
      // Check if another form is active
      setDialogTitle("Installation in Progress");
      setDialogMessage(translations.en.stores.currentInstallationWarning);
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      setShowDialog(true);
      return;
    }
    setIsDeviceFormActive(true); // Activate the form for new device
    setBluetoothConnectedDevice(null); // No Bluetooth connected for new device initially
    setDeviceForm({
      id:
        installedDevices.length > 0
          ? Math.max(...installedDevices.map((d) => d.id)) + 1
          : 1,
      country: storeForm.country,
      city: storeForm.city,
      token: esp32Token,
      allDayWork: storeForm.allDayOpen,
      awakeTime: "",
      sleepTime: "",
      productNameFontSize: 14,
      productPriceFontSizeBeforeDiscount: 14,
      productPriceFontSizeAfterDiscount: 14,
      productBarcodeFontSize: 14,
      productBarcodeNumbersFontSize: 14,
      screenSize: "",
    });
    setCurrentInstallingDevice(null); // No current device being edited
    setDeviceFormErrors({});

    const newDeviceFormSection = document.getElementById(
      "new-device-form-section"
    );
    if (newDeviceFormSection) {
      newDeviceFormSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Step 5: Complete Installation
  const handleGetLogs = async () => {
    const mockLogs = [
      { id: 1, status: "Connected", refreshRate: "60Hz", batteryStatus: "85%" },
      {
        id: 2,
        status: "Disconnected",
        refreshRate: "0Hz",
        batteryStatus: "10%",
      },
      { id: 3, status: "Connected", refreshRate: "50Hz", batteryStatus: "60%" },
    ];
    setLogs(mockLogs);
  };

  const handleCompleteInstallation = () => {
    setDialogTitle(translations.en.stores.confirmCompletionTitle);
    setDialogMessage(translations.en.stores.confirmCompletionMessage);
    setDialogType("confirm");
    setDialogCallback(() => () => {
      // Callback for 'Yes'
      console.log("--- Installation Complete ---");
      console.log("Store Data:", storeForm);
      console.log("Server Token:", serverToken);
      console.log("ESP32 Token:", esp32Token);
      console.log("Installed Devices:", installedDevices);
      console.log("Logs (Mock):", logs);
      console.log("----------------------------");

      setStoreForm({
        country: "",
        city: "",
        storeName: "",
        addBranch: false,
        branchName: "",
        address: "",
        allDayOpen: false,
        openingHour: "09:00",
        closingHour: "18:00",
        ownerName: "",
        ownerSurname: "",
        installerName: "",
        installerSurname: "",
      });
      setServerToken("");
      setServerConnectionStatus("");
      setEsp32Token("");
      setInstalledDevices([]);
      setCurrentInstallingDevice(null);
      setBluetoothConnectedDevice(null);
      setDeviceForm({
        id: 1,
        country: "",
        city: "",
        token: "",
        allDayWork: false,
        awakeTime: "",
        sleepTime: "",
        productNameFontSize: 14,
        productPriceFontSizeBeforeDiscount: 14,
        productPriceFontSizeAfterDiscount: 14,
        productBarcodeFontSize: 14,
        productBarcodeNumbersFontSize: 14,
        screenSize: "",
      });
      setIsDeviceFormActive(false); // Reset form activity
      setLogs([]);
      setCurrentStep(1);
      setActiveRoute("/new-installation");
      setShowDialog(false); // Close dialog after action
    });
    setShowDialog(true);
  };

  // Custom Dialog Component (moved inside App to access states and colors directly)
  const CustomDialog = ({
    title,
    message,
    type,
    onConfirm,
    onCancel,
    onClose,
    colors,
  }) => {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div
          className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full"
          style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
          <h3
            className="text-lg font-semibold mb-4"
            style={{ color: colors.darkText }}>
            {title}
          </h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            {type === "confirm" && (
              <button
                onClick={onCancel}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                style={{ backgroundColor: colors.prevButtonBg }}>
                No
              </button>
            )}
            <button
              onClick={type === "confirm" ? onConfirm : onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              style={{ backgroundColor: colors.logoSecondaryBlue }}>
              {type === "confirm" ? "Yes" : "OK"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Ana içerik bileşenini aktif rotaya göre döndüren fonksiyon
  const renderMainContent = () => {
    const currentTranslations = translations.en;

    if (activeRoute === "/new-installation") {
      return (
        <div className="flex flex-col h-full min-h-0">
          {/* Progress Bar */}
          <div className="flex justify-center items-center my-8 space-x-4">
            {steps.map((stepDef) => (
              <React.Fragment key={stepDef.id}>
                <StepIcon
                  stepNumber={stepDef.id}
                  current={currentStep === stepDef.id}
                  completed={currentStep > stepDef.id}
                  colors={colors}
                />
                {stepDef.id < steps.length && (
                  <div
                    className={`h-0.5 w-8 transition-all duration-300 ease-in-out`}
                    style={{
                      backgroundColor:
                        currentStep > stepDef.id
                          ? colors?.progressBarActive
                          : colors?.progressBarLine,
                    }}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Dinamik olarak seçilen adım bileşenini render et */}
          <div className="flex-1 p-4 overflow-y-auto">
            {CurrentStepComponent && (
              <CurrentStepComponent
                // App.js'teki tüm gerekli state ve setter'ları prop olarak iletiyoruz
                storeForm={storeForm}
                setStoreForm={setStoreForm}
                citiesOptions={citiesOptions}
                setCitiesOptions={setCitiesOptions}
                countryOptions={countryOptions}
                serverToken={serverToken}
                setServerToken={setServerToken}
                serverConnectionStatus={serverConnectionStatus}
                setServerConnectionStatus={setServerConnectionStatus}
                esp32Token={esp32Token}
                setEsp32Token={setEsp32Token}
                installedDevices={installedDevices}
                setInstalledDevices={setInstalledDevices}
                currentInstallingDevice={currentInstallingDevice}
                setCurrentInstallingDevice={setCurrentInstallingDevice}
                bluetoothConnectedDevice={bluetoothConnectedDevice}
                setBluetoothConnectedDevice={setBluetoothConnectedDevice}
                deviceForm={deviceForm}
                setDeviceForm={setDeviceForm}
                isDeviceFormActive={isDeviceFormActive}
                setIsDeviceFormActive={setIsDeviceFormActive}
                fontSizes={fontSizes}
                screenSizes={screenSizes}
                deviceFormErrors={deviceFormErrors}
                setDeviceFormErrors={setDeviceFormErrors}
                logs={logs}
                setLogs={setLogs}
                colors={colors}
                translations={translations.en.stores} // Sadece stores çevirilerini gönderiyoruz
                timeOptions={timeOptions}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
                // Custom Dialog props
                setShowDialog={setShowDialog}
                setDialogTitle={setDialogTitle}
                setDialogMessage={setDialogMessage}
                setDialogType={setDialogType}
                setDialogCallback={setDialogCallback}
                // Eylem fonksiyonlarını prop olarak iletiyoruz
                onNext={nextStep}
                onBack={prevStep}
                handleStoreFormChange={handleStoreFormChange}
                handleDeviceFormChange={handleDeviceFormChange}
                handleGenerateServerToken={handleGenerateServerToken}
                // handleCopyServerToken removed from props
                handleCheckConnection={handleCheckConnection}
                handleGenerateEsp32Token={handleGenerateEsp32Token}
                handleBluetoothConnect={handleBluetoothConnect}
                handleSaveDevice={handleSaveDevice}
                handleRemoveDevice={handleRemoveDevice}
                handleEditDevice={handleEditDevice}
                handleAddNewDevice={handleAddNewDevice}
                handleGetLogs={handleGetLogs}
                handleCompleteInstallation={handleCompleteInstallation}
              />
            )}
          </div>
        </div>
      );
    } else if (activeRoute === "/") {
      return (
        <div
          className="p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.pureWhite,
            color: colors.darkText,
          }}>
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: colors.darkText }}>
            {currentTranslations.dashboard.title}
          </h1>
          <p className="mb-4">{currentTranslations.dashboard.welcomeText}</p>
          <p className="mb-4">
            {currentTranslations.dashboard.instructionText}
          </p>
          <p
            className="text-sm italic"
            style={{ color: colors.mediumGrayText }}>
            {currentTranslations.dashboard.note}
          </p>
        </div>
      );
    } else if (activeRoute === "/stores") {
      return (
        <div
          className="p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.pureWhite,
            color: colors.darkText,
          }}>
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: colors.darkText }}>
            {currentTranslations.stores.title}
          </h1>
          <p className="mb-4">{currentTranslations.stores.futureFeatures}</p>
        </div>
      );
    } else if (activeRoute === "/firmware") {
      return (
        <div
          className="p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.pureWhite,
            color: colors.darkText,
          }}>
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: colors.darkText }}>
            {currentTranslations.firmware.title}
          </h1>
          <p className="mb-4">{currentTranslations.firmware.introText}</p>
          <p className="mb-4">{currentTranslations.firmware.instructionText}</p>
          <p className="mb-4">{currentTranslations.firmware.futureFeatures}</p>
        </div>
      );
    } else if (activeRoute === "/users") {
      return (
        <div
          className="p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.pureWhite,
            color: colors.darkText,
          }}>
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: colors.darkText }}>
            {currentTranslations.users.title}
          </h1>
          <p className="mb-4">{currentTranslations.users.introText}</p>
          <p className="mb-4">{currentTranslations.users.instructionText}</p>
          <p className="mb-4">{currentTranslations.users.futureFeatures}</p>
        </div>
      );
    } else {
      return (
        <div
          className="p-8 rounded-lg shadow-md"
          style={{
            backgroundColor: colors.pureWhite,
            color: colors.darkText,
          }}>
          <h1
            className="text-3xl font-semibold mb-6"
            style={{ color: colors.darkText }}>
            {currentTranslations.dashboard.title}
          </h1>
          <p>{currentTranslations.dashboard.welcomeText}</p>
        </div>
      );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.lightGrayBg }}>
      {/* Header (Üst Bar) */}
      <header
        className="flex items-center p-4 shadow-md z-30 fixed w-full top-0 left-0"
        style={{ backgroundColor: colors.headerSidebarBg }}>
        {/* Sidebar Toggle Button (Yan Menü Aç/Kapat Butonu) */}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 transition-colors duration-200 cursor-pointer">
          {isSidebarExpanded ? (
            <X size={24} style={{ color: colors.whiteText }} />
          ) : (
            <Menu size={24} style={{ color: colors.whiteText }} />
          )}{" "}
        </button>

        {/* Logo Merkezi */}
        <div className="flex-grow flex justify-center">
          <img
            src={logoPlaceholderUrl}
            alt="EilSense.io Logo"
            className="h-10 w-auto rounded-md"
          />
        </div>

        {/* Profil ve Tema Butonu */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="relative text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 cursor-pointer">
            <Sun
              size={24}
              style={{ color: colors.whiteText }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
            <Moon
              size={24}
              style={{ color: colors.whiteText }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
          </button>
          <img
            src="https://placehold.co/40x40/c2c2c2/FFFFFF/png?text=JD" // Yer tutucu profil fotoğrafı
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span
            className="font-medium hidden sm:block"
            style={{ color: colors.whiteText }}>
            {translations.en.profile.userName}
          </span>
        </div>
      </header>

      {/* Ana İçerik ve Yan Menü Konteyneri */}
      <div className="flex flex-1" style={{ paddingTop: "64px" }}>
        {/* Yan Menü */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out z-20 flex flex-col`}
          style={{
            backgroundColor: colors.headerSidebarBg,
            width: isSidebarExpanded ? "250px" : "77px",
          }}>
          <nav className="flex-grow">
            <ul className="space-y-2 py-4">
              {navItems.map((item) => (
                <li key={item.route}>
                  <a
                    href="/"
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveRoute(item.route);
                    }}
                    className={`flex items-center rounded-lg font-medium transition-colors duration-200 cursor-pointer
                      ${
                        isSidebarExpanded
                          ? "py-2 px-3"
                          : "py-2 px-2 justify-center"
                      }
                      ${activeRoute === item.route ? "mx-2" : ""}
                    `}
                    style={{
                      backgroundColor:
                        activeRoute === item.route
                          ? colors.logoPrimaryBlue
                          : "transparent",
                      color: colors.whiteText,
                    }}>
                    <item.icon size={20} style={{ color: colors.whiteText }} />
                    <span
                      className={`ml-3 overflow-hidden whitespace-nowrap ${
                        !isSidebarExpanded && "hidden"
                      }`}>
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Dil Seçimi */}
          <div
            className={`w-full ${
              isSidebarExpanded ? "px-3 pb-4" : "pb-4 flex justify-center"
            }`}>
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none cursor-pointer
                ${
                  isSidebarExpanded
                    ? "w-full py-2 px-3 text-left"
                    : "w-16 py-2 text-center text-sm"
                }
              `}
              style={{
                backgroundColor: colors.headerSidebarBg,
                color: colors.whiteText,
                borderColor: colors.mediumGrayText,
              }}>
              <option value="en">{isSidebarExpanded ? "English" : "en"}</option>
              <option value="tr">{isSidebarExpanded ? "Türkçe" : "tr"}</option>
              <option value="ru">{isSidebarExpanded ? "Русский" : "ru"}</option>
              <option value="pl">{isSidebarExpanded ? "Polski" : "pl"}</option>
            </select>
          </div>
        </aside>
        {/* İçerik Alanı */}
        <main
          className="flex-1 p-6 transition-all duration-300 ease-in-out overflow-x-hidden overflow-y-auto"
          style={{
            marginLeft: isSidebarExpanded ? "250px" : "77px",
            paddingTop: "24px",
            backgroundColor: colors.lightGrayBg,
            color: colors.darkText,
          }}>
          {renderMainContent()}
        </main>
      </div>

      {/* Altbilgi */}
      <footer
        className="w-full p-6 text-center text-sm leading-relaxed"
        style={{
          backgroundColor: colors.headerSidebarBg,
          color: colors.whiteText,
        }}>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} EilSense.io.{" "}
          {translations.en.footer.rights}
        </p>
        <p className="mb-2">{translations.en.footer.address}</p>
        <p className="mb-2">
          {translations.en.footer.email} info@eilsense.io |{" "}
          {translations.en.footer.phone} +90 555 123 45 67
        </p>
        <p>
          <a
            href="/privacy-policy"
            className="underline hover:text-gray-300 mx-2">
            {translations.en.footer.privacy}
          </a>{" "}
          |
          <a
            href="/terms-of-use"
            className="underline hover:text-gray-300 mx-2">
            {translations.en.footer.terms}
          </a>
        </p>
      </footer>

      {showDialog && (
        <CustomDialog
          title={dialogTitle}
          message={dialogMessage}
          type={dialogType}
          onConfirm={dialogCallback}
          onCancel={() => setShowDialog(false)}
          onClose={() => setShowDialog(false)}
          colors={colors}
        />
      )}
    </div>
  );
}

export default App;
