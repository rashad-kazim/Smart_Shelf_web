// src/components/InstallationSteps/Step4Details/DeviceList.jsx
// STATUS: FIXED - Screen Size display issue has been resolved

import React, { useMemo } from "react";
import { Edit, Trash2, Wifi, Clock, Sun } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const DeviceList = ({ devices, onEdit, onDelete }) => {
  const { isDarkMode, appTranslations, language } = useAuth();

  // Merge from 2 different translation sections
  const translations = useMemo(() => {
    const wizardPart = appTranslations[language]?.["stores.installationWizard"];

    const commonPart = appTranslations[language]?.common;

    return {
      ...commonPart,
      ...wizardPart,
    };
  }, [appTranslations, language]);

  if (!devices || devices.length === 0) {
    return (
      <div
        className={`text-center p-8 border-2 border-dashed rounded-lg ${
          isDarkMode ? "border-gray-600" : "border-gray-300"
        }`}>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-500"}>
          {translations?.noDevicesYet || "No devices have been added yet."}
        </p>
      </div>
    );
  }

  // Function to get the screen size correctly
  const getScreenSize = (device) => {
    // First check camelCase format (used in frontend)
    if (device.screenSize) return device.screenSize;
    // Then check snake_case format (coming from backend)
    if (device.screen_size) return device.screen_size;
    // If neither exists, return N/A
    return "N/A";
  };

  // Function to get the WIFI SSID correctly
  const getWifiSsid = (device) => {
    return device.wifi_ssid || "No SSID";
  };

  // Function to get the working hours correctly
  const getWorkingHours = (device) => {
    const isAllDay = device.allDayWork || device.all_day_work;

    if (isAllDay) {
      return {
        isAllDay: true,
        awakeTime: null,
        sleepTime: null,
      };
    }

    return {
      isAllDay: false,
      awakeTime: device.awakeTime || device.awake_time || "N/A",
      sleepTime: device.sleepTime || device.sleep_time || "N/A",
    };
  };

  return (
    <ul className="space-y-3">
      {devices.map((device) => {
        const screenSize = getScreenSize(device);
        const wifiSsid = getWifiSsid(device);
        const workingHours = getWorkingHours(device);

        return (
          <li
            key={device.id}
            className={`p-4 rounded-lg shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center ${
              isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}>
            <div className="flex-grow mb-3 sm:mb-0">
              <div className="flex items-center mb-2">
                <span
                  className={`font-bold text-lg ${
                    isDarkMode ? "text-white" : "text-gray-900"
                  }`}>
                  ID: {device.id}
                </span>
                <span
                  className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isDarkMode
                      ? "bg-blue-900 text-blue-300"
                      : "bg-blue-100 text-blue-800"
                  }`}>
                  {screenSize}
                </span>
              </div>
              <div className="flex flex-wrap items-center text-sm space-x-4">
                <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                  <Wifi size={14} className="mr-1.5" />
                  {wifiSsid}
                </span>
                {workingHours.isAllDay ? (
                  <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                    <Sun size={14} className="mr-1.5 text-yellow-500" />
                    All Day
                  </span>
                ) : (
                  <span className="inline-flex items-center text-gray-500 dark:text-gray-400">
                    <Clock size={14} className="mr-1.5" />
                    {workingHours.awakeTime} - {workingHours.sleepTime}
                  </span>
                )}
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onEdit(device)}
                className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors"
                title="Edit Device">
                <Edit size={18} />
              </button>
              <button
                type="button"
                onClick={() => onDelete(device.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full transition-colors"
                title="Delete Device">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default DeviceList;
