// src/pages/Stores/StoreEditingWorkflow.jsx
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ROLES } from "../../../config/roles";

import { CheckCircle, ArrowLeft } from "lucide-react";
import StoreEditingStep1 from "./StoreEditingStep1";
import StoreEditingStep2 from "./StoreEditingStep2";
const StoreEditingWorkflow = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    stores,
    setStores,
    installedDevices,
    setInstalledDevices,
    currentColors: colors,
    appTranslations,
    language,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    profileUser,
  } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.stores || {},
    [appTranslations, language]
  );
  const storeToEdit = useMemo(
    () => stores.find((s) => s.id === parseInt(storeId, 10)),
    [stores, storeId]
  );

  const [currentEditStep, setCurrentEditStep] = useState(1);
  const [editableStoreForm, setEditableStoreForm] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [bluetoothConnectedDevice, setBluetoothConnectedDevice] =
    useState(null);

  const [currentStoreDevices, setCurrentStoreDevices] = useState([]);
  const [currentInstallingDevice, setCurrentInstallingDevice] = useState(null);
  const [isDeviceFormActive, setIsDeviceFormActive] = useState(false);
  const [deviceForm, setDeviceForm] = useState({});
  const [deviceFormErrors, setDeviceFormErrors] = useState({});

  const [fontSizes] = useState(Array.from({ length: 33 }, (_, i) => i + 8));
  const [screenSizes] = useState(["130cm", "110cm", "80cm"]);
  const [citiesOptions, setCitiesOptions] = useState([]);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;

  const fullCountryList = useMemo(
    () => [
      { value: "Poland", label: "Poland" },
      { value: "Azerbaijan", label: "Azerbaijan" },
      { value: "USA", label: "USA" },
      { value: "Turkey", label: "Turkey" },
      { value: "Germany", label: "Germany" },
    ],
    []
  );

  const countryOptions = useMemo(() => {
    if (isAdmin) return fullCountryList;
    // Country Chief and Engineer can only see their own country
    if (isCountryChief || isEngineer) {
      return fullCountryList.filter((c) => c.value === profileUser.country);
    }
    return [];
  }, [isAdmin, isCountryChief, isEngineer, profileUser, fullCountryList]);

  const isCountrySelectDisabled = !isAdmin;

  const timeOptions = useMemo(() => {
    const hours = [];
    for (let h = 0; h < 24; h++)
      for (let m = 0; m < 60; m += 30)
        hours.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
    return hours;
  }, []);

  useEffect(() => {
    if (storeToEdit) {
      const workingHours = storeToEdit.working_hours || "09:00-18:00";
      const [openingHour, closingHour] = workingHours.split("-");
      setEditableStoreForm({
        ...storeToEdit,
        storeName: storeToEdit.name,
        branchName: storeToEdit.branch || "",
        addBranch: !!storeToEdit.branch,
        allDayOpen: storeToEdit.working_hours === "24/7",
        openingHour,
        closingHour,
      });
      const devicesForThisStore = (installedDevices || []).filter(
        (d) => d.storeId === storeToEdit.id
      );
      setCurrentStoreDevices(devicesForThisStore);
    } else {
      navigate("/edit-store-details");
    }
  }, [storeToEdit, installedDevices, navigate]);

  useEffect(() => {
    if (editableStoreForm?.country) {
      if (editableStoreForm.country === "Poland")
        setCitiesOptions([
          { value: "Warsaw", label: "Warsaw" },
          { value: "Krakow", label: "Krakow" },
        ]);
      else if (editableStoreForm.country === "Turkey")
        setCitiesOptions([
          { value: "Istanbul", label: "Istanbul" },
          { value: "Ankara", label: "Ankara" },
        ]);
      else if (editableStoreForm.country === "USA")
        setCitiesOptions([
          { value: "New York", label: "New York" },
          { value: "Los Angeles", label: "Los Angeles" },
        ]);
      else if (editableStoreForm.country === "Germany")
        setCitiesOptions([{ value: "Berlin", label: "Berlin" }]);
      else if (editableStoreForm.country === "Azerbaijan")
        setCitiesOptions([{ value: "Baku", label: "Baku" }]);
      else setCitiesOptions([]);
    }
  }, [editableStoreForm?.country]);

  const handleStoreFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setEditableStoreForm((prev) => {
      const newForm = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "country") newForm.city = "";
      return newForm;
    });
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const handleStoreInfoNext = useCallback(() => {
    let isValid = true;
    const newErrors = {};
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
    if (editableStoreForm.addBranch) requiredFields.push("branchName");
    if (!editableStoreForm.allDayOpen) {
      requiredFields.push("openingHour", "closingHour");
    }

    requiredFields.forEach((field) => {
      if (
        !editableStoreForm[field] ||
        String(editableStoreForm[field]).trim() === ""
      ) {
        isValid = false;
        newErrors[field] =
          translations.requiredFieldWarning || "This field is required.";
      }
    });

    setFormErrors(newErrors);
    if (isValid) setCurrentEditStep(2);
  }, [editableStoreForm, translations]);

  const handleDeviceFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setDeviceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleAddNewDevice = useCallback(() => {
    setBluetoothConnectedDevice(null);
    const newId =
      currentStoreDevices.length > 0
        ? Math.max(...currentStoreDevices.map((d) => d.id)) + 1
        : 1;
    setDeviceForm({
      id: newId,
      storeId: storeToEdit.id,
      screenSize: "",
      allDayWork: editableStoreForm.allDayOpen,
      awakeTime: editableStoreForm.openingHour,
      sleepTime: editableStoreForm.closingHour,
    });
    setCurrentInstallingDevice(null);
    setIsDeviceFormActive(true);
  }, [currentStoreDevices, storeToEdit, editableStoreForm]);

  const handleEditDevice = useCallback((deviceToEdit) => {
    setCurrentInstallingDevice(deviceToEdit);
    setDeviceForm(deviceToEdit);
    setIsDeviceFormActive(true);
  }, []);

  const handleSaveDevice = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    if (!deviceForm.screenSize) {
      isValid = false;
      newErrors.screenSize = translations.requiredFieldWarning;
    }

    const parsedId = parseInt(deviceForm.id);
    if (isNaN(parsedId) || String(deviceForm.id).trim() === "") {
      isValid = false;
      newErrors.id = translations.invalidID || "ID must be a number.";
    } else if (
      currentStoreDevices.some(
        (d) => d.id === parsedId && d.id !== currentInstallingDevice?.id
      )
    ) {
      isValid = false;
      newErrors.id =
        translations.deviceIdExists || "This ID is already in use.";
    }

    setDeviceFormErrors(newErrors);
    if (!isValid) return;

    const finalDevice = { ...deviceForm, id: parsedId };
    setCurrentStoreDevices((prev) => {
      const isEditing = prev.some((d) => d.id === currentInstallingDevice?.id);
      return isEditing
        ? prev.map((d) =>
            d.id === currentInstallingDevice.id ? finalDevice : d
          )
        : [...prev, finalDevice];
    });
    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
  }, [
    deviceForm,
    currentInstallingDevice,
    currentStoreDevices,
    translations,
    setDeviceFormErrors,
  ]);

  const handleCancelDeviceForm = useCallback(() => {
    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setDeviceFormErrors({});
  }, []);

  const handleDeleteDevice = useCallback((idToDelete) => {
    setCurrentStoreDevices((prev) =>
      prev.filter((device) => device.id !== idToDelete)
    );
  }, []);

  const handleBluetoothConnect = useCallback(() => {
    // In a real application, the Web Bluetooth API would be used here.
    // For now, we simulate a connection with a mock device.
    try {
      console.log("Simulating Bluetooth connection...");
      setBluetoothConnectedDevice({ name: "ESP32_Device_Mock" });
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      // In case of error, you can show a dialog to the user.
    }
  }, []);

  const handleSaveAllChanges = useCallback(() => {
    setShowDialog(true);
    setDialogTitle(translations.confirmSaveTitle);
    setDialogMessage(translations.confirmSaveMessage);
    setDialogType("confirm");
    setDialogCallback(() => () => {
      const finalStoreData = {
        ...editableStoreForm,
        name: editableStoreForm.storeName,
        branch: editableStoreForm.branchName,
        working_hours: editableStoreForm.allDayOpen
          ? "24/7"
          : `${editableStoreForm.openingHour}-${editableStoreForm.closingHour}`,
      };
      delete finalStoreData.storeName;
      delete finalStoreData.branchName;

      setStores((prev) =>
        prev.map((s) => (s.id === finalStoreData.id ? finalStoreData : s))
      );
      const otherStoresDevices = installedDevices.filter(
        (d) => d.storeId !== storeToEdit.id
      );
      setInstalledDevices([...otherStoresDevices, ...currentStoreDevices]);

      setShowDialog(false);
      navigate("/edit-store-details");
    });
  }, [
    editableStoreForm,
    currentStoreDevices,
    storeToEdit?.id,
    navigate,
    setStores,
    installedDevices,
    setInstalledDevices,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    translations,
  ]);

  if (!editableStoreForm) {
    return <div style={{ color: colors.darkText }}>Loading...</div>;
  }

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite }}>
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-3xl font-semibold"
          style={{ color: colors.darkText }}>
          {translations.editStoreInfoTitle || "Edit Store"}: {storeToEdit.name}
        </h1>
        <button
          onClick={() => navigate("/edit-store-details")}
          className="px-4 py-2 rounded-md font-medium flex items-center"
          style={{
            backgroundColor: colors.prevButtonBg,
            color: colors.whiteText,
          }}>
          <ArrowLeft size={20} className="mr-2" />
          {translations.backToStoreList || "Back to Store List"}
        </button>
      </div>

      <div className="flex justify-center items-center my-8 space-x-4">
        {[1, 2].map((step, index) => (
          <React.Fragment key={step}>
            <div className="relative flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all`}
                style={{
                  backgroundColor:
                    currentEditStep >= step
                      ? colors.progressBarActive
                      : "transparent",
                  borderColor:
                    currentEditStep === step
                      ? colors.logoPrimaryBlue
                      : currentEditStep > step
                      ? colors.progressBarActive
                      : colors.progressBarBorder,
                }}>
                {currentEditStep > step ? (
                  <CheckCircle size={20} color={colors.whiteText} />
                ) : (
                  <span
                    className="font-semibold text-lg"
                    style={{
                      color:
                        currentEditStep === step
                          ? colors.logoPrimaryBlue
                          : colors.darkText,
                    }}>
                    {step}
                  </span>
                )}
              </div>
            </div>
            {index < 1 && (
              <div
                className={`h-0.5 w-16 transition-colors duration-500`}
                style={{
                  backgroundColor:
                    currentEditStep > step
                      ? colors.progressBarActive
                      : colors.progressBarLine,
                }}></div>
            )}
          </React.Fragment>
        ))}
      </div>

      {currentEditStep === 1 && (
        <StoreEditingStep1
          editableStoreForm={editableStoreForm}
          formErrors={formErrors}
          handleStoreFormChange={handleStoreFormChange}
          handleStoreInfoNext={handleStoreInfoNext}
          isCountrySelectDisabled={isCountrySelectDisabled}
          countryOptions={countryOptions}
          citiesOptions={citiesOptions}
          timeOptions={timeOptions}
          colors={colors}
          translations={translations}
        />
      )}

      {currentEditStep === 2 && (
        <StoreEditingStep2
          currentStoreDevices={currentStoreDevices}
          currentInstallingDevice={currentInstallingDevice}
          deviceForm={deviceForm}
          isDeviceFormActive={isDeviceFormActive}
          setIsDeviceFormActive={setIsDeviceFormActive}
          fontSizes={fontSizes}
          screenSizes={screenSizes}
          deviceFormErrors={deviceFormErrors}
          colors={colors}
          translations={translations}
          timeOptions={timeOptions}
          handleAddNewDevice={handleAddNewDevice}
          handleEditDevice={handleEditDevice}
          handleSaveDevice={handleSaveDevice}
          handleDeleteDevice={handleDeleteDevice}
          handleCancelDeviceForm={handleCancelDeviceForm}
          handleDeviceFormChange={handleDeviceFormChange}
          bluetoothConnectedDevice={bluetoothConnectedDevice}
          handleBluetoothConnect={handleBluetoothConnect}
          storeForm={editableStoreForm}
          onBack={() => setCurrentEditStep(1)}
          onSaveAll={handleSaveAllChanges}
          setShowDialog={setShowDialog}
          setDialogTitle={setDialogTitle}
          setDialogMessage={setDialogMessage}
          setDialogType={setDialogType}
          setDialogCallback={setDialogCallback}
        />
      )}
    </div>
  );
};

export default StoreEditingWorkflow;
