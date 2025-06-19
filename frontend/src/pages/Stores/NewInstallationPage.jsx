// src/pages/Stores/NewInstallationPage.jsx
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { ROLES } from "../../config/roles";

import Step1 from "../../components/InstallationSteps/Step1";
import Step2 from "../../components/InstallationSteps/Step2";
import Step3 from "../../components/InstallationSteps/Step3";
import Step4 from "../../components/InstallationSteps/Step4";
import Step5 from "../../components/InstallationSteps/Step5";

const NewInstallationPage = () => {
  const {
    currentColors,
    appTranslations,
    language,
    stores,
    setStores,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    profileUser,
  } = useAuth();

  const navigate = useNavigate();
  const translations = useMemo(
    () => appTranslations[language]?.stores || {},
    [appTranslations, language]
  );
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const isAdmin = profileUser?.role === ROLES.ADMIN;
  const isCountryChief = profileUser?.role === ROLES.COUNTRY_CHIEF;
  const isEngineer = profileUser?.role === ROLES.ENGINEER;

  const [storeForm, setStoreForm] = useState({
    country:
      (isCountryChief || isEngineer) && profileUser.country
        ? profileUser.country
        : "",
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

  const isCountryFilterDisabled = !isAdmin;
  // If the user is not an admin, filter the country selection
  const countryOptions = useMemo(() => {
    if (isAdmin) {
      return fullCountryList;
    }
    if (isCountryChief || isEngineer) {
      // Return an array containing only the user's country
      return fullCountryList.filter((c) => c.value === profileUser.country);
    }
    return []; // Empty for other roles
  }, [isAdmin, isCountryChief, isEngineer, profileUser, fullCountryList]);

  const [formErrors, setFormErrors] = useState({});
  const [serverToken, setServerToken] = useState("");
  const [serverConnectionStatus, setServerConnectionStatus] = useState("");
  const [esp32Token, setEsp32Token] = useState("");
  const [installedDevices, setInstalledDevices] = useState([]);
  const [currentInstallingDevice, setCurrentInstallingDevice] = useState(null);
  const [bluetoothConnectedDevice, setBluetoothConnectedDevice] =
    useState(null);
  const [isDeviceFormActive, setIsDeviceFormActive] = useState(false);
  const [deviceFormErrors, setDeviceFormErrors] = useState({});
  const [fontSizes] = useState(Array.from({ length: 33 }, (_, i) => i + 8));
  const [screenSizes] = useState(["130cm", "110cm", "80cm"]);
  const [logs, setLogs] = useState([]);
  const [deviceForm, setDeviceForm] = useState({
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

  const initialDeviceForm = useMemo(
    () => ({
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
    }),
    [
      installedDevices,
      storeForm.country,
      storeForm.city,
      storeForm.allDayOpen,
      esp32Token,
    ]
  );

  const timeOptions = useMemo(() => {
    const hours = [];
    for (let h = 0; h < 24; h++)
      for (let m = 0; m < 60; m += 30)
        hours.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
    return hours;
  }, []);

  const handleGenerateServerToken = useCallback(() => {
    setServerToken(
      Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15)
    );
    setServerConnectionStatus("");
  }, []);

  const handleCheckConnection = useCallback(() => {
    if (!serverToken) {
      setServerConnectionStatus(
        (translations.connectionError || "Connection failed: ") +
          "Token is empty."
      );
      return;
    }
    setServerConnectionStatus(
      translations.connectionSuccess || "Connection successful!"
    );
  }, [serverToken, translations]);

  const handleGenerateEsp32Token = useCallback(() => {
    const token =
      "ESP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    setEsp32Token(token);
    setDeviceForm((prev) => ({ ...prev, token }));
  }, []);

  const handleDeviceFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setDeviceForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  const handleBluetoothConnect = useCallback(() => {
    try {
      setBluetoothConnectedDevice({ name: "ESP32_Device_Mock" });
    } catch (error) {
      console.error("Bluetooth connection error:", error);
    }
  }, []);

  const handleAddNewDevice = useCallback(() => {
    setCurrentInstallingDevice(null);
    setDeviceForm(initialDeviceForm);
    setDeviceFormErrors({});
    setIsDeviceFormActive(true);
  }, [initialDeviceForm]);

  const handleEditDevice = useCallback(
    (deviceToEdit) => {
      if (isDeviceFormActive) {
        setShowDialog(true);
        setDialogTitle(
          translations.currentInstallationWarningTitle || "Action Required"
        );
        setDialogMessage(
          translations.currentInstallationWarningMsg ||
            "Please save or cancel the current device form first."
        );
        setDialogType("alert");
        setDialogCallback(() => () => setShowDialog(false));
        return;
      }
      setCurrentInstallingDevice(deviceToEdit);
      setDeviceForm(deviceToEdit);
      setDeviceFormErrors({});
      setIsDeviceFormActive(true);
    },
    [
      isDeviceFormActive,
      translations,
      setShowDialog,
      setDialogTitle,
      setDialogMessage,
      setDialogType,
      setDialogCallback,
    ]
  );

  const handleSaveDevice = useCallback(() => {
    // REQUEST 5: Bluetooth connection check
    if (!currentInstallingDevice && !bluetoothConnectedDevice) {
      setShowDialog(true);
      setDialogTitle(translations.errorTitle || "Error");
      setDialogMessage(
        translations.bluetoothNoDeviceSelected ||
          "Please connect to a device via Bluetooth first."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return; // Stop the function
    }

    const newErrors = {};
    let isValid = true;

    // REQUEST 6: Required field check
    if (!deviceForm.screenSize) {
      isValid = false;
      newErrors.screenSize =
        translations.requiredFieldWarning || "This field is required.";
    }
    if (!deviceForm.allDayWork) {
      if (!deviceForm.awakeTime) {
        isValid = false;
        newErrors.awakeTime = translations.requiredFieldWarning;
      }
      if (!deviceForm.sleepTime) {
        isValid = false;
        newErrors.sleepTime = translations.requiredFieldWarning;
      }
    }

    // REQUEST 1: Duplicate ID check
    const parsedId = parseInt(deviceForm.id);
    if (isNaN(parsedId) || String(deviceForm.id).trim() === "") {
      isValid = false;
      newErrors.id = translations.invalidID || "ID must be a number.";
    } else if (
      installedDevices.some(
        (d) => d.id === parsedId && d.id !== currentInstallingDevice?.id
      )
    ) {
      // If this ID is in the list AND it's not the device currently being edited, show error.
      isValid = false;
      newErrors.id =
        translations.deviceIdExists || "This ID is already in use.";
    }

    setDeviceFormErrors(newErrors);

    if (!isValid) {
      // REQUEST 6: If there is an error, smooth scroll to the first erroneous field
      const firstErrorFieldId = Object.keys(newErrors)[0];
      if (firstErrorFieldId) {
        document
          .getElementById(firstErrorFieldId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // If validation is successful, perform the save operation
    const deviceToSave = { ...deviceForm, id: parsedId };
    setInstalledDevices((prev) => {
      const isEditing = prev.some((d) => d.id === currentInstallingDevice?.id);
      return isEditing
        ? prev.map((d) =>
            d.id === currentInstallingDevice.id ? deviceToSave : d
          )
        : [...prev, deviceToSave];
    });

    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setBluetoothConnectedDevice(null);
  }, [
    deviceForm,
    currentInstallingDevice,
    bluetoothConnectedDevice,
    installedDevices,
    translations,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    setDeviceFormErrors,
    setInstalledDevices,
    setIsDeviceFormActive,
    setCurrentInstallingDevice,
    setBluetoothConnectedDevice,
  ]);

  const handleCancelDeviceForm = useCallback(() => {
    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setDeviceFormErrors({});
  }, []);

  const handleDeleteDevice = useCallback((idToDelete) => {
    setInstalledDevices((prev) =>
      prev.filter((device) => device.id !== idToDelete)
    );
  }, []);

  const handleGetLogs = useCallback(async () => {
    setLogs([
      { id: 1, status: "Connected" },
      { id: 2, status: "Error" },
    ]);
  }, []);

  const handleCompleteInstallation = useCallback(() => {
    setShowDialog(true);
    setDialogTitle(
      translations.confirmCompletionTitle || "Confirm Installation"
    );
    setDialogMessage(
      translations.confirmCompletionMessage ||
        "Are you sure you want to finish the installation?"
    );
    setDialogType("confirm");
    setDialogCallback(() => () => {
      const newStore = {
        id: stores?.length > 0 ? Math.max(...stores.map((s) => s.id)) + 1 : 1,
        ...storeForm,
        working_hours: storeForm.allDayOpen
          ? "24/7"
          : `${storeForm.openingHour}-${storeForm.closingHour}`,
        created_at: new Date().toISOString(),
        server_token: serverToken,
        status: "active",
        num_esp32_connected: installedDevices.length,
      };
      setStores((prevStores) => [...prevStores, newStore]);
      setShowDialog(false);
      navigate("/");
    });
  }, [
    translations,
    storeForm,
    serverToken,
    installedDevices,
    stores,
    setStores,
    navigate,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
  ]);

  useEffect(() => {
    if (storeForm.country) {
      if (storeForm.country === "Poland") {
        setCitiesOptions([
          { value: "Warsaw", label: "Warsaw" },
          { value: "Krakow", label: "Krakow" },
          { value: "Gdansk", label: "Gdansk" },
        ]);
      } else if (storeForm.country === "Azerbaijan") {
        setCitiesOptions([
          { value: "Baku", label: "Baku" },
          { value: "Ganja", label: "Ganja" },
          { value: "Sumgait", label: "Sumgait" },
        ]);
      } else if (storeForm.country === "USA") {
        setCitiesOptions([
          { value: "New York", label: "New York" },
          { value: "Los Angeles", label: "Los Angeles" },
        ]);
      } else if (storeForm.country === "Turkey") {
        setCitiesOptions([
          { value: "Istanbul", label: "Istanbul" },
          { value: "Ankara", label: "Ankara" },
          { value: "Izmir", label: "Izmir" },
        ]);
      } else if (storeForm.country === "Germany") {
        setCitiesOptions([
          { value: "Berlin", label: "Berlin" },
          { value: "Munich", label: "Munich" },
        ]);
      } else {
        setCitiesOptions([]);
      }
      // Reset city selection when country changes
      setStoreForm((prev) => ({ ...prev, city: "" }));
    } else {
      // If no country is selected, clear the city list
      setCitiesOptions([]);
    }
  }, [storeForm.country]); // This hook only runs when storeForm.country changes

  const steps = [
    { id: 1, component: Step1 },
    { id: 2, component: Step2 },
    { id: 3, component: Step3 },
    { id: 4, component: Step4 },
    { id: 5, component: Step5 },
  ];
  const CurrentStepComponent = steps.find(
    (s) => s.id === currentStep
  )?.component;
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const StepIcon = ({ stepNumber }) => {
    const isCompleted = currentStep > stepNumber;
    const isActive = currentStep === stepNumber;
    return (
      <div className="relative flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center border-2"
          style={{
            backgroundColor: isCompleted
              ? currentColors.progressBarActive
              : "transparent",
            borderColor: isActive
              ? currentColors.logoPrimaryBlue
              : currentColors.progressBarBorder,
          }}>
          {isCompleted ? (
            <CheckCircle size={18} color={currentColors.whiteText} />
          ) : (
            <span
              className="font-semibold"
              style={{
                color: isActive
                  ? currentColors.logoPrimaryBlue
                  : currentColors.darkText,
              }}>
              {stepNumber}
            </span>
          )}
        </div>
      </div>
    );
  };

  const commonProps = {
    colors: currentColors,
    translations,
    onNext: nextStep,
    onBack: prevStep,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
  };

  const stepProps = {
    1: {
      ...commonProps,
      storeForm,
      setStoreForm,
      citiesOptions,
      setCitiesOptions,
      countryOptions,
      isCountryFilterDisabled,
      timeOptions,
      formErrors,
      setFormErrors,
    },
    2: {
      ...commonProps,
      serverToken,
      serverConnectionStatus,
      handleGenerateServerToken,
      handleCheckConnection,
    },
    3: { ...commonProps, esp32Token, handleGenerateEsp32Token },
    4: {
      ...commonProps,
      installedDevices,
      currentInstallingDevice,
      deviceForm,
      isDeviceFormActive,
      fontSizes,
      screenSizes,
      deviceFormErrors,
      timeOptions,
      handleAddNewDevice,
      handleEditDevice,
      handleSaveDevice,
      handleDeleteDevice,
      handleCancelDeviceForm,
      handleDeviceFormChange,
      setIsDeviceFormActive,
      handleBluetoothConnect,
      bluetoothConnectedDevice,
      storeForm,
      esp32Token,
    },
    5: { ...commonProps, logs, handleGetLogs, handleCompleteInstallation },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-center items-center my-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepIcon stepNumber={step.id} />
            {index < steps.length - 1 && (
              <div
                className="h-0.5 w-16"
                style={{
                  backgroundColor:
                    currentStep > step.id
                      ? currentColors.progressBarActive
                      : currentColors.progressBarLine,
                }}></div>
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {CurrentStepComponent && (
          <CurrentStepComponent {...stepProps[currentStep]} />
        )}
      </div>
    </div>
  );
};

export default NewInstallationPage;
