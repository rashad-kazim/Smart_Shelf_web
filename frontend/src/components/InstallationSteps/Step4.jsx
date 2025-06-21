// src/components/InstallationSteps/Step4.jsx
import React, { useRef } from "react";
import { Bluetooth, ChevronDown, Edit, Trash2 } from "lucide-react";

const Step4 = (props) => {
  const {
    installedDevices,
    currentInstallingDevice,
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
    handleAddNewDevice,
    handleEditDevice,
    handleSaveDevice,
    handleDeleteDevice,
    handleCancelDeviceForm,
    handleDeviceFormChange,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    bluetoothConnectedDevice,
    handleBluetoothConnect,
    storeForm,
    esp32Token,
  } = props;

  const newDeviceFormSectionRef = useRef(null);

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

  const handleAddNewDeviceClick = () => {
    handleAddNewDevice();
    setTimeout(
      () =>
        newDeviceFormSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      100
    );
  };

  // Styles for input fields
  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };

  const readOnlyInputStyle = {
    backgroundColor: colors.lightGrayBg,
    color: colors.mediumGrayText,
    borderColor: colors.mediumGrayText,
    cursor: "default",
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-4xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite }}>
      <h2
        className="text-xl font-semibold mb-6"
        style={{ color: colors?.darkText }}>
        {translations?.step4Title || "Device Installation"}
      </h2>

      <div className="mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: colors?.darkText }}>
          {translations?.installedDevicesTitle || "Installed Devices"}
        </h3>
        {installedDevices.length === 0 ? (
          <p style={{ color: colors?.mediumGrayText }}>
            {translations?.noDevicesYet || "No devices installed yet."}
          </p>
        ) : (
          <ul className="space-y-2">
            {installedDevices.map((device) => (
              <li
                key={device.id}
                className="flex justify-between items-center p-3 rounded-md"
                style={{ backgroundColor: colors?.lightGrayBg }}>
                <span style={{ color: colors?.darkText }}>
                  ID: {device.id} - Screen: {device.screenSize}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleEditDevice(device)}
                    className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                  {/* REQUEST 8: Delete button added to the list */}
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="p-1 text-red-600 hover:text-red-800">
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {isDeviceFormActive ? (
        <div
          ref={newDeviceFormSectionRef}
          className="border-t-2 border-dashed pt-6 mt-6"
          style={{ borderColor: colors.mediumGrayText }}>
          <h3
            className="text-lg font-semibold mb-4 col-span-full"
            style={{ color: colors.darkText }}>
            {currentInstallingDevice
              ? `${translations?.editDeviceTitle || "Edit Device"} ID: ${
                  currentInstallingDevice.id
                }`
              : translations?.newDeviceTitle || "New Device Installation"}
          </h3>

          {!currentInstallingDevice && (
            <div className="col-span-full text-center mb-4">
              <button
                onClick={handleBluetoothConnect}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold w-full py-3 rounded-md flex items-center justify-center transition-colors shadow-lg ${
                  bluetoothConnectedDevice
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={!!bluetoothConnectedDevice}>
                <Bluetooth size={24} className="mr-2" />
                <span>
                  {translations?.bluetoothConnectButton ||
                    "Connect via Bluetooth"}
                </span>
              </button>
              {bluetoothConnectedDevice && (
                <p className="mt-2" style={{ color: colors?.successGreen }}>
                  Connected to {bluetoothConnectedDevice.name}
                </p>
              )}
            </div>
          )}

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
              <div>
                <label htmlFor="id" className="block text-sm font-bold mb-1">
                  {translations?.idLabel || "ID"}*
                </label>
                <input
                  type="number"
                  id="id"
                  name="id"
                  value={deviceForm.id}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md ${
                    deviceFormErrors.id ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: deviceFormErrors.id
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}
                />
                {deviceFormErrors.id && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.id}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  {translations?.countryLabel || "Country"}
                </label>
                <input
                  type="text"
                  value={storeForm.country}
                  readOnly
                  className="w-full p-2 border rounded-md"
                  style={readOnlyInputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  {translations?.cityLabel || "City"}
                </label>
                <input
                  type="text"
                  value={storeForm.city}
                  readOnly
                  className="w-full p-2 border rounded-md"
                  style={readOnlyInputStyle}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">
                  {translations?.tokenLabel || "ESP32 Token"}
                </label>
                <input
                  type="text"
                  value={esp32Token}
                  readOnly
                  className="w-full p-2 border rounded-md"
                  style={readOnlyInputStyle}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
              <div className="md:col-span-2 relative">
                <label
                  htmlFor="screenSize"
                  className="block text-sm font-bold mb-1">
                  {translations?.screenSizeLabel || "Screen Size"}*
                </label>
                <select
                  id="screenSize"
                  name="screenSize"
                  value={deviceForm.screenSize}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    deviceFormErrors.screenSize ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: deviceFormErrors.screenSize
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}>
                  <option value="">
                    {translations?.selectScreenSize || "Select..."}
                  </option>
                  {(screenSizes || []).map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-500 pointer-events-none"
                  size={18}
                />
                {deviceFormErrors.screenSize && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.screenSize}
                  </p>
                )}
              </div>
              <div className="md:col-span-2 flex items-end pb-1">
                <input
                  type="checkbox"
                  id="allDayWork"
                  name="allDayWork"
                  checked={deviceForm.allDayWork}
                  onChange={handleDeviceFormChange}
                  className="mr-2 h-4 w-4"
                  style={{ ...inputStyle, borderColor: colors.mediumGrayText }}
                />
                <label
                  htmlFor="allDayWork"
                  className="select-none cursor-pointer">
                  {translations?.allDayWorkLabel || "All Day Work"}
                </label>
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="awakeTime"
                  className="block text-sm font-bold mb-1">
                  {translations?.awakeTimeLabel || "Awake Time"}
                  {!deviceForm.allDayWork && "*"}
                </label>
                <select
                  id="awakeTime"
                  name="awakeTime"
                  value={deviceForm.awakeTime}
                  disabled={deviceForm.allDayWork}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    deviceFormErrors.awakeTime ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    backgroundColor: deviceForm.allDayWork
                      ? colors.lightGrayBg
                      : colors.pureWhite,
                    borderColor: deviceFormErrors.awakeTime
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}>
                  <option value="">
                    {translations?.selectHour || "Select Time"}
                  </option>
                  {(timeOptions || []).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {deviceFormErrors.awakeTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.awakeTime}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="sleepTime"
                  className="block text-sm font-bold mb-1">
                  {translations?.sleepTimeLabel || "Sleep Time"}
                  {!deviceForm.allDayWork && "*"}
                </label>
                <select
                  id="sleepTime"
                  name="sleepTime"
                  value={deviceForm.sleepTime}
                  disabled={deviceForm.allDayWork}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md appearance-none ${
                    deviceFormErrors.sleepTime ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    backgroundColor: deviceForm.allDayWork
                      ? colors.lightGrayBg
                      : colors.pureWhite,
                    borderColor: deviceFormErrors.sleepTime
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}>
                  <option value="">
                    {translations?.selectHour || "Select Time"}
                  </option>
                  {(timeOptions || []).map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {deviceFormErrors.sleepTime && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.sleepTime}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="wifi_ssid"
                  className="block text-sm font-bold mb-1">
                  {translations?.wifiSsidLabel || "WIFI SSID"}*
                </label>
                <input
                  type="text"
                  id="wifi_ssid"
                  name="wifi_ssid"
                  value={deviceForm.wifi_ssid || ""}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md ${
                    deviceFormErrors.wifi_ssid ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: deviceFormErrors.wifi_ssid
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}
                />
                {deviceFormErrors.wifi_ssid && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.wifi_ssid}
                  </p>
                )}
              </div>
              <div className="md:col-span-2">
                <label
                  htmlFor="wifi_password"
                  className="block text-sm font-bold mb-1">
                  {translations?.wifiPasswordLabel || "WIFI Password"}*
                </label>
                <input
                  type="text"
                  id="wifi_password"
                  name="wifi_password"
                  value={deviceForm.wifi_password || ""}
                  onChange={handleDeviceFormChange}
                  className={`w-full p-2 border rounded-md ${
                    deviceFormErrors.wifi_password ? "border-red-500" : ""
                  }`}
                  style={{
                    ...inputStyle,
                    borderColor: deviceFormErrors.wifi_password
                      ? colors.errorRed
                      : colors.mediumGrayText,
                  }}
                />
                {deviceFormErrors.wifi_password && (
                  <p className="text-red-500 text-xs mt-1">
                    {deviceFormErrors.wifi_password}
                  </p>
                )}
              </div>
            </div>
            <div
              className="border-t pt-4 mt-4"
              style={{ borderColor: colors.mediumGrayText }}>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {translations?.productNameFontSizeLabel}
                  </label>
                  <select
                    name="productNameFontSize"
                    value={deviceForm.productNameFontSize}
                    onChange={handleDeviceFormChange}
                    className="w-full p-2 border rounded-md"
                    style={inputStyle}>
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {translations?.productPriceFontSizeBeforeDiscountLabel}
                  </label>
                  <select
                    name="productPriceFontSizeBeforeDiscount"
                    value={deviceForm.productPriceFontSizeBeforeDiscount}
                    onChange={handleDeviceFormChange}
                    className="w-full p-2 border rounded-md"
                    style={inputStyle}>
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1">
                    {translations?.productPriceFontSizeAfterDiscountLabel}
                  </label>
                  <select
                    name="productPriceFontSizeAfterDiscount"
                    value={deviceForm.productPriceFontSizeAfterDiscount}
                    onChange={handleDeviceFormChange}
                    className="w-full p-2 border rounded-md"
                    style={inputStyle}>
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-bold mb-1">
                    {translations?.productBarcodeFontSizeLabel}
                  </label>
                  <select
                    name="productBarcodeFontSize"
                    value={deviceForm.productBarcodeFontSize}
                    onChange={handleDeviceFormChange}
                    className="w-full p-2 border rounded-md"
                    style={inputStyle}>
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold mb-1">
                    {translations?.productBarcodeNumbersFontSizeLabel}
                  </label>
                  <select
                    name="productBarcodeNumbersFontSize"
                    value={deviceForm.productBarcodeNumbersFontSize}
                    onChange={handleDeviceFormChange}
                    className="w-full p-2 border rounded-md"
                    style={inputStyle}>
                    {fontSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}px
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-between mt-6">
            <button
              onClick={handleCancelDeviceForm}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md">
              {translations?.cancelButton || "Cancel"}
            </button>
            <button
              onClick={handleSaveDevice}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md">
              {translations?.saveButton || "Save"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center mt-6">
          <button
            onClick={handleAddNewDeviceClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
            {translations?.addNewDeviceButton || "Add New Device"}
          </button>
        </div>
      )}
      <div
        className="flex justify-between mt-8 border-t pt-4"
        style={{ borderColor: colors.mediumGrayText }}>
        <button
          onClick={onBack}
          className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-md">
          Previous
        </button>
        <button
          onClick={handleNextClick}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md">
          Next
        </button>
      </div>
    </div>
  );
};

export default Step4;
