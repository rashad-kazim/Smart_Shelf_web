// src/components/InstallationSteps/Step4.jsx
import React, { useRef } from "react";
import { Bluetooth, ChevronDown } from "lucide-react";

const Step4 = ({
  installedDevices,
  currentInstallingDevice,
  bluetoothConnectedDevice,
  deviceForm,
  isDeviceFormActive,
  fontSizes,
  screenSizes,
  deviceFormErrors,
  colors,
  translations,
  timeOptions,
  onNext,
  onBack,
  handleBluetoothConnect,
  handleSaveDevice,
  handleRemoveDevice,
  handleEditDevice,
  handleAddNewDevice,
  handleDeviceFormChange,
  setShowDialog,
  setDialogTitle,
  setDialogMessage,
  setDialogType,
  setDialogCallback,
}) => {
  const newDeviceFormSectionRef = useRef(null);
  const installedDevicesSectionRef = useRef(null);
  // REQUEST 1: Prevent proceeding to step 5 when the device form is active
  const handleNextClick = () => {
    if (isDeviceFormActive) {
      setShowDialog(true);
      setDialogTitle(
        translations.currentInstallationWarningTitle || "Action Required"
      );
      setDialogMessage(
        translations.currentInstallationWarningMsg ||
          "Please save or cancel the current device form."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }

    // İSTEK 3: En az bir cihaz eklenmeden 5. adıma geçmeyi engelle
    if (installedDevices.length === 0) {
      setShowDialog(true);
      setDialogTitle(translations.noDevicesProceedTitle || "Cannot Proceed");
      setDialogMessage(
        translations.noDevicesProceedMsg ||
          "Please install at least one device before proceeding."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
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
        {translations?.step4Title || "Device Installation"}
      </h2>

      <div
        id="installed-devices-section"
        ref={installedDevicesSectionRef}
        className="mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors?.darkText }}>
          {translations?.installedDevicesTitle || "Installed Devices"}
        </h3>
        {installedDevices.length === 0 ? (
          <p
            className="text-gray-600"
            style={{ color: colors?.mediumGrayText }}>
            {translations?.noDevicesYet || "No devices installed yet."}
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
                  ID: {device.id} - Screen: {device.screenSize}
                </span>
                <button
                  onClick={() => handleEditDeviceClick(device)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-bold py-1 px-3 rounded-md">
                  {translations?.editButton || "Edit"}
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
            className="text-lg font-semibold mb-2 col-span-full"
            style={{ color: colors?.darkText }}>
            {currentInstallingDevice
              ? `${translations?.editDeviceTitle || "Edit Device"} ID: ${
                  currentInstallingDevice.id
                }`
              : translations?.newDeviceTitle || "New Device Installation"}
          </h3>

          <div className="col-span-full text-center mb-4">
            <button
              onClick={handleBluetoothConnect}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-4 rounded-md flex items-center justify-center border-2 border-blue-700 transition-colors duration-200 shadow-lg ${
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
              <span>
                {translations?.bluetoothConnectButton ||
                  "Connect via Bluetooth"}
              </span>
            </button>
            {bluetoothConnectedDevice && (
              <p
                className="mt-2 text-green-600"
                style={{ color: colors?.successGreen }}>
                Connected to {bluetoothConnectedDevice.name}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label htmlFor="id" className="block text-sm font-bold mb-2">
              {translations?.idLabel || "ID"}
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={deviceForm.id}
              onChange={handleDeviceFormChange}
              className={`select-none disabled shadow appearance-none border rounded-md w-full py-2 px-3 ${
                deviceFormErrors.id ? "border-red-500" : ""
              }`}
              style={{
                backgroundColor: colors?.pureWhite,
                color: colors?.darkText,
                borderColor: colors?.mediumGrayText,
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

          <div className="col-span-full mb-2 flex items-center">
            <input
              type="checkbox"
              id="allDayWork"
              name="allDayWork"
              checked={deviceForm.allDayWork}
              onChange={handleDeviceFormChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="allDayWork"
              className="text-sm cursor-pointer select-none"
              style={{ color: colors?.darkText }}>
              {translations?.allDayWorkLabel || "All Day Work"}
            </label>
          </div>

          <div className="col-span-1">
            <label htmlFor="awakeTime" className="block text-sm font-bold mb-2">
              {translations?.awakeTimeLabel || "Awake Time"}{" "}
              {!deviceForm.allDayWork && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="relative">
              <select
                id="awakeTime"
                name="awakeTime"
                value={deviceForm.awakeTime}
                onChange={handleDeviceFormChange}
                disabled={deviceForm.allDayWork}
                className={`cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 ${
                  deviceFormErrors.awakeTime ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: deviceForm.allDayWork
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">
                  {translations?.selectHour || "Select Time"}
                </option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            {deviceFormErrors.awakeTime && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.awakeTime}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label htmlFor="sleepTime" className="block text-sm font-bold mb-2">
              {translations?.sleepTimeLabel || "Sleep Time"}{" "}
              {!deviceForm.allDayWork && (
                <span className="text-red-500">*</span>
              )}
            </label>
            <div className="relative">
              <select
                id="sleepTime"
                name="sleepTime"
                value={deviceForm.sleepTime}
                onChange={handleDeviceFormChange}
                disabled={deviceForm.allDayWork}
                className={`cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 ${
                  deviceFormErrors.sleepTime ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: deviceForm.allDayWork
                    ? colors?.lightGrayBg
                    : colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                }}>
                <option value="">
                  {translations?.selectHour || "Select Time"}
                </option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            {deviceFormErrors.sleepTime && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.sleepTime}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="screenSize"
              className="block text-sm font-bold mb-2">
              {translations?.screenSizeLabel || "Screen Size"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="screenSize"
                name="screenSize"
                value={deviceForm.screenSize}
                onChange={handleDeviceFormChange}
                className={`cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 ${
                  deviceFormErrors.screenSize ? "border-red-500" : ""
                }`}
                style={{
                  backgroundColor: colors?.pureWhite,
                  color: colors?.darkText,
                  borderColor: colors?.mediumGrayText,
                  cursor: "pointer",
                }}>
                <option value="">
                  {translations?.selectScreenSize || "Select Screen Size"}
                </option>
                {screenSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            {deviceFormErrors.screenSize && (
              <p className="text-red-500 text-xs italic mt-1">
                {deviceFormErrors.screenSize}
              </p>
            )}
          </div>

          {/* Font size selectors */}
          <div className="col-span-1">
            <label
              htmlFor="productNameFontSize"
              className=" block text-gray-700 text-sm font-bold mb-2"
              style={{ color: colors?.darkText }}>
              {translations?.productNameFontSizeLabel ||
                "Product Name Font-Size"}
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
                className="cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              {translations?.productPriceFontSizeBeforeDiscountLabel ||
                "Product Price Font-Size (Before Discount)"}
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
                className="cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              {translations?.productPriceFontSizeAfterDiscountLabel ||
                "Product Price Font-Size (After Discount)"}
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
                className="cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              {translations?.productBarcodeFontSizeLabel ||
                "Product Barcode Font-Size"}
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
                className="cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
              {translations?.productBarcodeNumbersFontSizeLabel ||
                "Product Barcode Numbers Font-Size"}
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
                className="cursor-pointer shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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

          <div className="flex justify-between mt-6 col-span-full">
            {currentInstallingDevice && (
              <button
                onClick={() => handleRemoveDevice(currentInstallingDevice.id)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md">
                {translations?.removeDeviceButton || "Remove"}
              </button>
            )}
            <button
              onClick={handleSaveDevice}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md ml-auto">
              {translations?.saveButton || "Save"}
            </button>
          </div>
        </div>
      )}

      {!isDeviceFormActive && (
        <div className="mb-6 mt-6">
          <button
            onClick={handleAddNewDeviceClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md mx-auto block">
            {translations?.addNewDeviceButton || "Add New Device"}
          </button>
        </div>
      )}

      <div className="flex justify-between p-4 bg-transparent mt-4">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: colors?.prevButtonBg }}>
          {translations?.previousButton || "Previous"}
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md"
          style={{ backgroundColor: colors?.nextButtonBg }}>
          {translations?.nextButton || "Next"}
        </button>
      </div>
    </div>
  );
};

export default Step4;
