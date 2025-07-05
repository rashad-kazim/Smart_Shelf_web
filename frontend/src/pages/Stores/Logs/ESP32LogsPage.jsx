// src/pages/Stores/Logs/ESP32LogsPage.jsx
// STATUS: FINAL (Improved filter logic and display + Battery filter)

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { ArrowLeft } from "lucide-react";

import ESP32LogFilters from "../../../components/common/ESP32LogFilters";
import GlobalLoader from "../../../components/common/GlobalLoader";

import NotFoundPage from "../../misc/NotFoundPage";

// Helper function to parse the log message
const parseLogMessage = (message) => {
  const details = {};
  message.split(",").forEach((part) => {
    const [key, value] = part.split(":").map((s) => s.trim());
    if (key && value) details[key] = value;
  });
  return {
    battery: details.battery || "N/A",
    refreshRate: details.refresh || "N/A",
    mosfet: details.mosfet || "N/A",
    version: details.version || "1.0.0",
  };
};

// Function to categorize log time
const getLogTimeCategory = (timestamp) => {
  const hour = new Date(timestamp).getHours();
  if (hour >= 6 && hour <= 10) return "Opening";
  if (hour >= 11 && hour <= 15) return "MidDay";
  if (hour >= 17) return "Closing";
  return "Other";
};

// Function to categorize battery level
const getBatteryCategory = (batteryLevel) => {
  const level = parseInt(batteryLevel);
  if (isNaN(level)) return "unknown";
  if (level > 50) return "high";
  if (level >= 20) return "medium";
  return "low";
};

