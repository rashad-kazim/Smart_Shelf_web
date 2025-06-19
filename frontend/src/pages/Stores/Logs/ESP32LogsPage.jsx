// src/pages/Stores/ESP32LogsPage.jsx
import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import NotFoundPage from "../../misc/NotFoundPage";

const ESP32LogsPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    stores,
    installedDevices,
    currentColors: colors,
    appTranslations,
    language,
  } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.stores || {},
    [appTranslations, language]
  );
  const store = useMemo(
    () => stores.find((s) => s.id === parseInt(storeId, 10)),
    [stores, storeId]
  );

  const [versionFilter, setVersionFilter] = useState("");
  const [batteryFilter, setBatteryFilter] = useState("");

  const devicesForStore = useMemo(() => {
    // FIX: (installedDevices || []) expression protects against the possibility of undefined
    return (installedDevices || []).filter(
      (device) => device.storeId === parseInt(storeId, 10)
    );
  }, [installedDevices, storeId]);

  const uniqueVersions = useMemo(() => {
    return [...new Set(devicesForStore.map((device) => device.softwareVersion))]
      .filter(Boolean)
      .sort();
  }, [devicesForStore]);

  const filteredDevices = useMemo(() => {
    return devicesForStore.filter((device) => {
      const versionMatch =
        !versionFilter || device.softwareVersion === versionFilter;
      const batteryMatch =
        !batteryFilter ||
        (batteryFilter === "less_than_25" && device.batteryStatus < 25) ||
        (batteryFilter === "25_to_50" &&
          device.batteryStatus >= 25 &&
          device.batteryStatus <= 50) ||
        (batteryFilter === "greater_than_50" && device.batteryStatus > 50);
      return versionMatch && batteryMatch;
    });
  }, [devicesForStore, versionFilter, batteryFilter]);

  if (!store) {
    return <NotFoundPage />;
  }

  const inputStyle = {
    backgroundColor: colors.pureWhite,
    color: colors.darkText,
    borderColor: colors.mediumGrayText,
  };

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          {translations.esp32LogsTitle || "ESP32 Logs"} - {store.name}
        </h1>
        <button
          onClick={() => navigate(`/store-log-details/${storeId}`)}
          className="px-4 py-2 rounded-md font-medium flex items-center"
          style={{
            backgroundColor: colors.prevButtonBg,
            color: colors.whiteText,
          }}>
          <ArrowLeft size={20} className="mr-2" />
          {translations.backToStoreLogDetails || "Back to Log Details"}
        </button>
      </div>

      <div
        className="flex flex-wrap items-end gap-4 mb-6 p-4 rounded-md"
        style={{ backgroundColor: colors.lightGrayBg }}>
        <div>
          <label
            htmlFor="version-filter"
            className="block text-sm font-medium mb-1">
            {translations.softwareVersion || "Software Version"}
          </label>
          <select
            id="version-filter"
            value={versionFilter}
            onChange={(e) => setVersionFilter(e.target.value)}
            className="p-2 border rounded-md"
            style={inputStyle}>
            <option value="">
              {translations.allVersions || "All Versions"}
            </option>
            {uniqueVersions.map((version) => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="battery-filter"
            className="block text-sm font-medium mb-1">
            {translations.batteryStatus || "Battery Status"}
          </label>
          <select
            id="battery-filter"
            value={batteryFilter}
            onChange={(e) => setBatteryFilter(e.target.value)}
            className="p-2 border rounded-md"
            style={inputStyle}>
            <option value="">
              {translations.allBatteryLevels || "All Levels"}
            </option>
            <option value="less_than_25">
              {translations.batteryLessThan25 || "< 25%"}
            </option>
            <option value="25_to_50">
              {translations.battery25To50 || "25% - 50%"}
            </option>
            <option value="greater_than_50">
              {translations.batteryGreaterThan50 || "> 50%"}
            </option>
          </select>
        </div>
      </div>

      <div
        className="overflow-x-auto rounded-lg border"
        style={{ borderColor: colors.mediumGrayText }}>
        <table
          className="min-w-full divide-y"
          style={{ borderColor: colors.mediumGrayText }}>
          <thead style={{ backgroundColor: colors.lightGrayBg }}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.esp32LogId || "ID"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.dataRefreshRate || "Refresh Rate"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.mosfetStatus || "Mosfet Status"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.softwareVersion || "Version"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.batteryStatus || "Battery"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.sleepTime || "Sleep Time"}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider">
                {translations.awakeTime || "Awake Time"}
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: colors.pureWhite }}>
            {filteredDevices.length > 0 ? (
              filteredDevices.map((device) => (
                <tr
                  key={device.id}
                  className="border-t hover:bg-gray-100 dark:hover:bg-gray-700"
                  style={{ borderColor: colors.lightGrayBg }}>
                  <td className="px-4 py-4">{device.id}</td>
                  <td className="px-4 py-4">{device.refreshRate || "N/A"}</td>
                  <td className="px-4 py-4">{device.mosfetStatus || "N/A"}</td>
                  <td className="px-4 py-4">
                    {device.softwareVersion || "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    {device.batteryStatus ? `${device.batteryStatus}%` : "N/A"}
                  </td>
                  <td className="px-4 py-4">{device.sleepTime || "N/A"}</td>
                  <td className="px-4 py-4">{device.awakeTime || "N/A"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  {translations.noEsp32DevicesFound ||
                    "No ESP32 devices found for this store."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ESP32LogsPage;
