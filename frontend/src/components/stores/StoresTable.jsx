// src/components/stores/StoresTable.jsx

import React, { useMemo } from "react";
import { useAuth } from "../../context/AuthContext";

const StoresTable = ({ stores, isLoading, renderActions }) => {
  const {
    currentColors: colors,
    appTranslations,
    language,
    isDarkMode,
  } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const tableHeader = (
    <thead style={{ backgroundColor: colors.lightGrayBg }}>
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          {translations.nameHeader}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          {translations.location}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          {translations.installer}
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
          {translations.devices}
        </th>
        <th className="px-6 py-3"></th>
      </tr>
    </thead>
  );

  const tableBody = (
    <tbody style={{ backgroundColor: colors.pureWhite }}>
      {isLoading ? (
        <tr>
          <td colSpan="5" className="text-center p-8">
            <div className="flex justify-center items-center">
              <div className="w-8 h-8 border-2 border-t-2 border-gray-400 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="ml-3 text-gray-500">{translations.loading}</p>
            </div>
          </td>
        </tr>
      ) : stores.length > 0 ? (
        stores.map((store) => (
          <tr
            key={store.id}
            className={`border-t transition-colors duration-150 ${
              isDarkMode
                ? "text-gray-100 hover:bg-gray-700"
                : "text-gray-700 hover:bg-gray-200 hover:text-black"
            }`}
            style={{ borderColor: colors.lightGrayBg }}>
            <td className="px-6 py-4 whitespace-nowrap">{store.name}</td>
            <td className="px-6 py-4 whitespace-nowrap">{`${store.city}, ${store.country}`}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {`${store.installerName || ""} ${
                store.installerSurname || ""
              }`.trim() || "-"}
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex justify-center">
              {store.num_esp32_connected}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              {renderActions && renderActions(store)}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="5" className="text-center p-8 text-gray-500">
            {translations.noStoresFound}
          </td>
        </tr>
      )}
    </tbody>
  );

  return (
    <div
      className="overflow-x-auto rounded-lg border min-h-[400px] max-h-[600px] overflow-y-auto overflow-x-auto"
      style={{ borderColor: colors.mediumGrayText }}>
      <table
        className="min-w-full divide-y"
        style={{ borderColor: colors.mediumGrayText }}>
        {tableHeader}
        {tableBody}
      </table>
    </div>
  );
};

export default StoresTable;
