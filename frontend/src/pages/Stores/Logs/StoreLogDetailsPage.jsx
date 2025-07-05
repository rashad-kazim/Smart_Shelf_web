// src/pages/Stores/StoreLogDetailsPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../../api/axiosInstance";
import { Server, Cpu, ArrowLeft } from "lucide-react";

import GlobalLoader from "../../../components/common/GlobalLoader";
import NotFoundPage from "../../misc/NotFoundPage";

const StoreLogDetailsPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { appTranslations, language, isDarkMode } = useAuth();

  const [store, setStore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const translations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const fetchStoreDetails = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
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
    return <NotFoundPage />;
  }

  const logCards = [
    {
      title: translations.serverLogsTitle,
      description: translations.serverLogsDesc,
      icon: Server,
      action: () => navigate(`/server-logs/${storeId}`),
    },
    {
      title: translations.esp32LogsTitle,
      description: translations.esp32LogsDesc,
      icon: Cpu,
      action: () => navigate(`/esp32-logs/${storeId}`),
    },
  ];

  return (
    <div
      className={`p-6 sm:p-8 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"
      }`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          {translations.logDetailsTitle}
        </h1>
        <button
          onClick={() => navigate("/view-logs")}
          className="flex items-center px-4 py-2 rounded-md font-medium bg-gray-500 hover:bg-gray-600 text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {translations.backToLogsList}
        </button>
      </div>

      <div
        className={`mb-8 p-4 rounded-lg ${
          isDarkMode ? "bg-gray-900/50" : "bg-gray-50"
        }`}>
        <h2 className="text-xl font-bold">{store.name}</h2>
        <p
          className={`text-sm ${
            isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
          {store.address}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logCards.map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-all duration-300 transform hover:scale-105 cursor-pointer ${
              isDarkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-white hover:bg-gray-50"
            }`}
            onClick={card.action}>
            <card.icon
              size={48}
              className="mb-4 text-blue-500 dark:text-blue-400"
            />
            <h2
              className={`text-xl font-semibold mb-2 ${
                isDarkMode ? "text-gray-100" : "text-gray-800"
              }`}>
              {card.title}
            </h2>
            <p
              className={`text-sm ${
                isDarkMode ? "text-gray-400" : "text-gray-600"
              }`}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreLogDetailsPage;
