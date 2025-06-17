// ✅ Step3.jsx — ESP32 Token Generation
import React from "react";
import { Cpu } from "lucide-react";

const Step3 = ({
  esp32Token,
  handleGenerateEsp32Token,
  translations,
  onNext,
  onBack,
}) => {
  const handleCopy = () => {
    if (esp32Token) {
      navigator.clipboard.writeText(esp32Token);
    }
  };

  return (
    <div className="p-6 rounded-md max-w-3xl mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-6">
        {translations.step3Title || "ESP32 Token Generation"}
      </h2>

      <div className="space-y-4">
        <button
          onClick={handleGenerateEsp32Token}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <Cpu className="mr-2" />
          {translations.generateTokenButton || "Generate Token"}
        </button>

        {esp32Token && (
          <div className="border p-4 rounded bg-gray-50">
            <p className="font-mono break-all">{esp32Token}</p>
            <button
              onClick={handleCopy}
              className="mt-2 inline-flex items-center text-sm text-blue-600 hover:underline">
              {translations.copyToClipboardButton || "Copy to Clipboard"}
            </button>
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
          onClick={onNext}
          className="bg-green-600 text-white px-4 py-2 rounded">
          {translations.nextButton || "Next"}
        </button>
      </div>
    </div>
  );
};

export default Step3;
