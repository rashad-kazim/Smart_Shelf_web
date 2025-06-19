// src/pages/Stores/StoreLogDetailsPage.jsx
import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Server, Cpu, ArrowLeft } from "lucide-react";
import NotFoundPage from "../../misc/NotFoundPage";

const StoreLogDetailsPage = () => {
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
    return <NotFoundPage />; // or a "Store Not Found" message
  }

  const logCards = [
    {
      title: translations.serverLogsTitle || "Server Logs",
      description:
        translations.serverLogsDesc ||
        "View detailed server activity and status.",
      icon: Server,
      action: () => navigate(`/server-logs/${storeId}`),
    },
    {
      title: translations.esp32LogsTitle || "ESP32 Logs",
      description:
        translations.esp32LogsDesc ||
        "View detailed logs from connected ESP32 devices.",
      icon: Cpu,
      action: () => navigate(`/esp32-logs/${storeId}`),
    },
  ];

  return (
    <div
      className="p-8 rounded-lg shadow-md"
      style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">
          {translations.logDetailsTitle || "Log Details"}
        </h1>
        <button
          onClick={() => navigate("/view-logs")}
          className="px-4 py-2 rounded-md font-medium flex items-center"
          style={{
            backgroundColor: colors.prevButtonBg,
            color: colors.whiteText,
          }}>
          <ArrowLeft size={20} className="mr-2" />
          {translations.backToLogsList || "Back to Logs List"}
        </button>
      </div>

      <div
        className="mb-8 p-4 rounded-md"
        style={{ backgroundColor: colors.lightGrayBg }}>
        <h2 className="text-xl font-bold">{store.name}</h2>
        <p className="text-sm" style={{ color: colors.mediumGrayText }}>
          {store.address}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {logCards.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 cursor-pointer"
            style={{ border: `1px solid ${colors.mediumGrayText}` }}
            onClick={card.action}>
            <card.icon
              size={48}
              className="mb-4"
              style={{ color: colors.logoPrimaryBlue }}
            />
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-sm" style={{ color: colors.mediumGrayText }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreLogDetailsPage;
