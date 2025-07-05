// src/pages/Stores/StoreEditing/StoreEditingStep2.jsx

import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import DeviceList from "../../../components/InstallationSteps/Step4Details/DeviceList";
import DeviceForm from "../../../components/InstallationSteps/Step4Details/DeviceForm";

// Initial state of the form (camelCase)
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

const StoreEditingStep2 = ({
  wizardData,
  updateWizardData,
  onBack,
  onSaveAll,
}) => {
  const { isDarkMode, showMyDialog, appTranslations, language } = useAuth();

  // States will now always work with clean (camelCase) data
  const [devices, setDevices] = useState([]);
  const [isFormActive, setIsFormActive] = useState(false);
  const [activeForm, setActiveForm] = useState(initialDeviceFormState);
  const [formErrors, setFormErrors] = useState({});
  const [editingOriginalId, setEditingOriginalId] = useState(null);

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const editStoreTranslations = useMemo(
    () => appTranslations[language]?.["stores.editStore"],
    [appTranslations, language]
  );

  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );

  useEffect(() => {
    setDevices(wizardData.devices || []);
  }, [wizardData.devices]);

  const timeOptions = Array.from(
    { length: 24 },
    (_, i) => `${String(i).padStart(2, "0")}:00`
  );
  const screenSizes = ["130cm", "110cm", "80cm"];
  const fontSizes = Array.from({ length: 33 }, (_, i) => i + 8);

  const handleIpAddressChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "").replace(/\.{2,}/g, ".");
    updateWizardData({ server_local_ip: value });
  };

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
    if (!activeForm.id) errors.id = wizardTranslations.idRequired;
    const isIdInUse = devices.some(
      (d) =>
        String(d.id) === String(activeForm.id) && d.id !== editingOriginalId
    );
    if (isIdInUse) errors.id = wizardTranslations.idInUse;
    if (!activeForm.screenSize)
      errors.screenSize = wizardTranslations.screenSizeRequired;
    if (!activeForm.wifi_ssid)
      errors.wifi_ssid = wizardTranslations.wifiSsidRequired;
    // Password is only required when adding a new device
    if (!activeForm.isEditing && !activeForm.wifi_password) {
      errors.wifi_password = wizardTranslations.wifiPasswordRequired;
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveDevice = () => {
    if (!validateDeviceForm()) return;

    setDevices((prevDevices) => {
      let updatedDevices;
      const deviceToSave = { ...activeForm };
      delete deviceToSave.isEditing;

      if (activeForm.isEditing) {
        updatedDevices = prevDevices.map((d) =>
          d.id === editingOriginalId ? deviceToSave : d
        );
      } else {
        updatedDevices = [...prevDevices, deviceToSave];
      }
      return updatedDevices.sort((a, b) => a.id - b.id);
    });

    setIsFormActive(false);
    setEditingOriginalId(null);
  };

  const handleProceedToSave = () => {
    if (isFormActive) {
      showMyDialog({
        title: wizardTranslations.unsavedChangesTitle,
        message: wizardTranslations.unsavedChangesMessage,
      });
      return;
    }

    const ipPattern =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (
      !wizardData.server_local_ip ||
      !ipPattern.test(wizardData.server_local_ip)
    ) {
      showMyDialog({
        title: wizardTranslations.errorValidation,
        message: wizardTranslations.validationErrorMessage,
      });
      return;
    }

    onSaveAll(devices);
  };

  // Checks if the IP address is valid before saving.
  const ipPattern =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (
    !wizardData.server_local_ip ||
    !ipPattern.test(wizardData.server_local_ip)
  ) {
    showMyDialog({
      title: wizardTranslations.errorValidation,
      message: wizardTranslations.validationErrorMessage,
    });
    return;
  }

  const inputStyle = {
    backgroundColor: isDarkMode ? "#374151" : "#F9FAFB",
    color: isDarkMode ? "#E5E7EB" : "#111827",
    borderColor: isDarkMode ? "#4B5563" : "#D1D5DB",
  };

  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-4xl mx-auto"
      style={{ backgroundColor: isDarkMode ? "#1F2937" : "#FFFFFF" }}>
      <h2
        className="text-xl font-semibold mb-6"
        style={{ color: isDarkMode ? "#E2E8F0" : "#1F2937" }}>
        {editStoreTranslations.step2Title}
      </h2>

      <div className="mb-6">
        <label
          htmlFor="server_local_ip"
          className="block text-sm font-bold mb-1"
          style={{ color: isDarkMode ? "#E2E8F0" : "#1F2937" }}>
          {storesTranslations.serverIpLabel}
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
          style={{ color: isDarkMode ? "#E2E8F0" : "#1F2937" }}>
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
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
            {storesTranslations.addNewDeviceButton}
          </button>
        </div>
      ) : (
        <DeviceForm
          form={activeForm}
          isEditing={activeForm.isEditing}
          onFormChange={handleFormChange}
          onSave={handleSaveDevice}
          onCancel={handleCancel}
          errors={formErrors}
          readOnlyData={{
            country: wizardData.country,
            city: wizardData.city,
            esp32Token: wizardData.esp32_token,
          }}
          options={{ screenSizes, timeOptions, fontSizes }}
          wizardData={wizardData}
        />
      )}

      <div
        className="flex justify-between mt-8 border-t pt-6"
        style={{ borderColor: isDarkMode ? "#4B5563" : "#D1D5DB" }}>
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 rounded-md font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors">
          {storesTranslations.previousButton}
        </button>
        <button
          type="button"
          onClick={handleProceedToSave}
          className="px-6 py-3 rounded-md font-bold text-white text-lg bg-green-600 hover:bg-green-700 transition-colors">
          {storesTranslations.saveChangesButton}
        </button>
      </div>
    </div>
  );
};

export default StoreEditingStep2;
