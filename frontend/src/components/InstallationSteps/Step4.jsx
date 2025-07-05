// src/components/InstallationSteps/Step4.jsx

import React, { useState, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import DeviceList from "./Step4Details/DeviceList";
import DeviceForm from "./Step4Details/DeviceForm";

const SCREEN_SIZES = ["130cm", "110cm", "80cm"];

const initialDeviceFormState = {
  id: 0,
  isEditing: false,
  screenSize: "",
  allDayWork: false,
  awakeTime: "09:00",
  sleepTime: "21:00",
  wifi_ssid: "",
  wifi_password: "",
  productNameFontSize: 12,
  productPriceFontSizeBeforeDiscount: 12,
  productPriceFontSizeAfterDiscount: 12,
  productBarcodeFontSize: 12,
  productBarcodeNumbersFontSize: 12,
};

const Step4 = ({
  wizardData,
  updateWizardData,
  onNext,
  onBack,
  displayDialog,
  timeOptions,
}) => {
  const { currentColors, appTranslations, language } = useAuth();
  const [fontSizes] = useState(Array.from({ length: 33 }, (_, i) => i + 8));

  const [devices, setDevices] = useState(wizardData.devices || []);
  const [isFormActive, setIsFormActive] = useState(false);
  const [activeForm, setActiveForm] = useState(initialDeviceFormState);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading] = useState(false);
  const [editingOriginalId, setEditingOriginalId] = useState(null);

  // Translation comes from translations.js with useMemo
  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );
  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  const handleEdit = (device) => {
    setEditingOriginalId(device.id);
    setActiveForm({ ...device, isEditing: true });
    setIsFormActive(true);
  };

  const handleAddNew = () => {
    setEditingOriginalId(null);
    const maxId = devices.reduce(
      (max, d) => Math.max(max, parseInt(d.id, 10) || 0),
      0
    );
    setActiveForm({
      ...initialDeviceFormState,
      id: maxId + 1,
      isEditing: false,
    });
    setIsFormActive(true);
  };

  const handleIpAddressChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".");
    updateWizardData({ server_local_ip: value });
  };

  const handleCancel = () => {
    setIsFormActive(false);
    setFormErrors({});
  };

  const handleDelete = (deviceId) => {
    setDevices((prev) => prev.filter((d) => d.id !== deviceId));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setActiveForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateDeviceForm = () => {
    const errors = {};

    const idValue = Number(activeForm.id);

    if (!activeForm.id) errors.id = wizardTranslations.idRequired;
    else if (!Number.isInteger(idValue) || idValue <= 0) {
      errors.id = wizardTranslations.idMustBePositive;
    }

    const isIdInUse = devices.some((device) => {
      if (activeForm.isEditing) {
        return (
          String(device.id) === String(activeForm.id) &&
          String(device.id) !== String(editingOriginalId)
        );
      }

      return String(device.id) === String(activeForm.id);
    });

    if (isIdInUse) {
      errors.id = wizardTranslations.idInUse;
    }

    if (!activeForm.screenSize)
      errors.screenSize = wizardTranslations.screenSizeRequired;

    if (!activeForm.wifi_ssid)
      errors.wifi_ssid = wizardTranslations.wifiSsidRequired;

    if (!activeForm.wifi_password)
      errors.wifi_password = wizardTranslations.wifiPasswordRequired;

    if (!activeForm.allDayWork) {
      if (!activeForm.awakeTime)
        errors.awakeTime = wizardTranslations.awakeTimeRequired;

      if (!activeForm.sleepTime)
        errors.sleepTime = wizardTranslations.sleepTimeRequired;
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };
  const handleSaveAndUpload = () => {
    if (!validateDeviceForm()) return;
    setDevices((prevDevices) => {
      const deviceToSave = { ...activeForm, isEditing: false };
      const isEditingDevice = prevDevices.some(
        (d) => d.id === editingOriginalId
      );
      if (isEditingDevice) {
        return prevDevices.map((d) =>
          d.id === editingOriginalId ? deviceToSave : d
        );
      } else {
        return [...prevDevices, deviceToSave].sort((a, b) => a.id - b.id);
      }
    });
    setIsFormActive(false);
    setEditingOriginalId(null);
  };

  const handleProceedToNextStep = () => {
    if (isFormActive) {
      displayDialog(
        wizardTranslations.unsavedChangesTitle,
        wizardTranslations.unsavedChangesMessage
      );
      return;
    }
    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (
      !wizardData.server_local_ip ||
      !ipPattern.test(wizardData.server_local_ip)
    ) {
      displayDialog(
        wizardTranslations.validationErrorTitle,
        wizardTranslations.validationErrorMessage
      );
      return;
    }
    if (devices.length === 0) {
      displayDialog(
        wizardTranslations.warningTitle,
        wizardTranslations.noDevicesWarning
      );
      return;
    }

    // Just send the data to the parent component, let it handle the API call.
    onNext({
      devices: devices,
      server_local_ip: wizardData.server_local_ip,
    });
  };

  const inputStyle = {
    backgroundColor: currentColors.pureWhite,
    color: currentColors.darkText,
    borderColor: currentColors.mediumGrayText,
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-4xl mx-auto"
      style={{ backgroundColor: currentColors?.pureWhite }}>
      <h2
        className="text-xl font-semibold mb-6"
        style={{ color: currentColors?.darkText }}>
        {wizardTranslations.step4Title}
      </h2>
      <div className="mb-6">
        <label
          className="block text-sm font-bold mb-1"
          style={{ color: currentColors?.darkText }}>
          {wizardTranslations.serverIpLabel}
        </label>
        <input
          type="text"
          id="server_local_ip"
          name="server_local_ip"
          value={wizardData.server_local_ip || ""}
          onChange={handleIpAddressChange}
          className="w-full p-2 border rounded-md"
          style={{ ...inputStyle }}
          placeholder="192.168.1.100"
          maxLength="15"
        />
      </div>
      <div className="mb-6">
        <h3
          className="text-lg font-semibold mb-4"
          style={{ color: currentColors?.darkText }}>
          {wizardTranslations.installedDevicesTitle}
        </h3>
        <DeviceList
          devices={devices}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
      {!isFormActive ? (
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={handleAddNew}
            disabled={isLoading}
            className={`font-bold py-2 px-4 rounded-md transition-all ${
              isLoading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}>
            {storesTranslations.addNewDeviceButton}
          </button>
        </div>
      ) : (
        <DeviceForm
          form={activeForm}
          isEditing={activeForm.isEditing}
          onFormChange={handleFormChange}
          onSave={handleSaveAndUpload}
          onCancel={handleCancel}
          errors={formErrors}
          colors={currentColors}
          wizardData={wizardData}
          readOnlyData={{
            country: wizardData.country,
            city: wizardData.city,
            esp32Token: wizardData.esp32_token,
          }}
          options={{
            screenSizes: SCREEN_SIZES,
            timeOptions: timeOptions,
            fontSizes: fontSizes,
          }}
        />
      )}
      <div className="flex justify-between mt-8 border-t pt-4 border-gray-200 dark:border-gray-600">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className={`font-bold py-2 px-6 rounded-md transition-all ${
            isLoading
              ? "bg-gray-400"
              : "bg-gray-500 hover:bg-gray-600 text-white"
          }`}>
          {storesTranslations.previousButton}
        </button>
        <button
          type="button"
          onClick={handleProceedToNextStep}
          disabled={isLoading}
          className={`font-bold py-2 px-6 rounded-md flex items-center transition-all ${
            isLoading
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}>
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {commonTranslations.updatingText}
            </>
          ) : (
            storesTranslations.nextButton
          )}
        </button>
      </div>
    </div>
  );
};

export default Step4;
