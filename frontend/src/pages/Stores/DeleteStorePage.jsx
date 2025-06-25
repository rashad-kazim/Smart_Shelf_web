// src/pages/Stores/DeleteStorePage.jsx

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useStoreFilters } from "../../hooks/useStoreFilters";
import { ROLES } from "../../config/roles";
import axiosInstance from "../../api/axiosInstance";
import StoresTable from "../../components/stores/StoresTable";
import CustomDialog from "../../components/common/CustomDialog";
import FilterControls from "../../components/common/FilterControls";
import GlobalLoader from "../../components/common/GlobalLoader";

const DeleteStorePage = () => {
  const {
    profileUser,
    isAuthLoading,
    isTableLoading,
    setIsTableLoading,
    currentColors,
    appTranslations,
    language,
  } = useAuth();

  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState({});

  // Hook'tan gelen tüm değerleri ve fonksiyonları eksiksiz alıyoruz
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
    () => appTranslations[language]?.deleteStore || {},
    [appTranslations, language]
  );
  const translations = useMemo(
    () => appTranslations[language]?.stores || {},
    [appTranslations, language]
  );

  const fetchStores = useCallback(async () => {
    setIsTableLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get("/api/stores");
      setStores(response.data);
    } catch (err) {
      setError(
        pageTranslations.fetchError || "Mağazalar yüklenirken bir hata oluştu."
      );
    } finally {
      setIsTableLoading(false);
    }
  }, [setIsTableLoading, pageTranslations]);

  useEffect(() => {
    if (!isAuthLoading) {
      fetchStores();
    }
  }, [fetchStores, isAuthLoading]);

  const performDelete = async (storeId) => {
    setIsTableLoading(true);
    try {
      await axiosInstance.delete(`/api/stores/${storeId}`);
      fetchStores();
    } catch (err) {
      setError(
        pageTranslations.deleteError || "Mağaza silinirken bir hata oluştu."
      );
    } finally {
      setIsTableLoading(false);
    }
  };

  const handleDeleteClick = (store) => {
    setDialogContent({
      title: translations.confirmDeleteTitle || "Confirm Deletion",
      message: `${
        translations.confirmDeleteMessage || "Are you sure you want to delete"
      } '${store.name}'?`,
      type: "confirm",
      confirmationText: store.name,
      onConfirm: () => {
        setShowDialog(false);
        performDelete(store.id);
      },
      onCancel: () => setShowDialog(false),
    });
    setShowDialog(true);
  };

  const renderStoreActions = (store) => (
    <button
      onClick={() => handleDeleteClick(store)}
      className="text-red-500 hover:text-red-700 p-2 rounded-md transition-colors duration-200"
      title={`${translations.deleteButton || "Delete"} ${store.name}`}>
      <Trash2 size={20} />
    </button>
  );

  if (isAuthLoading || !profileUser) {
    return <GlobalLoader />;
  }

  const isAdmin = profileUser.role === ROLES.ADMIN;

  return (
    <>
      {showDialog && <CustomDialog {...dialogContent} />}
      <div className="p-4 sm:p-6">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: currentColors.darkText }}>
          {pageTranslations.pageTitle || "Delete a Store"}
        </h1>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          {pageTranslations.pageDescription ||
            "Select a store to permanently remove it from the system."}
        </p>

        <FilterControls
          countryOptions={countryOptions}
          cityOptions={cityOptions}
          selectedCountries={selectedCountries}
          selectedCities={selectedCities} // Güncellendi
          toggleCountry={toggleCountry}
          toggleCity={toggleCity} // Yeni prop eklendi
          resetFilters={resetFilters} // resetFilters -> onReset yerine
          isCountryDisabled={!isAdmin}
        />

        {error && (
          <div className="my-4 p-4 text-center text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        <StoresTable
          stores={filteredStores}
          isLoading={isTableLoading}
          renderActions={renderStoreActions}
        />
      </div>
    </>
  );
};

export default DeleteStorePage;
