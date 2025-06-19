// src/components/InstallationSteps/Step5.jsx
import React from "react";

const Step5 = ({
  logs,
  handleGetLogs,
  handleCompleteInstallation,
  onBack,
  colors,
  translations,
}) => {
  return (
    <div
      className="p-6 rounded-lg shadow-md max-w-2xl mx-auto"
      style={{ backgroundColor: colors?.pureWhite }}>
      <h2 className="text-xl font-semibold mb-6">
        {translations?.step5Title || "Complete Installation"}
      </h2>
      <div className="mb-4">
        <button
          onClick={handleGetLogs}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md">
          {translations?.getLogsButton || "Get Logs"}
        </button>
        {logs.length > 0 && (
          <div
            className="mt-4 p-3 bg-gray-100 rounded-md max-h-48 overflow-y-auto"
            style={{ backgroundColor: colors?.lightGrayBg }}>
            <p className="font-semibold mb-2">
              {translations?.logsServerConnection || "Connection established."}
            </p>
            <ul className="space-y-1">
              {logs.map((log, index) => (
                <li
                  key={index}
                  className="text-sm">{`Device ID: ${log.id}, Status: ${log.status}`}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="flex justify-between p-4 bg-transparent mt-4 border-t">
        <button
          onClick={onBack}
          className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-md">
          {translations?.previousButton || "Previous"}
        </button>
        <button
          onClick={handleCompleteInstallation}
          disabled={logs.length === 0}
          className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-md ${
            logs.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {translations?.completeInstallationButton || "Complete Installation"}
        </button>
      </div>
    </div>
  );
};
export default Step5;
