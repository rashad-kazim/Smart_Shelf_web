// src/pages/Stores/ServerLogsPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { ArrowLeft } from "lucide-react";
import { formatDateTime } from "../../../utils/formatters";
import NotFoundPage from "../../misc/NotFoundPage";

const ServerLogsPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const {
    stores,
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

  if (!store) {
    return <NotFoundPage />;
  }

  const infoCards = [
    {
      label: translations.serverSoftwareVersion || "Software Version",
      value: store.server_version || "1.0.0",
    },
    {
      label: translations.lastUpdateDate || "Last Update Date",
      value: formatDateTime(store.last_update_date, translations),
    },
    {
      label: translations.connectedEsp32Count || "Number of Connected ESP32s",
      value: store.num_esp32_connected || 0,
    },
    {
      label: translations.serverToken || "Server Token",
      value: store.server_token,
      fullWidth: true,
    },
    { label: translations.country || "Country", value: store.country },
    { label: translations.city || "City", value: store.city },
    { label: translations.storeName || "Store Name", value: store.name },

    {
      label: translations.registeredByName || "Registered By",
      value: `${store.ownerName} ${store.ownerSurname}`,
    },
  ];

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          {translations.serverLogsTitle || "Server Logs"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg shadow-md ${
              card.fullWidth ? "lg:col-span-3" : ""
            }`}
            style={{
              backgroundColor: colors.lightGrayBg,
              borderLeft: `5px solid ${colors.logoPrimaryBlue}`,
            }}>
            <h3
              className="text-sm font-bold uppercase mb-2"
              style={{ color: colors.mediumGrayText }}>
              {card.label}
            </h3>
            <p
              className="text-lg font-semibold break-words"
              style={{ color: colors.darkText }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServerLogsPage;
