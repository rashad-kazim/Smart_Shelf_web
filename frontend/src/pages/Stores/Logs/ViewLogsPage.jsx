// src/pages/Stores/ViewLogsPage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useStoreFilters } from "../../../hooks/useStoreFilters";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";

// Shared and reusable components
import StoresTable from "../../../components/stores/StoresTable";
import FilterControls from "../../../components/common/FilterControls";
import GlobalLoader from "../../../components/common/GlobalLoader";
import { FileText } from "lucide-react";

const ViewLogsPage = () => {
  const { profileUser, isAuthLoading, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  // Filtering logic comes from the central hook
  const {
    filteredStores,
    countryOptions,
    cityOptions,
    selectedCountries,
    selectedCities,
    toggleCountry,
    toggleCity,
    resetFilters,
  } = useStoreFilters(stores, profileUser);

  // Translations
  const translations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  // Function to fetch stores from the backend
  const fetchStores = useCallback(async () => {
    setIsTableLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/stores");
      setStores(response.data);
    } catch (err) {
      setError(translations.fetchError);
    } finally {
      setIsTableLoading(false);
    }
  }, [translations]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchStores();
    }
  }, [fetchStores, isAuthLoading]);

  // Function to navigate to the log details page
  const handleViewLogs = (storeId) => {
    navigate(`/store-log-details/${storeId}`);
  };

  // Function to create the "View Logs" button for each row in the table
  const renderActions = (store) => (
    <button
      onClick={() => handleViewLogs(store.id)}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      title={`${translations.viewLogsButton} ${store.name}`}>
      <FileText size={16} className="mr-2" />
      {translations.viewLogsButton}
    </button>
  );

  if (isAuthLoading || !profileUser) {
    return <GlobalLoader />;
  }

  const isAdmin = profileUser.role === "Admin";

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">
        {translations.viewLogsTitle}
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">
        {translations.viewLogsDesc}
      </p>

      <FilterControls
        profileUser={profileUser}
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        selectedCountries={selectedCountries}
        selectedCities={selectedCities}
        onCountryChange={toggleCountry}
        onCityChange={toggleCity}
        onReset={resetFilters}
        isCountryDisabled={!isAdmin}
      />

      {error && (
        <div className="my-4 p-4 text-center text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6">
        <StoresTable
          stores={filteredStores}
          isLoading={isTableLoading}
          renderActions={renderActions}
        />
      </div>
    </div>
  );
};

export default ViewLogsPage;
