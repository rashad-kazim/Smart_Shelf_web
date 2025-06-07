import React, { useState } from "react";
// Lucide React icons
import { Menu, X, Home, Store, Settings, Users, Sun, Moon } from "lucide-react";

// Import page components from their new locations, explicitly adding .jsx extension
import DashboardPage from "./pages/Dashboard/Dashboard.jsx";
import StoresPage from "./pages/Stores/Stores.jsx";
import FirmwarePage from "./pages/Firmware/Firmware.jsx";
import UsersPage from "./pages/Users/Users.jsx";

import "./App.css"; // Import App.css file here

function App() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true); // Is the sidebar expanded?
  const [isDarkMode, setIsDarkMode] = useState(false); // Is dark mode active?
  // Language selection functionality will no longer change page content. Default is English (en).
  const [language, setLanguage] = useState("en");
  // State to keep the active route (default is '/'). Newly added.
  const [activeRoute, setActiveRoute] = useState("/");

  // Light mode color palette
  const lightColors = {
    headerSidebarBg: "#212B36", // Background color for Header and Sidebar (dark gray/charcoal)
    logoPrimaryBlue: "#00CFFF", // Light blue from logo boxes (EilSense.io text uses this color)
    logoSecondaryBlue: "#007BFF", // Dark blue from logo circuit lines
    pureWhite: "#FFFFFF", // Main content background
    lightGrayBg: "#F0F2F5", // General page background
    darkText: "#1F2937", // Main text
    mediumGrayText: "#6B7280", // Secondary text
    whiteText: "#FFFFFF", // Text on dark backgrounds (header/sidebar)
    // Status Colors
    successGreen: "#28A745",
    warningOrange: "#FFC107",
    errorRed: "#DC3545",
  };

  // Dark mode color palette
  const darkColors = {
    headerSidebarBg: "#1A202C", // A darker tone (for Header/Sidebar)
    logoPrimaryBlue: "#00CFFF", // Blue tones can stay the same or be slightly adjusted
    logoSecondaryBlue: "#007BFF",
    pureWhite: "#2D3748", // Dark gray for content cards
    lightGrayBg: "#1A202C", // Dark gray for general page background
    darkText: "#E2E8F0", // Light text
    mediumGrayText: "#A0AEC0", // Secondary light text
    whiteText: "#FFFFFF", // Text on dark backgrounds (header/sidebar)
    // Status Colors
    successGreen: "#48BB78",
    warningOrange: "#ECC94B",
    errorRed: "#FC8181",
  };

  // Select current color palette
  const colors = isDarkMode ? darkColors : lightColors;

  // Object containing all translations (only English content is kept)
  const translations = {
    en: {
      dashboard: {
        title: "Dashboard",
        welcomeText: "Welcome to EilSense.io Management Panel!",
        instructionText:
          "This area will summarize the overall status of your system, store performance, and critical notifications. Please select the relevant sections from the left menu to perform detailed operations.",
        note: "Note: The logo in the header bar above is a representation of your EilSense.io name and logo's visual tones. Your actual logo (a transparent PNG/SVG file) will appear exactly as you want it when integrated here.",
      },
      stores: {
        title: "Stores & Branches",
        createStoreTitle: "Create New Store",
        createStoreDesc: "Add a new store or branch to the system.",
        createStoreAction: "Create New Store action triggered!",
        editStoreTitle: "Edit Store Information",
        editStoreDesc: "Update details of existing stores or branches.",
        editStoreAction: "Edit Store Information action triggered!",
        deleteStoreTitle: "Delete Store",
        deleteStoreDesc: "Remove a store or branch from the system.",
        deleteStoreAction: "Delete Store action triggered!",
        viewLogsTitle: "View Logs",
        viewLogsDesc: "Access logs related to store operations.",
        viewLogsAction: "View Logs action triggered!",
        storeListTitle: "Stores",
        filterBy: "Filter by:",
        city: "City",
        cityPlaceholder: "Enter city",
        country: "Country",
        countryPlaceholder: "Enter country",
        openingHour: "Opening Hour",
        closingHour: "Closing Hour",
        selectHour: "Select Hour",
        allDayOpen: "All Day Open (24/7)",
        resetFilters: "Reset Filters",
        nameHeader: "Store Name",
        countryHeader: "Country",
        cityHeader: "City",
        branchHeader: "Branch",
        addressHeader: "Address",
        statusHeader: "Status",
        tokenHeader: "Server Token",
        workingHoursHeader: "Working Hours",
        createdAtHeader: "Created At",
        noStoresFound: "No stores found matching your criteria.",
        futureFeatures:
          "Upcoming: Store listing, adding, and deleting forms will be placed here.",
        storeDetailsTitle: "Store Details",
        dialogClose: "Close",
        typeToFilter: "Type to filter or select",
        noSuggestions: "No suggestions",
      },
      firmware: {
        title: "Firmware Updates",
        introText: "This section is where you manage firmware updates.",
        instructionText:
          "You can distribute new software to devices from here.",
        futureFeatures:
          "Upcoming: Features to view current firmware versions and distribute new versions will be added.",
      },
      users: {
        title: "Users / Roles",
        introText: "This section is where you manage user accounts and roles.",
        instructionText: "You can add new users and define their permissions.",
        futureFeatures:
          "Upcoming: User listing, adding, editing, and deleting features will be added.",
      },
      menu: {
        dashboard: "Dashboard",
        stores: "Stores & Branches",
        firmware: "Firmware Updates",
        users: "Users / Roles",
      },
      profile: {
        userName: "John Doe",
      },
      footer: {
        rights: "All Rights Reserved.",
        address: "Address: Example St. No: 123, Example City, Country.",
        email: "Email:",
        phone: "Phone:",
        privacy: "Privacy Policy",
        terms: "Terms of Use",
      },
    },
  };

  // Menu items and routes
  // Content will now only be taken from the English translations object
  const navItems = [
    { name: translations.en.menu.dashboard, icon: Home, route: "/" },
    { name: translations.en.menu.stores, icon: Store, route: "/stores" },
    { name: translations.en.menu.firmware, icon: Settings, route: "/firmware" },
    { name: translations.en.menu.users, icon: Users, route: "/users" },
  ];

  // Set logo placeholder URL to match headerSidebarBg color
  const logoPlaceholderUrl = `https://placehold.co/180x40/${colors.headerSidebarBg.substring(
    1
  )}/${colors.logoPrimaryBlue.substring(1)}?font=inter&text=EilSense.io`;

  // Theme toggle function
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  // Function that returns the main content component based on the active route
  const renderMainContent = () => {
    // Page content will always be taken from the English translations object
    const currentTranslations = translations.en;

    switch (activeRoute) {
      case "/":
        return (
          <DashboardPage colors={colors} translations={currentTranslations} />
        );
      case "/stores":
        return (
          <StoresPage colors={colors} translations={currentTranslations} />
        );
      case "/firmware":
        return (
          <FirmwarePage colors={colors} translations={currentTranslations} />
        );
      case "/users":
        return <UsersPage colors={colors} translations={currentTranslations} />;
      default:
        return (
          <div
            className="p-8 rounded-lg shadow-md"
            style={{
              backgroundColor: colors.pureWhite,
              color: colors.darkText,
            }}>
            <h1
              className="text-3xl font-semibold mb-6"
              style={{ color: colors.darkText }}>
              {currentTranslations.dashboard.title}
            </h1>{" "}
            {/* Show dashboard title by default */}
            <p>{currentTranslations.dashboard.welcomeText}</p>
          </div>
        );
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: colors.lightGrayBg }}>
      {/* Top Bar (Header) */}
      <header
        className="flex items-center p-4 shadow-md z-30 fixed w-full top-0 left-0"
        style={{ backgroundColor: colors.headerSidebarBg }}>
        {/* Sidebar Expand/Collapse Button (Left) */}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 transition-colors duration-200 cursor-pointer">
          {isSidebarExpanded ? (
            <X size={24} style={{ color: colors.whiteText }} />
          ) : (
            <Menu size={24} style={{ color: colors.whiteText }} />
          )}{" "}
          {/* Hamburger/X icon */}
        </button>

        {/* Logo Center */}
        <div className="flex-grow flex justify-center">
          {/* EilSense.io */}
          <img
            src={logoPlaceholderUrl}
            alt="EilSense.io Logo"
            className="h-10 w-auto rounded-md"
          />
        </div>

        {/* Profile (Right) and Theme Button */}
        <div className="flex items-center space-x-4">
          {/* Increase spacing with space-x-4 */}
          {/* Theme Toggle Button (Animation */}
          <button
            onClick={toggleTheme}
            className="relative text-white focus:outline-none p-2 rounded-full hover:bg-opacity-20 cursor-pointer">
            {/* Animation classes removed, only visibility control */}
            <Sun
              size={24}
              style={{ color: colors.whiteText }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
                isDarkMode ? "opacity-100" : "opacity-0"
              }`}
            />
            <Moon
              size={24}
              style={{ color: colors.whiteText }}
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-in-out ${
                isDarkMode ? "opacity-0" : "opacity-100"
              }`}
            />
          </button>
          <img
            src="https://placehold.co/40x40/c2c2c2/FFFFFF/png?text=JD" // Placeholder profile photo
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span
            className="font-medium hidden sm:block"
            style={{ color: colors.whiteText }}>
            {translations.en.profile.userName}
          </span>
        </div>
      </header>

      {/* Main Content and Sidebar Container */}
      <div className="flex flex-1" style={{ paddingTop: "64px" }}>
        {" "}
        {/* Padding equal to header height */}
        {/* Sidebar */}
        <aside
          className={`fixed top-16 left-0 h-[calc(100vh-64px)] overflow-y-auto shadow-lg transition-all duration-300 ease-in-out z-20 flex flex-col`}
          style={{
            backgroundColor: colors.headerSidebarBg,
            width: isSidebarExpanded ? "250px" : "77px", // Expanded/Collapsed widths
          }}>
          <nav className="flex-grow">
            {" "}
            {/* Makes nav flexible */}
            <ul className="space-y-2 py-4">
              {" "}
              {/* py-4 for top and bottom padding */}
              {navItems.map((item) => (
                <li key={item.route}>
                  {" "}
                  {/* Using item.route as key is more consistent than item.name */}
                  <a
                    href="/asd" // Use # to prevent page reload
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveRoute(item.route);
                    }} // Capture click event
                    className={`flex items-center rounded-lg font-medium transition-colors duration-200 cursor-pointer
                      ${
                        isSidebarExpanded
                          ? "py-2 px-3"
                          : "py-2 px-2 justify-center"
                      } /* py-2 px-3 expanded, py-2 px-2 collapsed */
                      ${
                        activeRoute === item.route ? "mx-2" : ""
                      } /* Indent active item from sides */
                    `}
                    style={{
                      backgroundColor:
                        activeRoute === item.route
                          ? colors.logoPrimaryBlue
                          : "transparent", // Highlight active item
                      color: colors.whiteText,
                    }}>
                    <item.icon size={20} style={{ color: colors.whiteText }} />
                    <span
                      className={`ml-3 overflow-hidden whitespace-nowrap ${
                        !isSidebarExpanded && "hidden"
                      }`}>
                      {item.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* Language Selection */}
          <div
            className={`w-full  ${
              isSidebarExpanded ? "px-4 pb-4" : "px-2 pb-4"
            }`}>
            <label htmlFor="language-select" className="sr-only">
              Select Language
            </label>
            <select
              id="language-select"
              value={language}
              // onChange functionality will only update language state, not content language.
              onChange={(e) => setLanguage(e.target.value)}
              className={` w-full rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none cursor-pointer
                ${
                  isSidebarExpanded ? "text-left" : "text-center"
                } /* Left when expanded, center when collapsed */
              `}
              style={{
                backgroundColor: colors.headerSidebarBg,
                color: colors.whiteText,
                borderColor: colors.mediumGrayText,
                paddingTop: "0.5rem", // py-2 (8px)
                paddingBottom: "0.5rem", // py-2 (8px)
                paddingLeft: isSidebarExpanded ? "0.75rem" : "0.5rem", // px-3 (12px) vs px-2 (8px)
                paddingRight: isSidebarExpanded ? "0.75rem" : "0.5rem", // px-3 (12px) vs px-2 (8px)
              }}>
              {/* Language options will still be available */}
              <option value="en">{isSidebarExpanded ? "English" : "en"}</option>
              <option value="tr">{isSidebarExpanded ? "Türkçe" : "tr"}</option>
              <option value="ru">{isSidebarExpanded ? "Русский" : "ru"}</option>
              <option value="pl">{isSidebarExpanded ? "Polski" : "pl"}</option>
            </select>
          </div>
        </aside>
        {/* Content Area */}
        <main
          className="flex-1 p-6 transition-all duration-300 ease-in-out overflow-x-hidden" // overflow-x-hidden added
          style={{
            marginLeft: isSidebarExpanded ? "250px" : "77px", // Margin based on sidebar width
            paddingTop: "24px", // Start content after top bar
            backgroundColor: colors.lightGrayBg, // General page background
            color: colors.darkText, // Main text color
          }}>
          {renderMainContent()} {/* Render content based on active route */}
        </main>
      </div>

      {/* Footer */}
      <footer
        className="w-full p-6 text-center text-sm leading-relaxed"
        style={{
          backgroundColor: colors.headerSidebarBg,
          color: colors.whiteText,
        }}>
        <p className="mb-2">
          &copy; {new Date().getFullYear()} EilSense.io.{" "}
          {translations.en.footer.rights}
        </p>
        <p className="mb-2">
          Address: Example St. No: 123, Example City, Country.
        </p>
        <p className="mb-2">
          Email: info@eilsense.io | Phone: +90 555 123 45 67
        </p>
        <p>
          <a
            href="/privacy-policy"
            className="underline hover:text-gray-300 mx-2">
            {translations.en.footer.privacy}
          </a>{" "}
          |
          <a
            href="/terms-of-use"
            className="underline hover:text-gray-300 mx-2">
            {translations.en.footer.terms}
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
