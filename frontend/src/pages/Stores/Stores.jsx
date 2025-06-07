import React, { useState, useMemo, useRef } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  List,
  Copy,
  RotateCcw,
  X,
} from "lucide-react";

// Helper function: Copies text to clipboard (for browser compatibility)
const copyToClipboard = (text) => {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy");
    alert("Copied: " + text); // Notify user
  } catch (err) {
    console.error("Could not copy to clipboard:", err);
    alert("Copy failed. Please copy manually.");
  }
  document.body.removeChild(textarea);
};

// Stores Page Component
function StoresPage({ colors, translations }) {
  // Dummy store data
  const [stores] = useState([
    {
      id: 1,
      name: "EilSense Market A",
      country: "USA",
      city: "New York",
      branch: "Downtown",
      address: "123 Main St, New York, NY 10001",
      server_token: "SRV_XYZ123ABCDEFGHIJKLMN",
      status: "active",
      created_at: "2023-01-15T10:00:00Z",
      working_hours: "09:00-21:00",
    },
    {
      id: 2,
      name: "EilSense Hypermarket B",
      country: "Turkey",
      city: "Istanbul",
      branch: "Kadıköy",
      address: "Bağdat Cd. No: 1, Kadıköy, İstanbul",
      server_token: "SRV_DEF456GHIJKLMNOPQRST",
      status: "active",
      created_at: "2023-02-20T11:30:00Z",
      working_hours: "08:00-22:00",
    },
    {
      id: 3,
      name: "EilSense Express C",
      country: "Germany",
      city: "Berlin",
      branch: "Mitte",
      address: "Friedrichstr. 45, 10117 Berlin",
      server_token: "SRV_JKL789MNOPQRSTUVWXYZAB",
      status: "inactive",
      created_at: "2023-03-01T09:15:00Z",
      working_hours: "10:00-20:00",
    },
    {
      id: 4,
      name: "EilSense Mini P",
      country: "Poland",
      city: "Warsaw",
      branch: "Wola",
      address: "Prosta 1, 00-838 Warsaw",
      server_token: "SRV_PQR012STUVWXYZABCDEF",
      status: "active",
      created_at: "2023-04-10T14:00:00Z",
      working_hours: "07:00-23:00",
    },
    {
      id: 5,
      name: "EilSense Asia",
      country: "Turkey",
      city: "Ankara",
      branch: "Çankaya",
      address: "Atatürk Blv. 5, Çankaya, Ankara",
      server_token: "SRV_UVW345XYZABCDEFGHIJK",
      status: "active",
      created_at: "2023-05-05T16:45:00Z",
      working_hours: "09:00-21:00",
    },
    {
      id: 6,
      name: "EilSense World",
      country: "USA",
      city: "Los Angeles",
      branch: "Hollywood",
      address: "Sunset Blvd. 100, Los Angeles, CA 90028",
      server_token: "SRV_ABCDEF1234567890ABCD",
      status: "inactive",
      created_at: "2023-06-01T12:00:00Z",
      working_hours: "24/7",
    },
  ]);

  // Filtering states
  const [filters, setFilters] = useState({
    opening_hour: "",
    closing_hour: "",
    is_all_day_open: false,
  });
  // New states for multi-select filters
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  // States for country and city input fields
  const [countryInput, setCountryInput] = useState("");
  const [cityInput, setCityInput] = useState("");

  // Suggestion list visibility
  const [showCountrySuggestions, setShowCountrySuggestions] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Input refs (to focus after onBlur)
  const countryInputRef = useRef(null);
  const cityInputRef = useRef(null);

  // Helper function to format hour (e.g. 9 -> "09:00")
  const formatHour = (hour) => String(hour).padStart(2, "0") + ":00";
  // Generate hour options (from 00:00 to 23:00)
  const hoursOptions = useMemo(() => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(formatHour(i));
    }
    return hours;
  }, []);

  // State for store details modal
  const [selectedStore, setSelectedStore] = useState(null);
  const [showStoreDetailsModal, setShowStoreDetailsModal] = useState(false);

  // Handles changes in general filter inputs (working hours etc.)
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Called when country input value changes
  const handleCountryInputChange = (e) => {
    setCountryInput(e.target.value);
  };
  // Called when city input value changes
  const handleCityInputChange = (e) => {
    setCityInput(e.target.value);
  };

  // Adds a country filter
  const addCountryFilter = (country) => {
    if (country && !selectedCountries.includes(country)) {
      setSelectedCountries([...selectedCountries, country]);
      setCountryInput(""); // Clear input after adding
      setShowCountrySuggestions(false); // Hide suggestions
    }
  };
  // Adds a city filter
  const addCityFilter = (city) => {
    if (city && !selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
      setCityInput(""); // Clear input after adding
      setShowCitySuggestions(false); // Hide suggestions
    }
  };

  // Removes a country filter
  const removeCountryFilter = (countryToRemove) => {
    setSelectedCountries(
      selectedCountries.filter((country) => country !== countryToRemove)
    );
  };
  // Removes a city filter
  const removeCityFilter = (cityToRemove) => {
    setSelectedCities(selectedCities.filter((city) => city !== cityToRemove));
  };

  // Adds filter when Enter is pressed in country input
  const handleCountryInputKeyPress = (e) => {
    if (e.key === "Enter") {
      addCountryFilter(countryInput.trim()); // Trim removes spaces
    }
  };
  // Adds filter when Enter is pressed in city input
  const handleCityInputKeyPress = (e) => {
    if (e.key === "Enter") {
      addCityFilter(cityInput.trim()); // Trim removes spaces
    }
  };

  // Resets all filters
  const handleResetFilters = () => {
    setFilters({
      opening_hour: "",
      closing_hour: "",
      is_all_day_open: false,
    });
    setSelectedCountries([]); // Clear selected countries
    setSelectedCities([]); // Clear selected cities
    setCountryInput(""); // Clear country input
    setCityInput(""); // Clear city input
  };

  // Opens store details modal
  const handleStoreClick = (store) => {
    setSelectedStore(store);
    setShowStoreDetailsModal(true);
  };

  // Closes store details modal
  const closeStoreDetailsModal = () => {
    setShowStoreDetailsModal(false);
    setSelectedStore(null);
  };

  // Get all unique countries from stores dynamically
  const uniqueCountries = useMemo(() => {
    const countries = [...new Set(stores.map((store) => store.country))];
    return countries.sort();
  }, [stores]);

  // Get all unique cities from stores dynamically (filtered by selected countries if any)
  const uniqueCities = useMemo(() => {
    let cities = [];
    if (selectedCountries.length > 0) {
      // Show only cities in selected countries
      cities = stores
        .filter((store) => selectedCountries.includes(store.country))
        .map((store) => store.city);
    } else {
      // Show all cities
      cities = stores.map((store) => store.city);
    }
    return [...new Set(cities)].sort();
  }, [stores, selectedCountries]);

  // Returns filtered stores
  const filteredStores = stores.filter((store) => {
    // Country filters (if no selected countries or store is in selected countries)
    const countryMatch =
      selectedCountries.length === 0 ||
      selectedCountries.includes(store.country);
    // City filters (if no selected cities or store is in selected cities)
    const cityMatch =
      selectedCities.length === 0 || selectedCities.includes(store.city);

    // Working hours filtering
    let hoursMatch = true;
    if (filters.is_all_day_open) {
      hoursMatch = store.working_hours === "24/7";
    } else {
      const [storeOpen, storeClose] = store.working_hours
        .split("-")
        .map((s) => s.trim());
      if (filters.opening_hour && storeOpen) {
        hoursMatch = hoursMatch && storeOpen === filters.opening_hour;
      }
      if (filters.closing_hour && storeClose) {
        hoursMatch = hoursMatch && storeClose === filters.closing_hour;
      }
    }

    return countryMatch && cityMatch && hoursMatch;
  });

  // Card data (for add, edit, delete, view logs actions)
  const cardData = [
    {
      title: translations.stores.createStoreTitle,
      description: translations.stores.createStoreDesc,
      icon: PlusCircle,
      action: () => alert(translations.stores.createStoreAction),
    },
    {
      title: translations.stores.editStoreTitle,
      description: translations.stores.editStoreDesc,
      icon: Edit,
      action: () => alert(translations.stores.editStoreAction),
    },
    {
      title: translations.stores.deleteStoreTitle,
      description: translations.stores.deleteStoreDesc,
      icon: Trash2,
      action: () => alert(translations.stores.deleteStoreAction),
    },
    {
      title: translations.stores.viewLogsTitle,
      description: translations.stores.viewLogsDesc,
      icon: List,
      action: () => alert(translations.stores.viewLogsAction),
    },
  ];

  return (
    <>
      <h1
        className="text-3xl font-semibold mb-6"
        style={{ color: colors.darkText }}>
        {translations.stores.title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cardData.map((card, index) => (
          <div
            key={index}
            className="p-6 rounded-lg shadow-md flex flex-col items-center text-center transition-transform transform hover:scale-105 cursor-pointer"
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
            }}
            onClick={card.action}>
            <card.icon
              size={48}
              className="mb-4"
              style={{ color: colors.logoPrimaryBlue }}
            />
            <h2
              className="text-xl font-semibold mb-2"
              style={{ color: colors.darkText }}>
              {card.title}
            </h2>
            <p className="text-sm" style={{ color: colors.mediumGrayText }}>
              {card.description}
            </p>
          </div>
        ))}
      </div>

      {/* Stores List Section */}
      <div
        className="p-8 rounded-lg shadow-md mt-6"
        style={{ backgroundColor: colors.pureWhite, color: colors.darkText }}>
        <h2
          className="text-2xl font-semibold mb-4"
          style={{ color: colors.darkText }}>
          {translations.stores.storeListTitle}
        </h2>

        {/* Filtering Inputs */}
        <div className="flex flex-wrap items-start gap-4 mb-4">
          {/* Use items-start to align to top */}
          {/* Country Filter */}
          <div className="flex-1 min-w-[150px] relative">
            <label
              htmlFor="filter-country"
              className="block text-sm font-medium mb-1"
              style={{ color: colors.darkText }}>
              {translations.stores.country}
            </label>
            <input
              type="text"
              id="filter-country"
              name="country"
              value={countryInput} // use input state
              onChange={handleCountryInputChange}
              onFocus={() => setShowCountrySuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowCountrySuggestions(false), 100)
              }
              onKeyPress={handleCountryInputKeyPress} // Add filter on Enter
              placeholder={translations.stores.countryPlaceholder}
              className="w-full p-2 rounded-md border cursor-pointer"
              style={{
                borderColor: colors.mediumGrayText,
                backgroundColor: colors.lightGrayBg,
                color: colors.darkText,
                outlineColor: colors.logoPrimaryBlue,
              }}
              ref={countryInputRef}
            />
            {/* Country Suggestions */}
            {showCountrySuggestions && (
              <ul
                className="absolute z-10 w-full rounded-md shadow-lg py-1 mt-1 max-h-40 overflow-y-auto"
                style={{
                  backgroundColor: colors.pureWhite,
                  border: `1px solid ${colors.mediumGrayText}`,
                }}>
                {uniqueCountries
                  .filter((c) =>
                    c.toLowerCase().includes(countryInput.toLowerCase())
                  )
                  .map((country) => (
                    <li
                      key={country}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      style={{ color: colors.darkText }}
                      onMouseDown={() => {
                        addCountryFilter(country); // Add to filter on suggestion select
                        countryInputRef.current.focus();
                      }}>
                      {country}
                    </li>
                  ))}
                {uniqueCountries.filter((c) =>
                  c.toLowerCase().includes(countryInput.toLowerCase())
                ).length === 0 &&
                  countryInput && (
                    <li
                      className="px-3 py-2 text-sm"
                      style={{ color: colors.mediumGrayText }}>
                      {translations.stores.noSuggestions}
                    </li>
                  )}
              </ul>
            )}
          </div>
          {/* City Filter */}
          <div className="flex-1 min-w-[150px] relative">
            <label
              htmlFor="filter-city"
              className="block text-sm font-medium mb-1"
              style={{ color: colors.darkText }}>
              {translations.stores.city}
            </label>
            <input
              type="text"
              id="filter-city"
              name="city"
              value={cityInput} // use input state
              onChange={handleCityInputChange}
              onFocus={() => setShowCitySuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowCitySuggestions(false), 100)
              }
              onKeyPress={handleCityInputKeyPress} // Add filter on Enter
              placeholder={translations.stores.cityPlaceholder}
              className="w-full p-2 rounded-md border cursor-pointer"
              style={{
                borderColor: colors.mediumGrayText,
                backgroundColor: colors.lightGrayBg,
                color: colors.darkText,
                outlineColor: colors.logoPrimaryBlue,
              }}
              ref={cityInputRef}
            />
            {/* City Suggestions */}
            {showCitySuggestions && (
              <ul
                className="absolute z-10 w-full rounded-md shadow-lg py-1 mt-1 max-h-40 overflow-y-auto"
                style={{
                  backgroundColor: colors.pureWhite,
                  border: `1px solid ${colors.mediumGrayText}`,
                }}>
                {uniqueCities
                  .filter((c) =>
                    c.toLowerCase().includes(cityInput.toLowerCase())
                  )
                  .map((city) => (
                    <li
                      key={city}
                      className="px-3 py-2 cursor-pointer hover:bg-gray-100"
                      style={{ color: colors.darkText }}
                      onMouseDown={() => {
                        addCityFilter(city); // Add to filter on suggestion select
                        cityInputRef.current.focus();
                      }}>
                      {city}
                    </li>
                  ))}
                {uniqueCities.filter((c) =>
                  c.toLowerCase().includes(cityInput.toLowerCase())
                ).length === 0 &&
                  cityInput && (
                    <li
                      className="px-3 py-2 text-sm"
                      style={{ color: colors.mediumGrayText }}>
                      {translations.stores.noSuggestions}
                    </li>
                  )}
              </ul>
            )}
          </div>
          {/* Opening Hour Filter */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="filter-opening-hour"
              className="block text-sm font-medium mb-1"
              style={{ color: colors.darkText }}>
              {translations.stores.openingHour}
            </label>
            <select
              id="filter-opening-hour"
              name="opening_hour"
              value={filters.opening_hour}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-md border cursor-pointer"
              style={{
                borderColor: colors.mediumGrayText,
                backgroundColor: colors.lightGrayBg,
                color: colors.darkText,
                outlineColor: colors.logoPrimaryBlue,
              }}
              disabled={filters.is_all_day_open}>
              <option value="">{translations.stores.selectHour}</option>
              {hoursOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          {/* Closing Hour Filter */}
          <div className="flex-1 min-w-[150px]">
            <label
              htmlFor="filter-closing-hour"
              className="block text-sm font-medium mb-1"
              style={{ color: colors.darkText }}>
              {translations.stores.closingHour}
            </label>
            <select
              id="filter-closing-hour"
              name="closing_hour"
              value={filters.closing_hour}
              onChange={handleFilterChange}
              className="w-full p-2 rounded-md border cursor-pointer"
              style={{
                borderColor: colors.mediumGrayText,
                backgroundColor: colors.lightGrayBg,
                color: colors.darkText,
                outlineColor: colors.logoPrimaryBlue,
              }}
              disabled={filters.is_all_day_open}>
              <option value="">{translations.stores.selectHour}</option>
              {hoursOptions.map((hour) => (
                <option key={hour} value={hour}>
                  {hour}
                </option>
              ))}
            </select>
          </div>
          {/* All Day Open Checkbox */}
          <div className="flex items-center self-end min-w-[150px] h-full pb-1">
            <input
              type="checkbox"
              id="filter-all-day-open"
              name="is_all_day_open"
              checked={filters.is_all_day_open}
              onChange={handleFilterChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              style={{ borderColor: colors.mediumGrayText }}
            />
            <label
              htmlFor="filter-all-day-open"
              className="ml-2 block text-sm font-medium cursor-pointer"
              style={{ color: colors.darkText }}>
              {translations.stores.allDayOpen}
            </label>
          </div>
        </div>

        {/* Reset Filters Button - New Position */}
        <div className="w-full text-right mb-4">
          {/* w-full for full width, text-right for right align */}
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-md font-medium flex items-center justify-center transition-colors duration-200 cursor-pointer inline-flex" // inline-flex for wrapping and icon alignment
            style={{
              backgroundColor: colors.logoPrimaryBlue,
              color: colors.whiteText,
            }}>
            <RotateCcw size={18} className="mr-2" />
            {translations.stores.resetFilters}
          </button>
        </div>

        {/* Selected Country and City Tags - Horizontal Scroll */}
        {(selectedCountries.length > 0 || selectedCities.length > 0) && (
          <div className="flex flex-nowrap gap-2 mb-4 overflow-x-auto pb-2">
            {/* flex-nowrap and overflow-x-auto, slight padding at bottom */}
            {selectedCountries.map((country) => (
              <span
                key={`country-${country}`}
                className="flex-shrink-0 flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: colors.logoPrimaryBlue + "20",
                  color: colors.logoPrimaryBlue,
                }}>
                {country}
                <button
                  onClick={() => removeCountryFilter(country)}
                  className="ml-1 text-blue-800 hover:text-blue-900 rounded-full p-0.5 transition-colors cursor-pointer"
                  style={{ color: colors.logoPrimaryBlue }}>
                  <X size={14} />
                </button>
              </span>
            ))}
            {selectedCities.map((city) => (
              <span
                key={`city-${city}`}
                className="flex-shrink-0 flex items-center bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: colors.successGreen + "20",
                  color: colors.successGreen,
                }}>
                {city}
                <button
                  onClick={() => removeCityFilter(city)}
                  className="ml-1 text-green-800 hover:text-green-900 rounded-full p-0.5 transition-colors cursor-pointer"
                  style={{ color: colors.successGreen }}>
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Stores Table */}
        <div
          className="overflow-x-auto rounded-lg border"
          style={{ borderColor: colors.mediumGrayText }}>
          <table
            className="min-w-full divide-y divide-gray-200"
            style={{ borderColor: colors.mediumGrayText }}>
            <thead style={{ backgroundColor: colors.lightGrayBg }}>
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.nameHeader}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.countryHeader}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.cityHeader}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.branchHeader}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.statusHeader}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  style={{ color: colors.mediumGrayText }}>
                  {translations.stores.workingHoursHeader}
                </th>
              </tr>
            </thead>
            <tbody
              style={{
                backgroundColor: colors.pureWhite,
                color: colors.darkText,
              }}>
              {filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <tr
                    key={store.id}
                    className="border-t cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                    style={{ borderColor: colors.lightGrayBg }}
                    onClick={() => handleStoreClick(store)}>
                    {/* Removed whitespace-nowrap for Name and Branch, added break-words */}
                    <td className="px-6 py-4 text-sm font-medium break-words">
                      {store.name}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {store.country}
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {store.city}
                    </td>
                    <td className="px-6 py-4 text-sm break-words">
                      {store.branch || "-"}
                    </td>
                    {/* Added break-words for Branch */}
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          store.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                        {store.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap">
                      {store.working_hours}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 whitespace-nowrap text-sm text-center"
                    style={{ color: colors.mediumGrayText }}>
                    {translations.stores.noStoresFound}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Store Details Modal */}
      {showStoreDetailsModal && selectedStore && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto"
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
            }}>
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-xl font-semibold"
                style={{ color: colors.darkText }}>
                {translations.stores.storeDetailsTitle}: {selectedStore.name}
              </h3>
              <button
                onClick={closeStoreDetailsModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <p>
                <strong>ID:</strong> {selectedStore.id}
              </p>
              <p>
                <strong>{translations.stores.countryHeader}:</strong>{" "}
                {selectedStore.country}
              </p>
              <p>
                <strong>{translations.stores.cityHeader}:</strong>{" "}
                {selectedStore.city}
              </p>
              <p>
                <strong>{translations.stores.branchHeader}:</strong>{" "}
                {selectedStore.branch || "-"}
              </p>
              <p>
                <strong>{translations.stores.addressHeader}:</strong>{" "}
                {selectedStore.address || "-"}
              </p>
              <p>
                <strong>{translations.stores.statusHeader}:</strong>{" "}
                {selectedStore.status}
              </p>
              <p>
                <strong>{translations.stores.tokenHeader}:</strong>
                <span className="font-mono break-all ml-1">
                  {selectedStore.server_token}
                </span>
                <button
                  onClick={() => copyToClipboard(selectedStore.server_token)}
                  className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer"
                  title="Copy token">
                  <Copy size={16} />
                </button>
              </p>
              <p>
                <strong>{translations.stores.workingHoursHeader}:</strong>{" "}
                {selectedStore.working_hours}
              </p>
              <p>
                <strong>{translations.stores.createdAtHeader}:</strong>{" "}
                {new Date(selectedStore.created_at).toLocaleString()}
              </p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={closeStoreDetailsModal}
                className="px-4 py-2 rounded-md font-medium transition-colors duration-200 cursor-pointer"
                style={{
                  backgroundColor: colors.logoPrimaryBlue,
                  color: colors.whiteText,
                }}>
                {translations.stores.dialogClose}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default StoresPage;
