// src/pages/Stores/DeleteStorePage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import { useStoreFilters } from "../../hooks/useStoreFilters";
import axiosInstance from "../../api/axiosInstance";
import StoreListPageLayout from "../../components/common/StoreListPageLayout";
import CustomDialog from "../../components/common/CustomDialog";
import { Trash2 } from "lucide-react";

const DeleteStorePage = () => {
  const { profileUser, appTranslations, language } = useAuth();

  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [isTableLoading, setIsTableLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

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

  const pageTranslations = useMemo(
    () => appTranslations[language]?.["stores.deleteStore"],
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

  const performDelete = async (storeId) => {
    setShowDialog(false);
    setIsTableLoading(true);
    try {
      await axiosInstance.delete(`/api/stores/${storeId}`);
      await fetchStores();
    } catch (err) {
      setError(err.response?.data?.detail);
      setIsTableLoading(false);
    }
  };

  const handleDeleteClick = (store) => {
    setDialogContent({
      title: storeTranslations.confirmDeleteTitle,
      message: `${storeTranslations.confirmDeleteMessage} '${store.name}'?`,
      type: "confirm",
      confirmationText: store.name,
      onConfirm: () => performDelete(store.id),
    });
    setShowDialog(true);
  };

  // Function to create the "Delete" button to be sent to the table
  const renderActions = (store) => (
    <button
      onClick={() => handleDeleteClick(store)}
      className="text-red-500 hover:text-red-700 p-2 rounded-md transition-colors"
      title={`${storeTranslations.deleteButton} ${store.name}`}>
      <Trash2 size={20} />
    </button>
  );

  return (
    <>
      {showDialog && (
        <CustomDialog
          {...dialogContent}
          onCancel={() => setShowDialog(false)}
        />
      )}
      <StoreListPageLayout
        pageTitle={pageTranslations.pageTitle}
        pageDescription={pageTranslations.pageDescription}
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
    </>
  );
};

export default DeleteStorePage;
