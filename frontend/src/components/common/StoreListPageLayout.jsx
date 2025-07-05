// src/components/common/StoreListPageLayout.jsx
// STATUS: FINAL (The ultimate structure with all props sent completely and only a "view" component)

import React from "react";
import { useAuth } from "../../context/AuthContext";
import StoresTable from "../../components/stores/StoresTable";
import FilterControls from "../../components/common/FilterControls";
import GlobalLoader from "../../components/common/GlobalLoader";

const StoreListPageLayout = ({
  // Page titles
  pageTitle,
  pageDescription,

  // Data and states coming from outside
  stores,
  isLoading,
  error,

  // All props required for filtering
  profileUser,
  countryOptions,
  cityOptions,
  selectedCountries,
  selectedCities,
  onCountryChange,
  onCityChange,
  onReset,

  // Action button to be sent to the table
  renderStoreActions,
}) => {
  const { currentColors } = useAuth();
  const isAdmin = profileUser.role === "Admin";

  // We only get the part from the translation files for the filter controls component.

  return (
    <div className="p-4 sm:p-6">
      {/* If there is a global loading state on the page (e.g. initial authentication), it is shown */}
      {isLoading && <GlobalLoader />}

      <h1
        className="text-2xl sm:text-3xl font-bold mb-2"
        style={{ color: currentColors.darkText }}>
        {pageTitle}
      </h1>
      <p className="mb-6 text-gray-600 dark:text-gray-400">{pageDescription}</p>

      {/* --- CHANGE: ALL PROPS ARE NOW SENT COMPLETELY --- */}
      <FilterControls
        profileUser={profileUser}
        countryOptions={countryOptions}
        cityOptions={cityOptions}
        selectedCountries={selectedCountries}
        selectedCities={selectedCities}
        onCountryChange={onCountryChange}
        onCityChange={onCityChange}
        onReset={onReset}
        isCountryDisabled={!isAdmin}
        isMultiCountry={true} // Each page can set these values as needed
        isMultiCity={true}
      />

      {/* If an error occurs while fetching data from the API, it is shown */}
      {error && (
        <div className="my-4 p-4 text-center text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {/* Table displaying store data */}
      <StoresTable
        stores={stores}
        isLoading={isLoading}
        renderActions={renderStoreActions}
      />
    </div>
  );
};

export default StoreListPageLayout;
