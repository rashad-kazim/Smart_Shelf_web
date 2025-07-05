// src/components/InstallationSteps/Step4Details/DeviceForm.jsx
// STATUS: FINAL (Complete version containing all form elements, fixed and error-free)

import React, { useMemo } from "react";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

const DeviceForm = ({
  form,
  isEditing,
  onFormChange,
  onSave,
  onCancel,
  errors,
  readOnlyData,
  options,
  wizardData,
}) => {
  // Get isDarkMode directly from AuthContext for a more robust structure.
  const { isDarkMode, appTranslations, language } = useAuth();

  const translations = useMemo(
    () => appTranslations[language]?.["stores.installationWizard"],
    [appTranslations, language]
  );

  const storesTranslations = useMemo(
    () => appTranslations[language]?.stores,
    [appTranslations, language]
  );

  const commonTranslations = useMemo(
    () => appTranslations[language]?.common,
    [appTranslations, language]
  );

  // Manage all style definitions from a single place.
  const labelClass = `block text-sm font-bold mb-0 ${
    isDarkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const inputClass = `w-full mt-2 p-2 border rounded-md transition-colors ${
    isDarkMode
      ? "bg-gray-700 text-white border-gray-600 focus:ring-blue-500 focus:border-blue-500"
      : "bg-white text-gray-900 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  }`;
  const readOnlyInputClass = `w-full p-2 border rounded-md transition-colors cursor-default ${
    isDarkMode
      ? "bg-gray-900 text-gray-400 border-gray-700"
      : "bg-gray-100 text-gray-500 border-gray-300"
  }`;
  const errorTextClass = "text-red-500 text-xs mt-1";
  const errorBorderClass = "border-red-500";

  return (
    <div
      className={`border-t-2 border-dashed pt-6 mt-6 ${
        isDarkMode ? "border-gray-600" : "border-gray-300"
      }`}>
      <h3
        className={`text-lg font-semibold mb-4 col-span-full ${
          isDarkMode ? "text-gray-200" : "text-gray-800"
        }`}>
        {isEditing
          ? `${translations?.editDeviceTitle} ID: ${form.id}`
          : translations?.newDeviceTitle}
      </h3>

      <form className="space-y-6" noValidate>
        {/* --- Section 1: General Information --- */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <label htmlFor="id" className={labelClass}>
              {translations?.idLabel}*
            </label>
            <input
              type="text"
              id="id"
              name="id"
              value={form.id || ""}
              onChange={onFormChange}
              className={`${inputClass} ${errors.id ? errorBorderClass : ""}`}
            />
            {errors.id && <p className={errorTextClass}>{errors.id}</p>}
          </div>
          <div>
            <label className={labelClass}>
              {storesTranslations?.countryLabel}
            </label>
            <input
              type="text"
              value={readOnlyData.country || ""}
              readOnly
              className={`${readOnlyInputClass} mt-2`}
            />
          </div>
          <div>
            <label className={labelClass}>
              {storesTranslations?.cityLabel}
            </label>
            <input
              type="text"
              value={readOnlyData.city || ""}
              readOnly
              className={`${readOnlyInputClass} mt-2`}
            />
          </div>
          <div>
            <label className={labelClass}>{translations?.tokenLabel}</label>
            <input
              type="text"
              value={readOnlyData.esp32Token || ""}
              readOnly
              className={`${readOnlyInputClass} mt-2`}
            />
          </div>
          {wizardData.name && (
            <div className="mb-4">
              <label className={labelClass}>
                {storesTranslations?.storeNameLabel}
              </label>
              <input
                type="text"
                value={wizardData.name}
                readOnly
                className={`${readOnlyInputClass} mt-2`}
              />
            </div>
          )}
          {wizardData.branch && (
            <div className="mb-4">
              <label className={labelClass}>
                {storesTranslations?.branchNameLabel}
              </label>
              <input
                type="text"
                value={wizardData.branch}
                readOnly
                className={`${readOnlyInputClass} mt-2`}
              />
            </div>
          )}
        </div>

        {/* --- Section 2: Device Settings --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4">
          <div className="md:col-span-2 relative">
            <label htmlFor="screenSize" className={labelClass}>
              {translations?.screenSizeLabel}*
            </label>
            <select
              id="screenSize"
              name="screenSize"
              value={form.screenSize || ""}
              onChange={onFormChange}
              className={`${inputClass} appearance-none ${
                errors.screenSize ? errorBorderClass : ""
              }`}>
              <option value="">{translations?.selectScreenSize}</option>
              {(options.screenSizes || []).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            {errors.screenSize && (
              <p className={errorTextClass}>{errors.screenSize}</p>
            )}
          </div>
          <div className="md:col-span-2 flex items-end pb-1">
            <input
              type="checkbox"
              id="allDayWork"
              name="allDayWork"
              checked={form.allDayWork || false}
              onChange={onFormChange}
              className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="allDayWork"
              className={`${labelClass} font-normal cursor-pointer`}>
              {translations?.allDayWorkLabel}
            </label>
          </div>
          <div className="md:col-span-2 relative">
            <label htmlFor="awakeTime" className={labelClass}>
              {translations?.awakeTimeLabel}
              {!form.allDayWork && "*"}
            </label>
            <select
              id="awakeTime"
              name="awakeTime"
              value={form.awakeTime || ""}
              disabled={form.allDayWork}
              onChange={onFormChange}
              className={`${inputClass} appearance-none ${
                errors.awakeTime ? errorBorderClass : ""
              }`}
              style={
                form.allDayWork
                  ? {
                      backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                      color: isDarkMode ? "#9CA3AF" : "#6B7280",
                    }
                  : {}
              }>
              <option value="">{translations?.selectHour}</option>
              {(options.timeOptions || []).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            {errors.awakeTime && (
              <p className={errorTextClass}>{errors.awakeTime}</p>
            )}
          </div>
          <div className="md:col-span-2 relative">
            <label htmlFor="sleepTime" className={labelClass}>
              {translations?.sleepTimeLabel}
              {!form.allDayWork && "*"}
            </label>
            <select
              id="sleepTime"
              name="sleepTime"
              value={form.sleepTime || ""}
              disabled={form.allDayWork}
              onChange={onFormChange}
              className={`${inputClass} appearance-none ${
                errors.sleepTime ? errorBorderClass : ""
              }`}
              style={
                form.allDayWork
                  ? {
                      backgroundColor: isDarkMode ? "#374151" : "#F3F4F6",
                      color: isDarkMode ? "#9CA3AF" : "#6B7280",
                    }
                  : {}
              }>
              <option value="">{translations?.selectHour}</option>
              {(options.timeOptions || []).map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-3 top-1/2 mt-3 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={18}
            />
            {errors.sleepTime && (
              <p className={errorTextClass}>{errors.sleepTime}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="wifi_ssid" className={labelClass}>
              {translations?.wifiSsidLabel}*
            </label>
            <input
              type="text"
              id="wifi_ssid"
              name="wifi_ssid"
              value={form.wifi_ssid || ""}
              onChange={onFormChange}
              className={`${inputClass} ${
                errors.wifi_ssid ? errorBorderClass : ""
              }`}
            />
            {errors.wifi_ssid && (
              <p className={errorTextClass}>{errors.wifi_ssid}</p>
            )}
          </div>
          <div className="md:col-span-2">
            <label htmlFor="wifi_password" className={labelClass}>
              {translations?.wifiPasswordLabel}*
            </label>
            <input
              type="text"
              id="wifi_password"
              name="wifi_password"
              value={form.wifi_password || ""}
              onChange={onFormChange}
              className={`${inputClass} ${
                errors.wifi_password ? errorBorderClass : ""
              }`}
            />
            {errors.wifi_password && (
              <p className={errorTextClass}>{errors.wifi_password}</p>
            )}
          </div>
        </div>

        {/* --- Section 3: Font Settings --- */}
        <div
          className={`border-t pt-4 mt-4 ${
            isDarkMode ? "border-gray-600" : "border-gray-300"
          }`}>
          <h4 className={`text-md font-semibold mb-4 ${labelClass}`}>
            {translations?.fontSettingsLabel}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="relative">
              <label htmlFor="productNameFontSize" className={labelClass}>
                {translations?.productNameFontSizeLabel}
              </label>
              <select
                id="productNameFontSize"
                name="productNameFontSize"
                value={form.productNameFontSize || 16}
                onChange={onFormChange}
                className={`${inputClass} appearance-none`}>
                {(options.fontSizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="productPriceFontSizeBeforeDiscount"
                className={labelClass}>
                {translations?.productPriceFontSizeBeforeDiscountLabel}
              </label>
              <select
                id="productPriceFontSizeBeforeDiscount"
                name="productPriceFontSizeBeforeDiscount"
                value={form.productPriceFontSizeBeforeDiscount || 16}
                onChange={onFormChange}
                className={`${inputClass} appearance-none`}>
                {(options.fontSizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="productPriceFontSizeAfterDiscount"
                className={labelClass}>
                {translations?.productPriceFontSizeAfterDiscountLabel}
              </label>
              <select
                id="productPriceFontSizeAfterDiscount"
                name="productPriceFontSizeAfterDiscount"
                value={form.productPriceFontSizeAfterDiscount || 16}
                onChange={onFormChange}
                className={`${inputClass} appearance-none`}>
                {(options.fontSizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            <div className="relative">
              <label htmlFor="productBarcodeFontSize" className={labelClass}>
                {translations?.productBarcodeFontSizeLabel}
              </label>
              <select
                id="productBarcodeFontSize"
                name="productBarcodeFontSize"
                value={form.productBarcodeFontSize || 16}
                onChange={onFormChange}
                className={`${inputClass} appearance-none`}>
                {(options.fontSizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
            <div className="relative">
              <label
                htmlFor="productBarcodeNumbersFontSize"
                className={labelClass}>
                {translations?.productBarcodeNumbersFontSizeLabel}
              </label>
              <select
                id="productBarcodeNumbersFontSize"
                name="productBarcodeNumbersFontSize"
                value={form.productBarcodeNumbersFontSize || 16}
                onChange={onFormChange}
                className={`${inputClass} appearance-none`}>
                {(options.fontSizes || []).map((s) => (
                  <option key={s} value={s}>
                    {s}px
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-3 top-7 bottom-0 my-auto text-gray-500 pointer-events-none"
                size={18}
              />
            </div>
          </div>
        </div>
      </form>

      {/* --- Section 4: Action Buttons --- */}
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md font-bold bg-gray-500 text-white hover:bg-gray-600">
          {commonTranslations?.cancel}
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-2 rounded-md font-bold bg-green-600 text-white hover:bg-green-700">
          {storesTranslations?.saveButton}
        </button>
      </div>
    </div>
  );
};

export default DeviceForm;
