// src/pages/Stores/StoreEditing/StoreEditingWorkflow.jsx

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";

import StoreEditingStep1 from "./StoreEditingStep1";
import StoreEditingStep2 from "./StoreEditingStep2";
import GlobalLoader from "../../../components/common/GlobalLoader";
import PageHeader from "../../../components/common/PageHeader";
import { CheckCircle } from "lucide-react";

const mapApiDeviceToFormDevice = (apiDevice) => ({
  id: apiDevice.device_local_id || apiDevice.id,
  screenSize: apiDevice.screen_size || "",
  allDayWork: apiDevice.all_day_work || false,
  awakeTime: apiDevice.awake_time || "09:00",
  sleepTime: apiDevice.sleep_time || "21:00",
  wifi_ssid: apiDevice.wifi_ssid || "",
  wifi_password: apiDevice.wifi_password || "",
  productNameFontSize: apiDevice.product_name_font_size || 12,
  productPriceFontSizeBeforeDiscount:
    apiDevice.product_price_font_size_before_discount || 12,
  productPriceFontSizeAfterDiscount:
    apiDevice.product_price_font_size_after_discount || 12,
  productBarcodeFontSize: apiDevice.product_barcode_font_size || 12,
  productBarcodeNumbersFontSize:
    apiDevice.product_barcode_numbers_font_size || 12,
});

const mapFormDeviceToApiDevice = (formDevice) => {
  const apiDevice = {
    id: parseInt(formDevice.id, 10),
    screen_size: formDevice.screenSize || "",
    all_day_work: formDevice.allDayWork || false,
    awake_time: formDevice.allDayWork ? null : formDevice.awakeTime,
    sleep_time: formDevice.allDayWork ? null : formDevice.sleepTime,
    wifi_ssid: formDevice.wifi_ssid || "",
    wifi_password: formDevice.wifi_password || "",
    software_version: "1.0.0",
    product_name_font_size: parseInt(formDevice.productNameFontSize, 10) || 12,
    product_price_font_size_before_discount:
      parseInt(formDevice.productPriceFontSizeBeforeDiscount, 10) || 12,
    product_price_font_size_after_discount:
      parseInt(formDevice.productPriceFontSizeAfterDiscount, 10) || 12,
    product_barcode_font_size:
      parseInt(formDevice.productBarcodeFontSize, 10) || 12,
    product_barcode_numbers_font_size:
      parseInt(formDevice.productBarcodeNumbersFontSize, 10) || 12,
  };

  return apiDevice;
};

const StoreEditingWorkflow = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    isDarkMode,
    appTranslations,
    language,
    showMyDialog,
    isGlobalLoading,
    setIsGlobalLoading,
  } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const pageContainerRef = useRef(null);

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const installationWizard = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );

  const editStoreTranslations = useMemo(
    () => appTranslations[language]?.["stores.editStore"],
    [appTranslations, language]
  );

  const dialogWizard = useMemo(
    () => appTranslations[language]?.dialogs,
    [appTranslations, language]
  );

  const commonTranslation = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axiosInstance.get(`/api/stores/${storeId}`);
        const storeData = response.data;
        const formReadyDevices = (storeData.devices || []).map(
          mapApiDeviceToFormDevice
        );
        const all_day_open = storeData.working_hours === "24/7";
        let opening_hour = "09:00",
          closing_hour = "21:00";
        if (!all_day_open && storeData.working_hours?.includes("-")) {
          [opening_hour, closing_hour] = storeData.working_hours.split("-");
        }
        setWizardData({
          ...storeData,
          devices: formReadyDevices,
          addBranch: !!storeData.branch,
          all_day_open: all_day_open,
          opening_hour: opening_hour,
          closing_hour: closing_hour,
        });
      } catch (error) {
        showMyDialog({
          title: installationWizard.error,
          message: storesTranslations.couldNotLoadStoreData,
          onConfirm: () => navigate("/edit-store-details"),
        });
      } finally {
      }
    };
    fetchStoreData();
  }, [storeId, navigate, showMyDialog, storesTranslations, installationWizard]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (!isCompleted && wizardData) {
        event.preventDefault();
        event.returnValue = dialogWizard.unsavedChangesPrompt;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isCompleted, wizardData, dialogWizard.unsavedChangesPrompt]);

  useEffect(() => {
    pageContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentStep]);

  const updateWizardData = (newData) => {
    setWizardData((prev) => ({ ...prev, ...newData }));
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else navigate("/edit-store-details");
  };

  const handleSaveAllChanges = async (finalDevices) => {
    setIsGlobalLoading(true);
    try {
      const devicesForApi = (finalDevices || []).map(mapFormDeviceToApiDevice);

      const payload = {
        name: wizardData.name,
        country: wizardData.country,
        city: wizardData.city,
        branch: wizardData.addBranch ? wizardData.branch : null,
        address: wizardData.address,
        server_local_ip: wizardData.server_local_ip,
        working_hours: wizardData.all_day_open
          ? "24/7"
          : `${wizardData.opening_hour}-${wizardData.closing_hour}`,
        devices: devicesForApi,
        ownerName: wizardData.owner_name,
        ownerSurname: wizardData.owner_surname,
      };

      await axiosInstance.put(`/api/stores/${storeId}`, payload);

      setIsCompleted(true);
      showMyDialog({
        title: editStoreTranslations.successTitle,
        message: editStoreTranslations.storeUpdateSuccessMessage,
        onConfirm: () => navigate("/stores"),
      });
    } catch (error) {
      const errorDetail = error.response?.data?.detail;
      let errorMessage = commonTranslation.genericError;
      if (typeof errorDetail === "string") {
        errorMessage = errorDetail;
      } else if (Array.isArray(errorDetail)) {
        errorMessage = errorDetail
          .map((err) => `${err.loc.join(" -> ")}: ${err.msg}`)
          .join("\n");
      }
      showMyDialog({
        title: editStoreTranslations.updateFailedTitle,
        message: errorMessage,
      });
    } finally {
      setIsGlobalLoading(false);
    }
  };

  if (isGlobalLoading || !wizardData) {
    return <GlobalLoader />;
  }

  const steps = [
    {
      id: 1,
      name: editStoreTranslations.step1Title,
    },
    {
      id: 2,
      name: editStoreTranslations.step2Title,
    },
  ];

  const progressBgColor = isDarkMode ? "bg-gray-700" : "bg-gray-200";
  const progressIndicatorColor = isDarkMode ? "bg-blue-500" : "bg-blue-600";

  return (
    <div className="p-4 sm:p-6" ref={pageContainerRef}>
      <PageHeader
        title={editStoreTranslations.workflowTitle}
        subtitle={wizardData.name}
      />
      <div className="w-[200px] max-w-xs mx-auto px-4 sm:px-0 my-12">
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
                  {isCompleted || currentStep > step.id ? (
                    <CheckCircle size={20} />
                  ) : (
                    step.id
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-8">
        {currentStep === 1 && (
          <StoreEditingStep1
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {currentStep === 2 && (
          <StoreEditingStep2
            wizardData={wizardData}
            updateWizardData={updateWizardData}
            onBack={handleBack}
            onSaveAll={(finalDevices) => handleSaveAllChanges(finalDevices)}
          />
        )}
      </div>
    </div>
  );
};

export default StoreEditingWorkflow;
