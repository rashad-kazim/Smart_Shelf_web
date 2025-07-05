// src/pages/Stores/Logs/ServerLogsPage.jsx

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { ArrowLeft } from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";
import NotFoundPage from "../../misc/NotFoundPage";
import GlobalLoader from "../../../components/common/GlobalLoader";

const ServerLogsPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    currentColors: colors,
    appTranslations,
    language,
    isDarkMode,
  } = useAuth();

  // This page now manages its own data
  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  // Function to fetch store details when the page first loads
  const fetchStoreDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Directly fetch the details of the relevant store from the backend
      const response = await axiosInstance.get(`/api/stores/${storeId}`);
      setStore(response.data);
    } catch (err) {
      setError(translations.couldNotLoadStoreData);
    } finally {
      setIsLoading(false);
    }
  }, [storeId, translations.couldNotLoadStoreData]);

  useEffect(() => {
    fetchStoreDetails();
  }, [fetchStoreDetails]);

  if (isLoading) {
    return <GlobalLoader />;
  }
  if (error) {
    return <NotFoundPage message={error} />;
  }
  if (!store) {
    // Show this page if the store is not found (e.g., if the ID is incorrect)
    return <NotFoundPage message="Store not found." />;
  }

  // Info cards now read data from the local 'store' state.
  const infoCards = [
    {
      label: translations.serverSoftwareVersion,
      value: store.server_version || "1.0.0",
    },
    {
      label: translations.lastUpdateDate,
      value: formatDateTime(store.last_update_date, translations),
    },
    {
      label: translations.connectedEsp32Count,
      value: store.num_esp32_connected ?? 0,
    },
    {
      label: translations.serverToken,
      value: store.server_token,
      fullWidth: true,
    },
    { label: translations.country, value: store.country },
    { label: translations.city, value: store.city },
    { label: translations.storeName, value: store.name },
    {
      label: translations.registeredByName,
      value: `${store.owner_name} ${store.owner_surname}`,
    },
  ];

  return (
    <div
      className={`p-6 sm:p-8 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      }`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{store.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {translations.serverLogsTitle}
          </p>
        </div>
        <button
          onClick={() => navigate(`/store-log-details/${storeId}`)}
          className="flex items-center px-4 py-2 rounded-md font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {translations.backToStoreLogDetails}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-sm ${
              card.fullWidth ? "lg:col-span-3" : ""
            } ${isDarkMode ? "bg-gray-700/50" : "bg-gray-50"}`}
            style={{ borderLeft: `4px solid ${colors.logoPrimaryBlue}` }}>
            <h3
              className={`text-xs font-bold uppercase mb-2 tracking-wider ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
              {card.label}
            </h3>
            <p className="text-lg font-semibold break-words">
              {card.value || "-"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerLogsPage;