// Battery bar component
const BatteryBar = ({ batteryLevel, isDarkMode }) => {
  const level = parseInt(batteryLevel);

  if (isNaN(level) || batteryLevel === "N/A") {
    return (
      <div className="flex items-center">
        <span className="text-gray-500">N/A</span>
      </div>
    );
  }

  const category = getBatteryCategory(batteryLevel);
  const barColor =
    category === "high"
      ? "bg-green-500"
      : category === "medium"
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-16 h-2 rounded-full ${
          isDarkMode ? "bg-gray-600" : "bg-gray-200"
        }`}>
        <div
          className={`h-full rounded-full ${barColor}`}
          style={{ width: `${Math.min(level, 100)}%` }}
        />
      </div>
      <span className="text-sm font-mono">{level}%</span>
    </div>
  );
};

const ESP32LogsPage = () => {
  const { storeId } = useParams();
  const { isDarkMode, appTranslations, language } = useAuth();

  const [store, setStore] = useState(null);
  const [allLogs, setAllLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    date: new Date(), // Initially shows today
    logTime: "All",
    version: "",
    batteryLevel: "All Batteries", // New battery filter
  });

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores || appTranslations.en?.stores,
    [appTranslations, language]
  );
  const tableTranslations = useMemo(
    () => appTranslations[language]?.["stores.esp32LogTable"],
    [appTranslations, language]
  );
  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  // Function to fetch logs for the last 30 days
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [storeResponse, logsResponse] = await Promise.all([
        axiosInstance.get(`/api/stores/${storeId}`),
        axiosInstance.get(`/api/ops/logs/${storeId}?days=30`),
      ]);

      const esp32Logs = (logsResponse.data || []).filter((log) =>
        log.source.toUpperCase().startsWith("ESP32")
      );

      setStore(storeResponse.data);
      setAllLogs(esp32Logs);

      // Find the date of the most recent log and set it as default
      if (esp32Logs.length > 0) {
        // Sort logs by date (newest first)
        const sortedLogs = esp32Logs.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        const mostRecentLogDate = new Date(sortedLogs[0].timestamp);

        // Find logs for the most recent day
        const logsForMostRecentDay = esp32Logs.filter(
          (log) =>
            new Date(log.timestamp).toDateString() ===
            mostRecentLogDate.toDateString()
        );

        // Determine the most recent log type for that day
        let defaultLogTime = "All";
        const logTimeCategories = logsForMostRecentDay.map((log) =>
          getLogTimeCategory(log.timestamp)
        );

        if (logTimeCategories.includes("Closing")) {
          defaultLogTime = "Closing";
        } else if (logTimeCategories.includes("MidDay")) {
          defaultLogTime = "MidDay";
        } else if (logTimeCategories.includes("Opening")) {
          defaultLogTime = "Opening";
        }

        setFilters({
          date: mostRecentLogDate,
          logTime: defaultLogTime,
          version: "",
          batteryLevel: "All Batteries",
        });
      }
    } catch (err) {
      setError(commonTranslations.couldNotLoadData);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, commonTranslations.couldNotLoadData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtering Logic
  const { filteredLogs, availableLogTimes, uniqueVersions } = useMemo(() => {
    const versions = [
      ...new Set(allLogs.map((log) => parseLogMessage(log.message).version)),
    ]
      .filter(Boolean)
      .sort();

    const logsForSelectedDay = allLogs.filter((log) => {
      return (
        new Date(log.timestamp).toDateString() === filters.date.toDateString()
      );
    });

    // Check available log times for the selected day
    const availableTimes = {
      hasOpening: logsForSelectedDay.some(
        (log) => getLogTimeCategory(log.timestamp) === "Opening"
      ),
      hasMidDay: logsForSelectedDay.some(
        (log) => getLogTimeCategory(log.timestamp) === "MidDay"
      ),
      hasClosing: logsForSelectedDay.some(
        (log) => getLogTimeCategory(log.timestamp) === "Closing"
      ),
    };

    const finalFilteredLogs = logsForSelectedDay.filter((log) => {
      const parsedDetails = parseLogMessage(log.message);

      // Version filter
      if (filters.version && parsedDetails.version !== filters.version)
        return false;

      // Log time filter
      if (filters.logTime !== "All") {
        const logCategory = getLogTimeCategory(log.timestamp);
        if (logCategory !== filters.logTime) return false;
      }

      // Battery level filter
      if (filters.batteryLevel !== "All Batteries") {
        const batteryLevel = parseInt(parsedDetails.battery);
        if (!isNaN(batteryLevel)) {
          switch (filters.batteryLevel) {
            case ">50":
              if (batteryLevel <= 50) return false;
              break;
            case "20-50":
              if (batteryLevel < 20 || batteryLevel > 50) return false;
              break;
            case "<20":
              if (batteryLevel >= 20) return false;
              break;
            default:
              // If the filter value is not recognized, do not filter out the log
              break;
          }
        } else if (filters.batteryLevel !== "All Batteries") {
          // If there is no battery data and "All Batteries" is not selected, filter out the log
          return false;
        }
      }

      return true;
    });

    return {
      filteredLogs: finalFilteredLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
      availableLogTimes: availableTimes,
      uniqueVersions: ["", ...versions],
    };
  }, [allLogs, filters]);

  const handleResetFilters = () => {
    // When resetting, set the date of the most recent log and the default log type for that day
    if (allLogs.length > 0) {
      const sortedLogs = allLogs.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );
      const mostRecentLogDate = new Date(sortedLogs[0].timestamp);

      const logsForMostRecentDay = allLogs.filter(
        (log) =>
          new Date(log.timestamp).toDateString() ===
          mostRecentLogDate.toDateString()
      );

      let defaultLogTime = "All";
      const logTimeCategories = logsForMostRecentDay.map((log) =>
        getLogTimeCategory(log.timestamp)
      );

      if (logTimeCategories.includes("Closing")) {
        defaultLogTime = "Closing";
      } else if (logTimeCategories.includes("MidDay")) {
        defaultLogTime = "MidDay";
      } else if (logTimeCategories.includes("Opening")) {
        defaultLogTime = "Opening";
      }

      setFilters({
        date: mostRecentLogDate,
        logTime: defaultLogTime,
        version: "",
        batteryLevel: "All Batteries",
      });
    } else {
      setFilters({
        date: new Date(),
        logTime: "All",
        version: "",
        batteryLevel: "All Batteries",
      });
    }
  };

  if (isLoading) return <GlobalLoader />;
  if (error) return <NotFoundPage message={error} />;
  if (!store)
    return <NotFoundPage message={storesTranslations.storeNotFound} />;

  const headerClass = `px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
    isDarkMode ? "text-gray-300" : "text-gray-500"
  }`;

  return (
    <div
      className={`p-6 sm:p-8 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ESP32 Logs - {store.name}</h1>
        <button
          onClick={() => navigate(`/store-log-details/${storeId}`)}
          className="flex items-center px-4 py-2 rounded-md font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {storesTranslations.backToStoreLogDetails || "Back to Log Details"}
        </button>
      </div>

      <ESP32LogFilters
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
        uniqueVersions={uniqueVersions}
        availableLogTimes={availableLogTimes}
      />

      <div
        className={`overflow-hidden rounded-lg border ${
          isDarkMode ? "border-gray-700" : "border-gray-600"
        }`}>
        <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead
              className={`${
                isDarkMode ? "bg-gray-700/50" : "bg-gray-50"
              } sticky top-0`}>
              <tr>
                <th className={headerClass}>#</th>
                <th className={headerClass}>
                  {tableTranslations.headerTimestamp}
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerDeviceId}
                </th>
                <th className={headerClass}>{tableTranslations.headerStore}</th>
                <th className={headerClass}>
                  {tableTranslations.headerBranch}
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerBattery} (%)
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerRefresh} (ms)
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerMosfet}
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerVersion}
                </th>
                <th className={headerClass}>
                  {tableTranslations.headerLogType}
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isDarkMode
                  ? "divide-gray-700 bg-gray-800"
                  : "divide-gray-200 bg-white"
              }`}>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {
                  const details = parseLogMessage(log.message);
                  const deviceId = log.source.split("-")[1] || log.source;
                  const logType = getLogTimeCategory(log.timestamp);
                  const timestamp = new Date(log.timestamp);

                  return (
                    <tr
                      key={log.id}
                      className={
                        isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                      }>
                      <td className="px-6 py-4 text-gray-500">{index + 1}</td>
                      <td className="px-6 py-4 font-mono text-sm">
                        {timestamp.toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </td>
                      <td className="px-6 py-4 font-mono">{deviceId}</td>
                      <td className="px-6 py-4 font-medium">{store.name}</td>
                      <td className="px-6 py-4">{store.branch || "-"}</td>
                      <td className="px-6 py-4">
                        <BatteryBar
                          batteryLevel={details.battery}
                          isDarkMode={isDarkMode}
                        />
                      </td>
                      <td className="px-6 py-4">{details.refreshRate}</td>
                      <td className="px-6 py-4">{details.mosfet}</td>
                      <td className="px-6 py-4">{details.version}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            logType === "Opening"
                              ? "bg-green-100 text-green-800"
                              : logType === "MidDay"
                              ? "bg-yellow-100 text-yellow-800"
                              : logType === "Closing"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                          {logType}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-lg font-medium mb-2">
                        {tableTranslations.noLogsFoundTitle}
                      </p>
                      <p className="text-sm">
                        {tableTranslations.noLogsFoundMessage}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ESP32LogsPage;
