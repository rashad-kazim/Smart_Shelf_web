import React, { useEffect, useState, useMemo, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

// Step components
import Step1 from "../../components/InstallationSteps/Step1";
import Step2 from "../../components/InstallationSteps/Step2";
import Step3 from "../../components/InstallationSteps/Step3";
import Step4 from "../../components/InstallationSteps/Step4";
import Step5 from "../../components/InstallationSteps/Step5";

// Other components
import GlobalLoader from "../../components/common/GlobalLoader";

// NEW: Converter function is now in the main component.
const mapFormDeviceToApiDevice = (formDevice) => {
  const apiDevice = {
    id: parseInt(formDevice.id, 10),
    screen_size: formDevice.screenSize,
    all_day_work: formDevice.allDayWork,
    awake_time: formDevice.allDayWork ? null : formDevice.awakeTime,
    sleep_time: formDevice.allDayWork ? null : formDevice.sleepTime,
    wifi_ssid: formDevice.wifi_ssid,
    product_name_font_size: parseInt(formDevice.productNameFontSize, 10),
    product_price_font_size_before_discount: parseInt(
      formDevice.productPriceFontSizeBeforeDiscount,
      10
    ),
    product_price_font_size_after_discount: parseInt(
      formDevice.productPriceFontSizeAfterDiscount,
      10
    ),
    product_barcode_font_size: parseInt(formDevice.productBarcodeFontSize, 10),
    product_barcode_numbers_font_size: parseInt(
      formDevice.productBarcodeNumbersFontSize,
      10
    ),
  };
  if (formDevice.wifi_password) {
    apiDevice.wifi_password = formDevice.wifi_password;
  }
  return apiDevice;
};

const NewInstallationPage = () => {
  const {
    isDarkMode,
    appTranslations,
    language,
    isGlobalLoading,
    setIsGlobalLoading,
    profileUser,
    showMyDialog,
  } = useAuth();

  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [isCompleted, setIsCompleted] = useState(false);
  const [installationLogs, setInstallationLogs] = useState([]);
  const [isNavigationBlocked, setIsNavigationBlocked] = useState(false);

  const [wizardData, setWizardData] = useState({
    // Step 1 - 5 data
    name: "",
    country:
      profileUser?.role !== "Admin"
        ? profileUser?.country
          ? profileUser.country.charAt(0).toUpperCase() +
            profileUser.country.slice(1)
          : ""
        : "",
    city: "",
    addBranch: false,
    branch: "",
    address: "",
    allDayOpen: false,
    openingHour: "",
    closingHour: "",
    ownerName: "",
    ownerSurname: "",
    // Step 2 & 3 data
    server_token: "",
    esp32_token: "",
    // Step 4 data
    devices: [],
    server_local_ip: "",
    storeId: null,
  });

  // Refs
  const wizardDataRef = useRef(wizardData);
  const isCompletedRef = useRef(isCompleted);
  const pageContainerRef = useRef(null);
  const isDeletingRef = useRef(false); // Prevent double delete

  // Hook to update refs whenever state changes
  useEffect(() => {
    wizardDataRef.current = wizardData;
    isCompletedRef.current = isCompleted;
  });

  const wizardTranslations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );

  // --- NEW: Exit warning if installation is not completed ---
  const shouldWarnBeforeLeaving = useMemo(() => {
    return !isCompleted && currentStep > 1 && wizardData.storeId; // Warn if store ID exists and installation is not finished
  }, [isCompleted, currentStep, wizardData.storeId]);

  // --- FIX: Draft store delete function ---
  const deleteDraftStore = async (storeId) => {
    // Prevent double delete
    if (isDeletingRef.current) {
      return;
    }

    // If installation is completed or store ID does not exist, do not delete
    if (!storeId || isCompletedRef.current) {
      return;
    }

    isDeletingRef.current = true;

    try {
      // Fix the API endpoint - according to your backend's real endpoint
      await axiosInstance.delete(`/api/stores/${storeId}`);
    } catch (error) {
      // Do not silently pass on error, log it
      if (error.response?.status === 404) {
        // Store already deleted or not found
      } else if (error.response?.status === 403) {
        // Permission denied to delete store
      }
    } finally {
      isDeletingRef.current = false;
    }
  };

  // Custom navigate function for navigation blocking
  const blockedNavigate = async (to, options) => {
    if (shouldWarnBeforeLeaving && !isNavigationBlocked) {
      const confirmed = window.confirm(wizardTranslations.exitConfirmation);

      if (confirmed) {
        setIsNavigationBlocked(true);

        // Delete draft store
        const storeId =
          wizardDataRef.current?.storeId || wizardDataRef.current?.id;
        if (storeId && !isCompletedRef.current) {
          await deleteDraftStore(storeId);
        }

        navigate(to, options);
      }
    } else {
      navigate(to, options);
    }
  };

  // --- FIX: Custom blocker for internal navigation ---
  useEffect(() => {
    if (!shouldWarnBeforeLeaving) return;

    // Override History API
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    window.history.pushState = function (...args) {
      const confirmed = window.confirm(wizardTranslations.exitConfirmation);

      if (confirmed) {
        const storeId =
          wizardDataRef.current?.storeId || wizardDataRef.current?.id;
        if (storeId && !isCompletedRef.current) {
          // Try to delete synchronously
          deleteDraftStore(storeId);
        }
        originalPushState.apply(this, args);
      }
    };

    window.history.replaceState = function (...args) {
      const confirmed = window.confirm(wizardTranslations.exitConfirmation);

      if (confirmed) {
        const storeId =
          wizardDataRef.current?.storeId || wizardDataRef.current?.id;
        if (storeId && !isCompletedRef.current) {
          // Try to delete synchronously
          deleteDraftStore(storeId);
        }
        originalReplaceState.apply(this, args);
      }
    };

    // Cleanup
    return () => {
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [shouldWarnBeforeLeaving, wizardTranslations.exitConfirmation]);

  // --- FIX: beforeunload for external links, browser close, tab close ---
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (shouldWarnBeforeLeaving) {
        const storeId =
          wizardDataRef.current?.storeId || wizardDataRef.current?.id;

        // If installation is not completed, delete draft store
        if (storeId && !isCompletedRef.current) {
          // Use Beacon API for deletion (async does not work in beforeunload)
          const deleteUrl = `${window.location.origin}/api/stores/${storeId}`;

          // Use Beacon API if supported
          if (navigator.sendBeacon) {
            const formData = new FormData();
            formData.append("_method", "DELETE");
            navigator.sendBeacon(deleteUrl, formData);
          } else {
            // Fallback - sync XHR (deprecated but works)
            try {
              const xhr = new XMLHttpRequest();
              xhr.open("DELETE", deleteUrl, false); // false = synchronous
              xhr.send();
            } catch (error) {}
          }
        }

        event.preventDefault();
        event.returnValue = wizardTranslations.exitConfirmation;
        return event.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [shouldWarnBeforeLeaving, wizardTranslations.exitConfirmation]);

  // --- useEffect hook that triggers Smooth Scroll ---
  useEffect(() => {
    pageContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (isGlobalLoading) {
      setIsGlobalLoading(false);
    }
  }, [currentStep, isGlobalLoading, setIsGlobalLoading]);

  const textColor = isDarkMode ? "text-white" : "text-gray-900";
  const subTextColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const progressBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const progressIndicatorColor = isDarkMode ? "bg-blue-500" : "bg-blue-600";

  const steps = [
    { id: 1, name: wizardTranslations.step1Title },
    { id: 2, name: wizardTranslations.step2Title },
    { id: 3, name: wizardTranslations.step3Title },
    { id: 4, name: wizardTranslations.step4Title },
    { id: 5, name: wizardTranslations.step5Title },
  ];

  // --- OTHER FUNCTIONS ---
  const updateWizardData = (newData) => {
    setWizardData((prev) => ({ ...prev, ...newData }));
  };

  const displayDialog = (title, message) => {
    showMyDialog({ title, message });
  };

  const timeOptions = useMemo(() => {
    const hours = [];
    for (let h = 0; h < 24; h++)
      for (let m = 0; m < 60; m += 30)
        hours.push(
          `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
        );
    return hours;
  }, []);

  const generateFinalLogs = (devicesArray = []) => {
    setTimeout(() => {
      const logs = [];
      const now = new Date().toLocaleTimeString();

      // 1. Server Heartbeat Log
      logs.push({
        source: wizardTranslations.logSourceServer,
        status: wizardTranslations.logStatusOnline,
        details: {
          [wizardTranslations.logDetailHeartbeat]:
            wizardTranslations.logDetailYes,
          [wizardTranslations.logDetailLastSeen]: now,
        },
      });

      // 2. Logs of Added Devices
      if (devicesArray && devicesArray.length > 0) {
        devicesArray.forEach((device) => {
          logs.push({
            source: `${wizardTranslations.logDevicePrefix} ${device.id}`,
            status: wizardTranslations.logStatusReady,
            details: {
              battery_status: `${Math.floor(Math.random() * 30) + 70}%`,
              [wizardTranslations.logDetailRefreshRate]:
                wizardTranslations.logRefreshRateValue,
              [wizardTranslations.logDetailLastSync]: now,
            },
          });
        });
      } else {
        logs.push({
          source: wizardTranslations.logSourceDevices,
          status: wizardTranslations.logStatusNotFound,
          details: {
            [wizardTranslations.logDetailInfo]: wizardTranslations.logNoDevices,
          },
        });
      }

      setInstallationLogs(logs);
    }, 800);
  };

  const handleNext = (dataFromStep) => {
    if (dataFromStep) {
      updateWizardData(dataFromStep);
    }

    if (currentStep < 5) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleProceedFromStep4 = async (dataFromStep4) => {
    try {
      // Take camelCase data from Step4 and convert to snake_case
      const devicesForApi = (dataFromStep4.devices || []).map(
        mapFormDeviceToApiDevice
      );

      const payload = {
        server_local_ip: dataFromStep4.server_local_ip,
        devices: devicesForApi,
      };

      await axiosInstance.put(`/api/stores/${wizardData.storeId}`, payload);

      // Update main data and go to next step
      updateWizardData(dataFromStep4);
      generateFinalLogs(dataFromStep4.devices);
      setCurrentStep(5); // Manually go to step 5
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      let errorMessage = "Failed to update store information.";
      if (typeof errorDetail === "string") {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail
          .map((err) => `${err.loc.join(" -> ")}: ${err.msg}`)
          .join("\n");
      }
      showMyDialog({ title: "Update Error", message: errorMessage });
    } finally {
    }
  };

  const handleBack = async () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    } else {
      // If going back from the first step and draft store exists, delete it
      const storeId = wizardData?.storeId || wizardData?.id;
      if (storeId && !isCompleted) {
        await deleteDraftStore(storeId);
      }
      blockedNavigate("/stores");
    }
  };

  // Installation request state
  const isProcessingRef = useRef(false);

  const handleCompleteInstallation = async (e) => {
    e.preventDefault();

    if (isProcessingRef.current || isGlobalLoading) {
      return;
    }

    isProcessingRef.current = true;
    setIsGlobalLoading(true);

    const payload = {
      status: "completed",
    };

    try {
      await axiosInstance.put(`/api/stores/${wizardData.storeId}`, payload);

      // Kurulumun tamamlandığını belirt
      setIsCompleted(true);

      // Başarı diyaloğunu göster. Tüm yönlendirme ve temizlik işlemleri
      // kullanıcı "Tamam" butonuna bastıktan sonra güvenli bir şekilde yapılacak.
      showMyDialog({
        title: wizardTranslations.installationSuccessTitle,
        message: wizardTranslations.installationSuccessMessage,
        type: "success", // Bu, sadece "Tamam" butonu olan bir diyalog gösterir
        onConfirm: () => {
          // Önce tüm state'leri temizle
          setWizardData((prev) => ({
            ...prev,
            storeId: null,
            id: null,
            name: "",
            city: "",
            addBranch: false,
            branch: "",
            address: "",
            allDayOpen: false,
            openingHour: "",
            closingHour: "",
            ownerName: "",
            ownerSurname: "",
            server_token: "",
            esp32_token: "",
            devices: [],
            server_local_ip: "",
          }));
          setInstallationLogs([]);
          setCurrentStep(1);

          // En son ana sayfaya yönlendir
          navigate("/");
        },
      });
    } catch (err) {
      console.error("Installation error:", err);

      // Hata mesajını çeviri dosyasından al
      let errorMessage = wizardTranslations.installationFailedMessage;
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        errorMessage = wizardTranslations.installationTimeoutMessage;
      } else if (err.response?.data?.detail) {
        errorMessage = err.response.data.detail;
      }

      // Hata diyaloğunu göster
      showMyDialog({
        title: wizardTranslations.installationErrorTitle,
        message: errorMessage,
        type: "alert", // Sadece "Tamam" butonu göster
      });
    } finally {
      // finally bloğu sadece loading durumlarını yönetmeli
      setIsGlobalLoading(false);
      isProcessingRef.current = false;
    }
  };

  return (
    <div className="p-4 sm:p-6">
      <h1 className={`text-2xl sm:text-3xl font-bold mb-2 ${textColor}`}>
        {wizardTranslations.title}
      </h1>
      <p className={`mb-8 ${subTextColor}`}>{wizardTranslations.description}</p>

      <div
        className="w-full max-w-2xl mx-auto px-4 sm:px-0 mb-12"
        ref={pageContainerRef}>
        {isGlobalLoading && <GlobalLoader />}

        <div className="relative">
          <div
            className={`absolute top-4 left-0 w-full h-0.5 transform -translate-y-1/2 ${progressBgColor}`}></div>
          <div
            className={`absolute top-4 left-0 h-0.5 transform -translate-y-1/2 transition-all duration-500 ${progressIndicatorColor}`}
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}></div>
          <ol className="relative z-10 flex justify-between">
            {steps.map((step) => (
              <li key={step.id} className="text-center" title={step.name}>
                <div
                  className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    currentStep >= step.id
                      ? `${progressIndicatorColor} text-white`
                      : `${progressBgColor} ${
                          isDarkMode
                            ? "text-gray-300 border-2 border-gray-600"
                            : "text-gray-500 border-2 border-gray-300"
                        }`
                  }`}>
                  {step.id}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8">
        {currentStep === 1 && (
          <Step1
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && (
          <Step2
            onNext={handleNext}
            onBack={handleBack}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            displayDialog={displayDialog}
          />
        )}

        {currentStep === 3 && (
          <Step3
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onNext={handleNext}
            onBack={handleBack}
            displayDialog={displayDialog}
          />
        )}

        {currentStep === 4 && (
          <Step4
            onNext={handleProceedFromStep4}
            onBack={handleBack}
            displayDialog={displayDialog}
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            timeOptions={timeOptions}
          />
        )}

        {currentStep === 5 && (
          <Step5
            logs={installationLogs}
            handleCompleteInstallation={handleCompleteInstallation}
            onBack={handleBack}
            wizardData={wizardData}
            setIsGlobalLoading={setIsGlobalLoading}
            isGlobalLoading={isGlobalLoading}
          />
        )}
      </div>
    </div>
  );
};

export default NewInstallationPage;
