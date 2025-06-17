// ✅ Step5.jsx — Complete Installation
import React from "react";
import { List, CheckCircle } from "lucide-react";

const Step5 = ({
  translations,
  onBack,
  handleGetLogs,
  handleCompleteInstallation,
  logs,
}) => {
  return (
    <div className="p-6 rounded-md max-w-3xl mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-6">
        {translations.step5Title || "Complete Installation"}
      </h2>

      <div className="space-y-4">
        <button
          onClick={handleGetLogs}
          className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center">
          <List className="mr-2" />
          {translations.getLogsButton || "Get Logs"}
        </button>

        {logs?.length > 0 && (
          <div className="border p-4 rounded bg-gray-50">
            <ul className="list-disc pl-4">
              {logs.map((log) => (
                <li key={log.id} className="text-sm">
                  ID: {log.id}, Status: {log.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded">
          {translations.previousButton || "Previous"}
        </button>
        <button
          onClick={handleCompleteInstallation}
          className="bg-green-600 text-white px-4 py-2 rounded inline-flex items-center">
          <CheckCircle className="mr-2" />
          {translations.completeInstallationButton || "Complete Installation"}
        </button>
      </div>
    </div>
  );
};

export default Step5;
