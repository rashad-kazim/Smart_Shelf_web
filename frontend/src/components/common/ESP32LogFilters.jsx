// src/components/common/ESP32LogFilters.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { SlidersHorizontal, RotateCcw, Battery } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ESP32LogFilters = ({
  filters,
  setFilters,
  onReset,
  uniqueVersions,
  availableLogTimes,
}) => {
  const { isDarkMode, appTranslations, language } = useAuth();

  const inputClass = `w-full p-2 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600"
      : "bg-white text-gray-800 border-gray-300"
  }`;

  const translations = useMemo(
    () => appTranslations[language]?.["stores.esp32LogFilters"],
    [appTranslations, language]
  );

  const disabledOptionClass = isDarkMode
    ? "text-gray-500 bg-gray-800"
    : "text-gray-400 bg-gray-100";

  // When the date changes, smartly adjust the log time filter
  const handleDateChange = (date) => {
    setFilters((prev) => {
      // For the new date, check the current log types
      const newFilters = { ...prev, date };

      // If a log time is selected and not available for that day, set to "All"
      if (prev.logTime !== "All") {
        const isAvailable =
          (prev.logTime === "Opening" && availableLogTimes.hasOpening) ||
          (prev.logTime === "MidDay" && availableLogTimes.hasMidDay) ||
          (prev.logTime === "Closing" && availableLogTimes.hasClosing);

        if (!isAvailable) {
          newFilters.logTime = "All";
        }
      }

      return newFilters;
    });
  };

  // Check when log time changes
  const handleLogTimeChange = (e) => {
    const newLogTime = e.target.value;

    // If the selected option is disabled, do not change
    if (newLogTime === "Opening" && !availableLogTimes.hasOpening) return;
    if (newLogTime === "MidDay" && !availableLogTimes.hasMidDay) return;
    if (newLogTime === "Closing" && !availableLogTimes.hasClosing) return;

    setFilters((prev) => ({ ...prev, logTime: newLogTime }));
  };

  // Calculate the last 30 days (for datepicker)
  const maxDate = new Date();
  const minDate = new Date();
  minDate.setDate(minDate.getDate() - 30);

  return (
    <div
      className={`p-4 rounded-lg border mb-6 ${
        isDarkMode
          ? "bg-gray-900/50 border-gray-700"
          : "bg-gray-50 border-gray-200"
      }`}>
      <div className="flex items-center mb-4">
        <SlidersHorizontal size={16} className="mr-2 text-gray-500" />
        <h3 className="text-lg font-semibold">{translations?.filterTitle}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
        {/* Date (Calendar) Filter */}
        <div>
          <label
            htmlFor="dateFilter"
            className="block text-sm font-medium mb-1">
            {translations?.date}
          </label>
          <DatePicker
            id="dateFilter"
            selected={filters.date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            className={inputClass}
            maxDate={maxDate} // Cannot select a date after today
            minDate={minDate} // Cannot select a date older than 30 days ago
            placeholderText={translations?.selectDate}
          />
        </div>

        {/* Log Time Filter (Dynamically disables) */}
        <div>
          <label
            htmlFor="logTimeFilter"
            className="block text-sm font-medium mb-1">
            {translations?.logTime}
          </label>
          <select
            id="logTimeFilter"
            name="logTime"
            value={filters.logTime}
            onChange={handleLogTimeChange}
            className={inputClass}>
            <option value="All">{translations?.allTimes}</option>
            <option
              value="Opening"
              disabled={!availableLogTimes.hasOpening}
              className={
                !availableLogTimes.hasOpening ? disabledOptionClass : ""
              }>
              {translations?.opening}
              {!availableLogTimes.hasOpening && translations?.noDataSuffix}
            </option>
            <option
              value="MidDay"
              disabled={!availableLogTimes.hasMidDay}
              className={
                !availableLogTimes.hasMidDay ? disabledOptionClass : ""
              }>
              {translations?.midDay}
              {!availableLogTimes.hasMidDay && translations?.noDataSuffix}
            </option>
            <option
              value="Closing"
              disabled={!availableLogTimes.hasClosing}
              className={
                !availableLogTimes.hasClosing ? disabledOptionClass : ""
              }>
              {translations?.closing}
              {!availableLogTimes.hasClosing && translations?.noDataSuffix}
            </option>
          </select>
        </div>

        {/* Battery Level Filter */}
        <div>
          <label
            htmlFor="batteryFilter"
            className="flex items-center text-sm font-medium mb-1">
            <Battery size={14} className="mr-1" />
            {translations?.batteryLevel}
          </label>
          <select
            id="batteryFilter"
            name="batteryLevel"
            value={filters.batteryLevel}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, batteryLevel: e.target.value }))
            }
            className={inputClass}>
            <option value="All Batteries">{translations?.allBatteries}</option>
            <option value=">50">{translations?.highBattery} (&gt;50%)</option>
            <option value="20-50">{translations?.mediumBattery}</option>
            <option value="<20">{translations?.lowBattery} (&lt;20%)</option>
          </select>
        </div>

        {/* Software Version Filter */}
        <div>
          <label
            htmlFor="versionFilter"
            className="block text-sm font-medium mb-1">
            {translations?.softwareVersion}
          </label>
          <select
            id="versionFilter"
            name="version"
            value={filters.version}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, version: e.target.value }))
            }
            className={inputClass}>
            {uniqueVersions.map((v) => (
              <option key={v || "all"} value={v}>
                {v === "" ? translations?.allVersions : `v${v}`}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div>
          <button
            onClick={onReset}
            className={`flex items-center w-full justify-center px-4 py-2 rounded-md font-medium text-white transition-colors ${
              isDarkMode
                ? "bg-gray-600 hover:bg-gray-500"
                : "bg-gray-500 hover:bg-gray-600"
            }`}>
            <RotateCcw size={16} className="mr-2" />
            {translations?.resetFilters}
          </button>
        </div>
      </div>

      {/* Info message */}
      <div className="mt-3 text-xs text-gray-500">
        <p>{translations?.filterInfo}</p>
      </div>
    </div>
  );
};

export default ESP32LogFilters;
