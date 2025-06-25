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
    setIsLoading,
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
    screenSize: "",
    wifi_ssid: "",
    wifi_password: "",
    server_ip: "",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
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

  const handleBluetoothConnect = useCallback(async () => {
    if (!navigator.bluetooth) {
      setShowDialog(true);
      setDialogTitle("Unsupported Browser");
      setDialogMessage(
        "Your browser does not support Web Bluetooth. Please use Chrome or Edge."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }

    try {
      console.log(
        "Requesting Bluetooth device with name filter 'ESP32_EILSENSE'..."
      );

      // DÜZELTME: Cihazları isme göre filtreliyoruz
      const device = await navigator.bluetooth.requestDevice({
        // filters: [
        //   {
        //     name: "ESP32_EILSENSE",
        //   },
        // ],
        //Note: For to use all devices you should remove the filters:
        //Note: You can't use filters and acceptAllDevices at the same time.
        acceptAllDevices: true,

        // Not: İsteğe bağlı olarak, ESP32'nizin sunduğu belirli servis UUID'lerini de
        // buraya ekleyerek filtrelemeyi daha da güvenli hale getirebilirsiniz.
        // optionalServices: ['your_custom_service_uuid']
      });

      console.log("Connecting to GATT Server...");

      await device.gatt.connect(); // <-- 'const server =' kaldırıldı
      console.log("Connected to device:", device.name);
      setBluetoothConnectedDevice(device);

      device.addEventListener("gattserverdisconnected", () => {
        console.log("Device disconnected.");
        setBluetoothConnectedDevice(null);
      });
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      // Kullanıcı pencereyi iptal ederse de bu hata tetiklenir, bunu ayırabilirsiniz.
      if (error.name !== "NotFoundError") {
        setShowDialog(true);
        setDialogTitle("Connection Error");
        setDialogMessage(String(error));
        setDialogType("alert");
        setDialogCallback(() => () => setShowDialog(false));
      }
    }
  }, [
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    setBluetoothConnectedDevice,
  ]);

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
    // 1. Bluetooth Bağlantı Kontrolü (Sadece yeni cihaz eklerken)
    if (!currentInstallingDevice && !bluetoothConnectedDevice) {
      setShowDialog(true);
      setDialogTitle(translations.errorTitle || "Error");
      setDialogMessage(
        translations.bluetoothNoDeviceSelected ||
          "Please connect to a device via Bluetooth first."
      );
      setDialogType("alert");
      setDialogCallback(() => () => setShowDialog(false));
      return;
    }

    const newErrors = {};
    let isValid = true;

    // 2. Zorunlu Alan Kontrolleri
    const requiredFields = ["screenSize", "wifi_ssid", "wifi_password"];
    if (!deviceForm.allDayWork) {
      requiredFields.push("awakeTime", "sleepTime");
    }
    requiredFields.forEach((field) => {
      if (!deviceForm[field] || String(deviceForm[field]).trim() === "") {
        isValid = false;
        newErrors[field] =
          translations.requiredFieldWarning || "This field is required.";
      }
    });

    // 3. Tekrarlanan ID Kontrolü
    const parsedId = parseInt(deviceForm.id);
    if (isNaN(parsedId) || String(deviceForm.id).trim() === "") {
      isValid = false;
      newErrors.id = translations.invalidID || "ID must be a number.";
    } else if (
      installedDevices.some(
        (d) => d.id === parsedId && d.id !== currentInstallingDevice?.id
      )
    ) {
      isValid = false;
      newErrors.id =
        translations.deviceIdExists || "This ID is already in use.";
    }

    setDeviceFormErrors(newErrors);

    // 4. Doğrulama Başarısızsa İşlemi Durdur ve Hatalı Alana Kaydır
    if (!isValid) {
      const firstErrorFieldId = Object.keys(newErrors)[0];
      if (firstErrorFieldId) {
        document
          .getElementById(firstErrorFieldId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Bluetooth Veri Yazma Mantığı
    if (bluetoothConnectedDevice && !currentInstallingDevice) {
      try {
        setIsLoading(true);
        // Gerçek Service ve Characteristic UUID'leriniz ile değiştirin
        // const serviceUUID = "your-service-uuid";
        // const characteristicUUID = "your-characteristic-uuid";
        // const server = await bluetoothConnectedDevice.gatt.connect();
        // const service = await server.getPrimaryService(serviceUUID);
        // const characteristic = await service.getCharacteristic(characteristicUUID);
        const dataToSend = JSON.stringify({
          wifi_ssid: deviceForm.wifi_ssid,
          wifi_password: deviceForm.wifi_password,
          server_ip: deviceForm.server_ip,
        });
        // await characteristic.writeValue(new TextEncoder().encode(dataToSend));
        console.log("Data sent to ESP32 (simulation):", dataToSend);
      } catch (error) {
        console.error("Failed to send data to ESP32:", error);
        setShowDialog(true);
        setDialogTitle("Transmission Error");
        setDialogMessage(`Failed to send data: ${error.message}`);
        setDialogType("alert");
        setDialogCallback(() => () => setShowDialog(false));
        setIsLoading(false);
        return;
      } finally {
        setIsLoading(false);
      }
    }

    // 5. Kaydetme İşlemi (Doğrulama başarılıysa)
    const deviceToSave = { ...deviceForm, id: parsedId };
    setInstalledDevices((prev) => {
      const isEditing = prev.some((d) => d.id === currentInstallingDevice?.id);
      return isEditing
        ? prev.map((d) =>
            d.id === currentInstallingDevice.id ? deviceToSave : d
          )
        : [...prev, deviceToSave];
    });

    // 6. Formu ve State'leri Temizle/Kapat
    setIsDeviceFormActive(false);
    setCurrentInstallingDevice(null);
    setBluetoothConnectedDevice(null); // Bluetooth bağlantısını da sıfırla
  }, [
    // Bağımlılık dizisi de güncellendi
    deviceForm,
    currentInstallingDevice,
    bluetoothConnectedDevice,
    installedDevices,
    translations,
    setDeviceFormErrors,
    setInstalledDevices,
    setIsDeviceFormActive,
    setCurrentInstallingDevice,
    setBluetoothConnectedDevice,
    setShowDialog,
    setDialogTitle,
    setDialogMessage,
    setDialogType,
    setDialogCallback,
    setIsLoading,
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
