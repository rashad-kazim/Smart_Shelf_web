// src/pages/Stores/EditStoreDetailsPage.jsx
// STATUS: FINAL (Consistent integration with DeleteStorePage)

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useStoreFilters } from "../../../hooks/useStoreFilters";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../api/axiosInstance";
import StoreListPageLayout from "../../../components/common/StoreListPageLayout";
import { Edit } from "lucide-react";

const EditStoreDetailsPage = () => {
  const { profileUser, appTranslations, language } = useAuth();
  const navigate = useNavigate();

  // --- All data and state management is here ---
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
  const pageCustomTranslations = useMemo(
    () => appTranslations[language]?.["stores.editStore"],
    [appTranslations, language]
  );

  const storeTranslations = useMemo(
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
      setError(storeTranslations.fetchError);
    } finally {
      setIsTableLoading(false);
    }
  }, [storeTranslations]);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  // Redirects to the edit flow of the relevant store when the "Edit" button is clicked
  const handleEditStore = (storeId) => {
    navigate(`/edit-store-workflow/${storeId}`);
  };

  const renderActions = (store) => (
    <button
      onClick={() => handleEditStore(store.id)}
      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      title={`${storeTranslations.editButton} ${store.name}`}>
      <Edit size={16} className="mr-2" />
      {storeTranslations.editButton}
    </button>
  );

  return (
    <StoreListPageLayout
      pageTitle={pageCustomTranslations.pageTitle}
      pageDescription={pageCustomTranslations.pageDescription}
      stores={filteredStores}
      isLoading={isTableLoading}
      error={error}
      profileUser={profileUser}
      countryOptions={countryOptions}
      cityOptions={cityOptions}
      selectedCountries={selectedCountries}
      selectedCities={selectedCities}
      onCountryChange={toggleCountry}
      onCityChange={toggleCity}
      onReset={resetFilters}
      renderStoreActions={renderActions}
    />
  );
};

export default EditStoreDetailsPage;
