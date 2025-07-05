// src/config/translations.js

export const appTranslations = {
  en: {
    languages: {
      en: "English",
      az: "Azerbaijan",
      tr: "Turkish",
      pl: "Polish",
      ru: "Russian",
    },
    languagesShort: {
      en: "EN",
      az: "AZ",
      tr: "TR",
      pl: "PL",
      ru: "RU",
    },
    // =================================================================
    // General Purpose & Common Components
    // =================================================================
    common: {
      cancel: "Cancel",
      saving: "Saving...",
      notAvailable: "N/A",
      genericError: "An unexpected error occurred. Please try again.",
      couldNotLoadData: "Could not load data.",
      updatingText: "Updating...",
      actionsLabel: "Actions",
      genericUser: "User",
      selectOption: "Select an option",
      typeToSearch: "Type to search...",
      nothingFound: "Nothing found.",
      searchPlaceholder: "Search...",
    },

    // =================================================================
    // App-wide Systems (Menu, Loader, Dialogs, etc.)
    // =================================================================
    menu: {
      dashboard: "Dashboard",
      stores: "Stores & Branches",
      newInstallation: "New Installation",
      firmware: "Firmware",
      users: "Users & Roles",
    },

    loader: {
      loadingTitle: "Loading...",
    },

    dialogs: {
      // General Dialogs
      confirmTitle: "Confirm Action",
      deleteConfirmationPrompt: "To confirm, please type:",
      yesButton: "Yes",
      noButton: "No",
      okButton: "OK",
      // Specific Prompts
      unsavedChangesPrompt:
        "You have unsaved changes. Are you sure you want to leave?",
      // Bluetooth Errors
      btNotConnected: "Not connected to any device.",
      btConfigFailed: "Failed to send configuration to the device.",
    },

    // =================================================================
    // Page & Feature Specific Translations
    // =================================================================
    dashboard: {
      title: "Dashboard",
      welcomeMessage: "Welcome!",
      instructionText:
        "This area will summarize the overall status of your system...",
    },

    stores: {
      // General
      title: "Stores & Branches",
      loading: "Loading stores...",
      noStoresFound: "No stores found.",
      fetchError: "An error occurred while loading stores.",
      couldNotLoadStoreData: "Could not load store data.",

      storeNotFound: "Store not found.",
      // Page Titles & Descriptions
      createStoreTitle: "Create New Store",
      createStoreDesc: "Add a new store or branch to the system.",
      editStoreTitle: "Edit Store Information",
      editStoreDesc: "Update details of existing stores or branches.",
      deleteStoreTitle: "Delete Store",
      deleteStoreDesc: "Remove a store or branch from the system.",
      viewLogsTitle: "View Logs",
      viewLogsDesc: "Access logs related to store operations.",
      logDetailsTitle: "Log Details",
      backToLogsList: "Back to Logs List",
      serverLogsTitle: "Server Logs",
      serverLogsDesc: "View detailed server activity and status.",
      esp32LogsTitle: "ESP32 Logs",
      esp32LogsDesc: "View detailed logs from connected ESP32 devices.",
      // Forms & Fields
      storeNameLabel: "Store Name",
      countryLabel: "Country",
      cityLabel: "City",
      addBranchLabel: "Add Branch",
      branchNameLabel: "Branch Name",
      storeBranchAddressLabel: "Store/Branch Address",
      allDayOpenLabel: "All Day Open (24/7)",
      openingHourLabel: "Opening Hour",
      closingHourLabel: "Closing Hour",
      selectHour: "Select Hour",
      ownerNameLabel: "Owner Name",
      ownerSurnameLabel: "Owner Surname",
      installerNameLabel: "Installer Name",
      serverIpLabel: "Server IP Address",
      requiredFieldWarning: "This field is required.",
      // Table Headers
      nameHeader: "Store Name",
      location: "Location",
      installer: "Installer",
      devices: "Devices",
      // Buttons & Actions
      nextButton: "Next",
      previousButton: "Previous",
      saveButton: "Save",
      saveChangesButton: "Save All Changes",
      editButton: "Edit",
      deleteButton: "Delete",
      viewLogsButton: "View Logs",
      addNewDeviceButton: "Add New Device",
      // Dialogs
      confirmDeleteTitle: "Confirm Deletion",
      confirmDeleteMessage: "Are you sure you want to delete",
      deleteProcessError: "An error occurred during the deletion process.",
      // Server Logs Page
      serverSoftwareVersion: "Software Version",
      lastUpdateDate: "Last Update Date",
      connectedEsp32Count: "Number of Connected ESP32s",
      serverToken: "Server Token",
      registeredByName: "Registered By",
      backToStoreLogDetails: "Back to Log Details",
    },

    "stores.filterControls": {
      country: "Country",
      allCountries: "All Countries",
      city: "City",
      allCities: "All Cities",
      resetButton: "Reset Filters",
    },

    "stores.deleteStore": {
      pageTitle: "Delete a Store",
      pageDescription:
        "Select a store to permanently remove it from the system.",
    },

    "stores.editStore": {
      pageTitle: "Edit Store Details",
      pageDescription: "Select a store to edit its details.",
      workflowTitle: "Edit Store",
      step1Title: "Store Information",
      step2Title: "Device Management",
      successTitle: "Success",
      storeUpdateSuccessMessage: "Store details updated successfully.",
      updateFailedTitle: "Update Failed",
    },

    "stores.installationWizard": {
      title: "New Store Installation",
      description: "Follow the steps to register a new store and its devices.",
      // Step Titles
      step1Title: "Create Store",
      step2Title: "Server Token",
      step3Title: "ESP32 Token",
      step4Title: "Device Setup",
      step5Title: "Complete",
      // Step-specific texts
      step2Description:
        "Generate a unique token for the store server to connect.",
      step3Description:
        "Generate a shared token for all ESP32 devices in this store.",
      step5Description:
        "Final status of your devices is shown below. Review and complete the installation.",
      // Device Form
      installedDevicesTitle: "Installed Devices",
      editDeviceTitle: "Edit Device",
      newDeviceTitle: "New Device Installation",
      noDevicesYet: "No devices have been added yet.",
      idLabel: "ID",
      tokenLabel: "ESP32 Token",
      allDayWorkLabel: "All Day Work",
      awakeTimeLabel: "Awake Time",
      sleepTimeLabel: "Sleep Time",
      screenSizeLabel: "Screen Size",
      selectScreenSize: "Select...",
      wifiSsidLabel: "WIFI SSID",
      wifiPasswordLabel: "WIFI Password",
      fontSettingsLabel: "Font Settings",
      productNameFontSizeLabel: "Product Name",
      productPriceFontSizeBeforeDiscountLabel: "Price (Before)",
      productPriceFontSizeAfterDiscountLabel: "Price (After)",
      productBarcodeFontSizeLabel: "Barcode",
      productBarcodeNumbersFontSizeLabel: "Barcode Numbers",
      noSsid: "No SSID",
      allDay: "All Day",
      // Tokens & Connection
      generateTokenButton: "Generate Token",
      generating: "Generating...",
      tokenPlaceholder: "Token will appear here...",
      step3TokenPlaceholder: "Click 'Generate' to create a token...",
      copyToClipboardButton: "Copy to Clipboard",
      copiedMessage: "Copied!",
      checkConnectionButton: "Check Connection",
      checking: "Checking...",
      connectionSuccess: "Connection successful!",
      connectionError: "Connection failed:",
      // Errors & Warnings
      storeIdNotFoundError: "Store ID not found. Please go back to Step 1.",
      tokenGenerationError: "Failed to generate token.",
      generateTokenFirst: "Please generate a token first.",
      cannotProceedTitle: "Cannot Proceed",
      checkConnectionFirst:
        "Please press 'Check Connection' and ensure it's successful.",
      idRequired: "ID is required.",
      idMustBePositive: "ID must be a positive integer.",
      idInUse: "This ID is already in use.",
      screenSizeRequired: "Screen size is required.",
      wifiSsidRequired: "WIFI SSID is required.",
      wifiPasswordRequired: "WIFI Password is required.",
      passwordRequiredForNew: "Password is required for new devices.",
      awakeTimeRequired: "Awake time is required.",
      sleepTimeRequired: "Sleep time is required.",
      unsavedChangesTitle: "Unsaved Changes",
      unsavedChangesMessage: "Please save or cancel the open device form.",
      validationErrorTitle: "Validation Error",
      validationErrorMessage:
        "A valid Server IP Address is required to proceed.",
      warningTitle: "Warning",
      noDevicesWarning: "Please add at least one device to proceed.",
      exitConfirmation:
        "Installation is in progress. Are you sure you want to leave this page? Your progress will be lost.",
      beforeUnloadPrompt:
        "You have unsaved changes. Are you sure you want to leave?",
      // Final Step
      loadingStatus: "Loading final status...",
      installingText: "Installing...",
      completeInstallationButton: "Complete Installation",
      installationErrorTitle: "Installation Error",
      installationTimeoutError:
        "Installation request timed out. Please try again.",
      deleteDeviceTooltip: "Delete Device",

      installationSuccessTitle: "Installation Successful",
      installationSuccessMessage:
        "Installation completed successfully! Redirecting to the dashboard...",
      installationFailedMessage:
        "Failed to complete installation. Please try again.",
      installationTimeoutMessage:
        "Installation request timed out. Please try again.",

      // NEW: Translations for Step 5 logs
      error: "Error",
      errorValidation: "Validation Error",
      logSourceServer: "Store Server",
      logSourceDevices: "Devices",
      logStatusOnline: "Online",
      logStatusReady: "Ready",
      logStatusNotFound: "Not Found",
      logDetailHeartbeat: "Heartbeat Received",
      logDetailLastSeen: "Last Seen",
      logDetailYes: "Yes",
      logDetailBattery: "Battery Status",
      logDetailRefreshRate: "Screen Refresh Rate",
      logDetailLastSync: "Last Sync",
      logDetailInfo: "Info",
      logDevicePrefix: "Device ID:",
      logNoDevices: "No devices were added in Step 4.",
      logRefreshRateValue: "15 minutes",
    },

    "stores.esp32LogFilters": {
      filterTitle: "Filters",
      date: "Date",
      selectDate: "Select date...",
      logTime: "Log Time",
      allTimes: "All Times",
      opening: "Opening (06-10)",
      midDay: "Mid-Day (11-15)",
      closing: "Closing (17+)",
      noDataSuffix: " - No data",
      batteryLevel: "Battery Level",
      allBatteries: "All Batteries",
      highBattery: "High (>50%)",
      mediumBattery: "Medium (20-50%)",
      lowBattery: "Low (<20%)",
      softwareVersion: "Software Version",
      allVersions: "All Versions",
      filterInfo:
        "Showing logs from the last 30 days. Disabled options have no data for the selected date.",
      resetFilters: "Reset Filters",
    },

    "stores.esp32LogTable": {
      title: "ESP32 Logs -", // Store name is appended
      headerTimestamp: "Timestamp",
      headerDeviceId: "Device ID",
      headerStore: "Store",
      headerBranch: "Branch",
      headerBattery: "Battery",
      headerRefresh: "Refresh (ms)",
      headerMosfet: "Mosfet",
      headerVersion: "Version",
      headerLogType: "Log Type",
      noLogsFoundTitle: "No logs found",
      noLogsFoundMessage:
        "There are no logs matching your current filter criteria.",
    },

    users: {
      // General
      usersRolesTitle: "Users & Roles",
      // Page Titles & Descriptions
      userForSupermarketTitle: "Supermarket Users",
      userForSupermarketDesc:
        "Manage users associated with supermarket branches.",
      userForCompanyTitle: "Company Users",
      userForCompanyDesc: "Manage users associated with the main company.",
      // Table Headers
      fullNameHeader: "Full Name",
      roleHeader: "Role",
      countryHeader: "Country",
      cityHeader: "City",
      assignedStoreHeader: "Assigned Store",
      // Status & Error Messages
      noUsersFound: "No users found.",
      userLoadError: "Could not load user data. The user may not exist.",
      usersLoadError: "Failed to load users. Please try again later.",
      userDeleteError: "An error occurred while deleting the user.",
      userOrStoreLoadError: "Could not load user data or stores.",
      // Dialogs
      confirmDeleteTitle: "Confirm User Deletion",
      confirmDeleteMessage: "Are you sure you want to delete", // Appends user name
      // Misc
      profilePreviewAlt: "Profile Preview",
      userAvatarAlt: "Avatar for {userName}", // {userName} is a placeholder
    },

    "users.companyUsersPage": {
      title: "Company Users",
      subtitle: "Manage administrators, country chiefs, and engineers",
      addUser: "Add User",
    },

    "users.supermarketUsersPage": {
      title: "Supermarket Users",
      subtitle: "Manage users assigned to specific supermarket branches",
      addUser: "Add User",
    },

    "users.addUserForm": {
      title: "Add New Company User",
      subtitle: "Fill in the details to create a new user account.",
      nameLabel: "Name",
      surnameLabel: "Surname",
      emailLabel: "Email",
      passwordLabel: "Password",
      repeatPasswordLabel: "Repeat Password",
      roleLabel: "Role",
      selectRole: "Select a role",
      countryLabel: "Country",
      cityLabel: "City",
      saveButton: "Save User",
      profilePictureLabel: "Profile Picture",
      passwordMismatchError: "Passwords do not match.",
      roleRequiredError: "Please select a role for the user.",
    },

    "users.addSupermarketUserForm": {
      title: "Add New Supermarket User",
      subtitle: "Create a new user assigned to a store",
      fetchStoresError: "Failed to load stores.",
      storeRequiredError: "Please assign a store to the user.",
      assignStoreLabel: "Assign to Store",
      selectStore: "Select a store",
    },

    "users.editUserForm": {
      title: "Edit User",
      titleSupermarket: "Edit Supermarket User",
      subtitlePrefix: "Update the details for",
      saveButton: "Save Changes",
    },

    roles: {
      Admin: "Admin",
      Country_Chief: "Country Chief",
      Engineer: "Engineer",
      Analyst: "Analyst",
      Runner: "Runner",
    },

    firmware: {
      title: "Firmware",
      introText: "This section is where you manage firmware updates.",
      instructionText: "You can distribute new software to devices from here.",
      futureFeatures:
        "Upcoming: Features to view current firmware versions and distribute new versions will be added.",
    },

    profile: {
      // Profile Details Page
      detailsTitle: "Profile Details",
      profilePictureLabel: "Profile Picture",
      nameLabel: "Name",
      surnameLabel: "Surname",
      emailLabel: "Email",
      changePasswordTitle: "Change Password",
      changePasswordSubtitle: "Leave blank to keep current password",
      newPasswordLabel: "New Password",
      repeatPasswordLabel: "Repeat New Password",
      saveButton: "Save Changes",
      updateSuccess: "Profile information updated successfully!",
      // Header Dropdown
      logOut: "Log Out",
      avatarAlt: "Profile",
      // Errors
      passwordMismatchError: "Passwords do not match.",
      passwordLengthError: "Password must be at least 6 characters.",
      nameRequired: "Name field is required.",
      surnameRequired: "Surname field is required.",
      emailRequired: "Email field is required.",
      invalidEmail: "Please enter a valid email address.",
      profilePictureSizeError: "Profile picture must be smaller than 15MB.",
      profilePictureTypeError: "Please select a valid image file.",
      updateError: "An error occurred during update.",
      updateInvalidDataError:
        "Submitted data is invalid. Please check all fields.",
      sessionExpiredError: "Your session has expired. Please log in again.",
      permissionError: "You do not have permission for this action.",
    },

    footer: {
      rights: "All Rights Reserved.",
      address: "Example St. No: 123, Example City, Country.",
      email: "Email:",
      phone: "Phone:",
      privacy: "Privacy Policy",
      terms: "Terms of Use",
    },

    login: {
      title: "Login",
      mailLabel: "Email",
      passwordLabel: "Password",
      rememberMe: "Remember Me",
      loginButton: "Login",
      loginError: "Invalid email or password.",
    },

    accessDenied: {
      title: "Access Denied",
      message: "You do not have permission to access this section.",
      goBackButton: "Go Back",
    },

    notFound: {
      title: "404 - Page Not Found",
      message: "The page you are looking for does not exist or has been moved.",
      backToHomeButton: "Go to Homepage",
    },
  },

  az: {
    languages: {
      en: "İngilis",
      az: "Azərbaycan",
      tr: "Türk",
      pl: "Polyak",
      ru: "Rus",
    },
    languagesShort: {
      en: "EN",
      az: "AZ",
      tr: "TR",
      pl: "PL",
      ru: "RU",
    },
    // =================================================================
    // Ümumi Məqsədli və Ortaq Komponentlər
    // =================================================================
    common: {
      cancel: "Ləğv et",
      saving: "Yaddaşda saxlanılır...",
      notAvailable: "Mövcud deyil",
      genericError:
        "Gözlənilməz bir xəta baş verdi. Zəhmət olmasa, yenidən cəhd edin.",
      couldNotLoadData: "Məlumatlar yüklənə bilmədi.",
      updatingText: "Yenilənir...",
      actionsLabel: "Əməliyyatlar",
      genericUser: "İstifadəçi",
      selectOption: "Bir seçim edin",
      typeToSearch: "Axtarmaq üçün yazın...",
      nothingFound: "Heç bir nəticə tapılmadı.",
      searchPlaceholder: "Axtar...",
    },

    // =================================================================
    // Tətbiq Geneli Sistemlər (Menyu, Yükləyici, Dialoqlar və s.)
    // =================================================================
    menu: {
      dashboard: "İdarəetmə Paneli",
      stores: "Mağazalar və Filiallar",
      newInstallation: "Yeni Quraşdırma",
      firmware: "Proqram Təminatı",
      users: "İstifadəçilər və Rollar",
    },

    loader: {
      loadingTitle: "Yüklənir...",
    },

    dialogs: {
      // Ümumi Dialoqlar
      confirmTitle: "Əməliyyatı Təsdiqləyin",
      deleteConfirmationPrompt: "Təsdiqləmək üçün, zəhmət olmasa, yazın:",
      yesButton: "Bəli",
      noButton: "Xeyr",
      okButton: "OK",
      // Xüsusi Sorğular
      unsavedChangesPrompt:
        "Yadda saxlanılmamış dəyişiklikləriniz var. Çıxmaq istədiyinizə əminsinizmi?",
      // Bluetooth Xətaları
      btNotConnected: "Heç bir cihaza qoşulmayıb.",
      btConfigFailed: "Konfiqurasiya cihaza göndərilə bilmədi.",
    },

    // =================================================================
    // Səhifə və Funksiyalara Xas Tərcümələr
    // =================================================================
    dashboard: {
      title: "İdarəetmə Paneli",
      welcomeMessage: "Xoş gəlmisiniz!",
      instructionText:
        "Bu sahə sisteminizin ümumi vəziyyətini xülasə edəcək...",
    },

    stores: {
      // Ümumi
      title: "Mağazalar və Filiallar",
      loading: "Mağazalar yüklənir...",
      noStoresFound: "Heç bir mağaza tapılmadı.",
      fetchError: "Mağazalar yüklənərkən bir xəta baş verdi.",
      couldNotLoadStoreData: "Mağaza məlumatları yüklənə bilmədi.",
      storeNotFound: "Mağaza tapılmadı.",
      // Səhifə Başlıqları və Təsvirləri
      createStoreTitle: "Yeni Mağaza Yarat",
      createStoreDesc: "Sistemə yeni bir mağaza və ya filial əlavə edin.",
      editStoreTitle: "Mağaza Məlumatlarını Redaktə Et",
      editStoreDesc: "Mövcud mağaza və ya filialların detallarını yeniləyin.",
      deleteStoreTitle: "Mağazanı Sil",
      deleteStoreDesc: "Sistemdən bir mağaza və ya filialı silin.",
      viewLogsTitle: "Qeydlərə Bax",
      viewLogsDesc: "Mağaza əməliyyatları ilə bağlı qeydlərə daxil olun.",
      logDetailsTitle: "Qeyd Detalları",
      backToLogsList: "Qeyd Siyahısına Geri Dön",
      serverLogsTitle: "Server Qeydləri",
      serverLogsDesc: "Ətraflı server fəaliyyətinə və statusuna baxın.",
      esp32LogsTitle: "ESP32 Qeydləri",
      esp32LogsDesc:
        "Qoşulmuş ESP32 cihazlarından gələn ətraflı qeydlərə baxın.",
      // Formalar və Sahələr
      storeNameLabel: "Mağaza Adı",
      countryLabel: "Ölkə",
      cityLabel: "Şəhər",
      addBranchLabel: "Filial Əlavə Et",
      branchNameLabel: "Filial Adı",
      storeBranchAddressLabel: "Mağaza/Filial Ünvanı",
      allDayOpenLabel: "Bütün Gün Açıq (24/7)",
      openingHourLabel: "Açılış Saatı",
      closingHourLabel: "Bağlanış Saatı",
      selectHour: "Saat Seçin",
      ownerNameLabel: "Sahibinin Adı",
      ownerSurnameLabel: "Sahibinin Soyadı",
      installerNameLabel: "Quraşdıran Şəxs",
      serverIpLabel: "Server IP Ünvanı",
      requiredFieldWarning: "Bu sahə məcburidir.",
      // Cədvəl Başlıqları
      nameHeader: "Mağaza Adı",
      location: "Məkan",
      installer: "Quraşdıran",
      devices: "Cihazlar",
      // Düymələr və Əməliyyatlar
      nextButton: "Növbəti",
      previousButton: "Əvvəlki",
      saveButton: "Yadda Saxla",
      saveChangesButton: "Bütün Dəyişiklikləri Yadda Saxla",
      editButton: "Redaktə Et",
      deleteButton: "Sil",
      viewLogsButton: "Qeydlərə Bax",
      addNewDeviceButton: "Yeni Cihaz Əlavə Et",
      // Dialoqlar
      confirmDeleteTitle: "Silmə Əməliyyatını Təsdiqləyin",
      confirmDeleteMessage: "Silmək istədiyinizə əminsinizmi?",
      deleteProcessError: "Silmə prosesi zamanı bir xəta baş verdi.",
      // Server Qeydləri Səhifəsi
      serverSoftwareVersion: "Proqram Versiyası",
      lastUpdateDate: "Son Yenilənmə Tarixi",
      connectedEsp32Count: "Qoşulmuş ESP32 Sayı",
      serverToken: "Server Tokeni",
      registeredByName: "Qeydiyyatdan Keçirən",
      backToStoreLogDetails: "Qeyd Detallarına Geri Dön",
    },

    "stores.filterControls": {
      country: "Ölkə",
      allCountries: "Bütün Ölkələr",
      city: "Şəhər",
      allCities: "Bütün Şəhərlər",
      resetButton: "Filterləri Sıfırla",
    },

    "stores.deleteStore": {
      pageTitle: "Mağazanı Sil",
      pageDescription: "Sistemdən daimi olaraq silmək üçün bir mağaza seçin.",
    },

    "stores.editStore": {
      pageTitle: "Mağaza Detallarını Redaktə Et",
      pageDescription: "Məlumatlarını redaktə etmək üçün bir mağaza seçin.",
      workflowTitle: "Mağazanı Redaktə Et",
      step1Title: "Mağaza Məlumatları",
      step2Title: "Cihaz İdarəetməsi",
      successTitle: "Uğurlu",
      storeUpdateSuccessMessage: "Mağaza detalları uğurla yeniləndi.",
      updateFailedTitle: "Yeniləmə Uğursuz Oldu",
    },

    "stores.installationWizard": {
      title: "Yeni Mağaza Quraşdırılması",
      description:
        "Yeni bir mağaza və onun cihazlarını qeydiyyatdan keçirmək üçün addımları izləyin.",
      // Addım Başlıqları
      step1Title: "Mağaza Yarat",
      step2Title: "Server Tokeni",
      step3Title: "ESP32 Tokeni",
      step4Title: "Cihaz Ayarları",
      step5Title: "Tamamla",
      // Addıma Xas Mətnlər
      step2Description:
        "Mağaza serverinin qoşulması üçün unikal bir token yaradın.",
      step3Description:
        "Bu mağazadakı bütün ESP32 cihazları üçün ortaq bir token yaradın.",
      step5Description:
        "Cihazlarınızın son vəziyyəti aşağıda göstərilir. Yoxlayıb quraşdırmanı tamamlayın.",
      // Cihaz Forması
      installedDevicesTitle: "Quraşdırılmış Cihazlar",
      editDeviceTitle: "Cihazı Redaktə Et",
      newDeviceTitle: "Yeni Cihaz Quraşdırılması",
      noDevicesYet: "Hələ heç bir cihaz əlavə edilməyib.",
      idLabel: "ID",
      tokenLabel: "ESP32 Tokeni",
      allDayWorkLabel: "Bütün Gün İşləmə",
      awakeTimeLabel: "Oyanma Vaxtı",
      sleepTimeLabel: "Yuxu Vaxtı",
      screenSizeLabel: "Ekran Ölçüsü",
      selectScreenSize: "Seçin...",
      wifiSsidLabel: "WIFI SSID",
      wifiPasswordLabel: "WIFI Şifrəsi",
      fontSettingsLabel: "Şrift Ayarları",
      productNameFontSizeLabel: "Məhsul Adı",
      productPriceFontSizeBeforeDiscountLabel: "Qiymət (Endirimsiz)",
      productPriceFontSizeAfterDiscountLabel: "Qiymət (Endirimli)",
      productBarcodeFontSizeLabel: "Barkod",
      productBarcodeNumbersFontSizeLabel: "Barkod Nömrələri",
      noSsid: "SSID Yoxdur",
      allDay: "Bütün Gün",
      // Tokenlər və Qoşulma
      generateTokenButton: "Token Yarat",
      generating: "Yaradılır...",
      tokenPlaceholder: "Token burada görünəcək...",
      step3TokenPlaceholder: "Token yaratmaq üçün 'Yarat' düyməsinə basın...",
      copyToClipboardButton: "Panoya Kopyala",
      copiedMessage: "Kopyalandı!",
      checkConnectionButton: "Qoşulmanı Yoxla",
      checking: "Yoxlanılır...",
      connectionSuccess: "Qoşulma uğurludur!",
      connectionError: "Qoşulma uğursuz oldu:",
      // Xətalar və Xəbərdarlıqlar
      storeIdNotFoundError:
        "Mağaza ID-si tapılmadı. Zəhmət olmasa, 1-ci Addıma geri dönün.",
      tokenGenerationError: "Token yaradıla bilmədi.",
      generateTokenFirst: "Zəhmət olmasa, əvvəlcə bir token yaradın.",
      cannotProceedTitle: "Davam Etmək Mümkün Deyil",
      checkConnectionFirst:
        "Zəhmət olmasa, 'Qoşulmanı Yoxla' düyməsinə basın və uğurlu olduğundan əmin olun.",
      idRequired: "ID sahəsi məcburidir.",
      idMustBePositive: "ID müsbət bir tam ədəd olmalıdır.",
      idInUse: "Bu ID artıq istifadə olunur.",
      screenSizeRequired: "Ekran ölçüsü məcburidir.",
      wifiSsidRequired: "WIFI SSID məcburidir.",
      wifiPasswordRequired: "WIFI Şifrəsi məcburidir.",
      passwordRequiredForNew: "Yeni cihazlar üçün şifrə məcburidir.",
      awakeTimeRequired: "Oyanma vaxtı məcburidir.",
      sleepTimeRequired: "Yuxu vaxtı məcburidir.",
      unsavedChangesTitle: "Yadda Saxlanılmamış Dəyişikliklər",
      unsavedChangesMessage:
        "Zəhmət olmasa, açıq olan cihaz formasını yadda saxlayın və ya ləğv edin.",
      validationErrorTitle: "Doğrulama Xətası",
      validationErrorMessage:
        "Davam etmək üçün etibarlı bir Server IP Ünvanı tələb olunur.",
      warningTitle: "Xəbərdarlıq",
      noDevicesWarning:
        "Davam etmək üçün zəhmət olmasa, ən azı bir cihaz əlavə edin.",
      exitConfirmation:
        "Quraşdırma davam edir. Bu səhifədən çıxmaq istədiyinizə əminsinizmi? Tərəqqiniz itiriləcək.",
      beforeUnloadPrompt:
        "Yadda saxlanılmamış dəyişiklikləriniz var. Çıxmaq istədiyinizə əminsinizmi?",
      // Son Addım
      loadingStatus: "Son vəziyyət yüklənir...",
      installingText: "Quraşdırılır...",
      completeInstallationButton: "Quraşdırmanı Tamamla",
      installationErrorTitle: "Quraşdırma Xətası",
      installationTimeoutError:
        "Quraşdırma sorğusunun vaxtı bitdi. Zəhmət olmasa, yenidən cəhd edin.",
      deleteDeviceTooltip: "Cihazı Sil",

      installationSuccessTitle: "Quraşdırma Uğurlu Oldu",
      installationSuccessMessage:
        "Quraşdırma uğurla tamamlandı! İdarəetmə panelinə yönləndirilirsiniz...",
      installationFailedMessage:
        "Quraşdırma tamamlanmadı. Zəhmət olmasa, yenidən cəhd edin.",
      installationTimeoutMessage:
        "Quraşdırma sorğusunun vaxtı bitdi. Zəhmət olmasa, yenidən cəhd edin.",

      // Addım 5 qeydləri üçün tərcümələr
      error: "Xəta",
      errorValidation: "Doğrulama Xətası",
      logSourceServer: "Mağaza Serveri",
      logSourceDevices: "Cihazlar",
      logStatusOnline: "Onlayn",
      logStatusReady: "Hazır",
      logStatusNotFound: "Tapılmadı",
      logDetailHeartbeat: "Həyat Siqnalı Alındı",
      logDetailLastSeen: "Son Görülmə",
      logDetailYes: "Bəli",
      logDetailBattery: "Batareya Vəziyyəti",
      logDetailRefreshRate: "Ekran Yeniləmə Tezliyi",
      logDetailLastSync: "Son Sinxronizasiya",
      logDetailInfo: "Məlumat",
      logDevicePrefix: "Cihaz ID:",
      logNoDevices: "Addım 4-də heç bir cihaz əlavə edilməyib.",
      logRefreshRateValue: "15 dəqiqə",
    },

    "stores.esp32LogFilters": {
      filterTitle: "Filterlər",
      date: "Tarix",
      selectDate: "Tarix seçin...",
      logTime: "Qeyd Vaxtı",
      allTimes: "Bütün Vaxtlar",
      opening: "Açılış (06-10)",
      midDay: "Günorta (11-15)",
      closing: "Bağlanış (17+)",
      noDataSuffix: " - Məlumat yoxdur",
      batteryLevel: "Batareya Səviyyəsi",
      allBatteries: "Bütün Batareyalar",
      highBattery: "Yüksək (>50%)",
      mediumBattery: "Orta (20-50%)",
      lowBattery: "Aşağı (<20%)",
      softwareVersion: "Proqram Versiyası",
      allVersions: "Bütün Versiyalar",
      filterInfo:
        "Son 30 günün qeydləri göstərilir. Qeyri-aktiv seçimlərdə seçilmiş tarix üçün məlumat yoxdur.",
      resetFilters: "Filterləri Sıfırla",
    },

    "stores.esp32LogTable": {
      title: "ESP32 Qeydləri -", // Mağaza adı əlavə ediləcək
      headerTimestamp: "Zaman Damğası",
      headerDeviceId: "Cihaz ID",
      headerStore: "Mağaza",
      headerBranch: "Filial",
      headerBattery: "Batareya",
      headerRefresh: "Yeniləmə (ms)",
      headerMosfet: "Mosfet",
      headerVersion: "Versiya",
      headerLogType: "Qeyd Növü",
      noLogsFoundTitle: "Qeyd tapılmadı",
      noLogsFoundMessage:
        "Mövcud filtr meyarlarınıza uyğun heç bir qeyd tapılmadı.",
    },

    users: {
      // Ümumi
      usersRolesTitle: "İstifadəçilər və Rollar",
      // Səhifə Başlıqları və Təsvirləri
      userForSupermarketTitle: "Supermarket İstifadəçiləri",
      userForSupermarketDesc:
        "Supermarket filialları ilə əlaqəli istifadəçiləri idarə edin.",
      userForCompanyTitle: "Şirkət İstifadəçiləri",
      userForCompanyDesc: "Ana şirkətlə əlaqəli istifadəçiləri idarə edin.",
      // Cədvəl Başlıqları
      fullNameHeader: "Ad Soyad",
      roleHeader: "Rol",
      countryHeader: "Ölkə",
      cityHeader: "Şəhər",
      assignedStoreHeader: "Təyin Edilmiş Mağaza",
      // Status və Xəta Mesajları
      noUsersFound: "Heç bir istifadəçi tapılmadı.",
      userLoadError:
        "İstifadəçi məlumatları yüklənə bilmədi. İstifadəçi mövcud olmaya bilər.",
      usersLoadError:
        "İstifadəçilər yüklənə bilmədi. Zəhmət olmasa, daha sonra yenidən cəhd edin.",
      userDeleteError: "İstifadəçi silinərkən bir xəta baş verdi.",
      userOrStoreLoadError:
        "İstifadəçi məlumatları və ya mağazalar yüklənə bilmədi.",
      // Dialoqlar
      confirmDeleteTitle: "İstifadəçi Silmə Təsdiqi",
      confirmDeleteMessage: "Silmək istədiyinizə əminsinizmi:", // İstifadəçi adı əlavə ediləcək
      // Digər
      profilePreviewAlt: "Profil Baxışı",
      userAvatarAlt: "{userName} üçün avatar", // {userName} yer tutucudur
    },

    "users.companyUsersPage": {
      title: "Şirkət İstifadəçiləri",
      subtitle: "İdarəçiləri, ölkə rəhbərlərini və mühəndisləri idarə edin",
      addUser: "İstifadəçi Əlavə Et",
    },

    "users.supermarketUsersPage": {
      title: "Supermarket İstifadəçiləri",
      subtitle:
        "Xüsusi supermarket filiallarına təyin edilmiş istifadəçiləri idarə edin",
      addUser: "İstifadəçi Əlavə Et",
    },

    "users.addUserForm": {
      title: "Yeni Şirkət İstifadəçisi Əlavə Et",
      subtitle: "Yeni bir istifadəçi hesabı yaratmaq üçün detalları doldurun.",
      nameLabel: "Ad",
      surnameLabel: "Soyad",
      emailLabel: "E-poçt",
      passwordLabel: "Şifrə",
      repeatPasswordLabel: "Şifrə Təkrar",
      roleLabel: "Rol",
      selectRole: "Bir rol seçin",
      countryLabel: "Ölkə",
      cityLabel: "Şəhər",
      saveButton: "İstifadəçini Yadda Saxla",
      profilePictureLabel: "Profil Şəkli",
      passwordMismatchError: "Şifrələr uyğun gəlmir.",
      roleRequiredError: "Zəhmət olmasa, istifadəçi üçün bir rol seçin.",
    },

    "users.addSupermarketUserForm": {
      title: "Yeni Supermarket İstifadəçisi Əlavə Et",
      subtitle: "Bir mağazaya təyin edilmiş yeni bir istifadəçi yaradın",
      fetchStoresError: "Mağazalar yüklənə bilmədi.",
      storeRequiredError:
        "Zəhmət olmasa, istifadəçini bir mağazaya təyin edin.",
      assignStoreLabel: "Mağazaya Təyin Et",
      selectStore: "Bir mağaza seçin",
    },

    "users.editUserForm": {
      title: "İstifadəçini Redaktə Et",
      titleSupermarket: "Supermarket İstifadəçisini Redaktə Et",
      subtitlePrefix: "üçün detalları yeniləyin:",
      saveButton: "Dəyişiklikləri Yadda Saxla",
    },

    roles: {
      Admin: "İdarəçi",
      Country_Chief: "Ölkə Rəhbəri",
      Engineer: "Mühəndis",
      Analyst: "Analitik",
      Runner: "Səhra İşçisi",
    },

    firmware: {
      title: "Proqram Təminatı",
      introText:
        "Bu bölmə, proqram təminatı yeniləmələrini idarə etdiyiniz yerdir.",
      instructionText:
        "Cihazlara yeni proqram təminatlarını buradan paylaya bilərsiniz.",
      futureFeatures:
        "Tezliklə: Mövcud proqram versiyalarına baxmaq və yeni versiyaları paylamaq üçün funksiyalar əlavə ediləcək.",
    },

    profile: {
      // Profil Detalları Səhifəsi
      detailsTitle: "Profil Detalları",
      profilePictureLabel: "Profil Şəkli",
      nameLabel: "Ad",
      surnameLabel: "Soyad",
      emailLabel: "E-poçt",
      changePasswordTitle: "Şifrəni Dəyişdir",
      changePasswordSubtitle: "Mövcud şifrəni saxlamaq üçün boş buraxın",
      newPasswordLabel: "Yeni Şifrə",
      repeatPasswordLabel: "Yeni Şifrə Təkrar",
      saveButton: "Dəyişiklikləri Yadda Saxla",
      updateSuccess: "Profil məlumatları uğurla yeniləndi!",
      // Başlıq Açılan Menyu
      logOut: "Çıxış Et",
      avatarAlt: "Profil",
      // Xətalar
      passwordMismatchError: "Şifrələr uyğun gəlmir.",
      passwordLengthError: "Şifrə ən az 6 simvol olmalıdır.",
      nameRequired: "Ad sahəsi məcburidir.",
      surnameRequired: "Soyad sahəsi məcburidir.",
      emailRequired: "E-poçt sahəsi məcburidir.",
      invalidEmail: "Zəhmət olmasa, etibarlı bir e-poçt ünvanı daxil edin.",
      profilePictureSizeError: "Profil şəkli 15MB-dən kiçik olmalıdır.",
      profilePictureTypeError: "Zəhmət olmasa, etibarlı bir şəkil faylı seçin.",
      updateError: "Yeniləmə zamanı bir xəta baş verdi.",
      updateInvalidDataError:
        "Təqdim edilən məlumatlar etibarsızdır. Zəhmət olmasa, bütün sahələri yoxlayın.",
      sessionExpiredError:
        "Sessiyanızın vaxtı bitdi. Zəhmət olmasa, yenidən daxil olun.",
      permissionError: "Bu əməliyyat üçün icazəniz yoxdur.",
    },

    footer: {
      rights: "Bütün Hüquqlar Qorunur.",
      address: "Nümunə Küç. No: 123, Nümunə Şəhər, Ölkə.",
      email: "E-poçt:",
      phone: "Telefon:",
      privacy: "Məxfilik Siyasəti",
      terms: "İstifadə Şərtləri",
    },

    login: {
      title: "Daxil Ol",
      mailLabel: "E-poçt",
      passwordLabel: "Şifrə",
      rememberMe: "Məni Xatırla",
      loginButton: "Daxil Ol",
      loginError: "Etibarsız e-poçt və ya şifrə.",
    },

    accessDenied: {
      title: "Giriş Qadağandır",
      message: "Bu bölməyə daxil olmaq üçün icazəniz yoxdur.",
      goBackButton: "Geri Dön",
    },

    notFound: {
      title: "404 - Səhifə Tapılmadı",
      message: "Axtardığınız səhifə mövcud deyil və ya yeri dəyişdirilib.",
      backToHomeButton: "Ana Səhifəyə Get",
    },
  },

  tr: {
    languages: {
      en: "İngilizce",
      az: "Azerbaycanca",
      tr: "Türkçe",
      pl: "Lehçe",
      ru: "Rusca",
    },
    languagesShort: {
      en: "EN",
      az: "AZ",
      tr: "TR",
      pl: "PL",
      ru: "RU",
    },
    // =================================================================
    // Genel Amaçlı ve Ortak Bileşenler
    // =================================================================
    common: {
      cancel: "İptal",
      saving: "Kaydediliyor...",
      notAvailable: "Mevcut Değil",
      genericError: "Beklenmedik bir hata oluştu. Lütfen tekrar deneyin.",
      couldNotLoadData: "Veriler yüklenemedi.",
      updatingText: "Güncelleniyor...",
      actionsLabel: "İşlemler",
      genericUser: "Kullanıcı",
      selectOption: "Bir seçenek belirleyin",
      typeToSearch: "Aramak için yazın...",
      nothingFound: "Hiçbir sonuç bulunamadı.",
      searchPlaceholder: "Ara...",
    },

    // =================================================================
    // Uygulama Geneli Sistemler (Menü, Yükleyici, Dialoglar vb.)
    // =================================================================
    menu: {
      dashboard: "Gösterge Paneli",
      stores: "Mağazalar ve Şubeler",
      newInstallation: "Yeni Kurulum",
      firmware: "Yazılım",
      users: "Kullanıcılar ve Roller",
    },

    loader: {
      loadingTitle: "Yükleniyor...",
    },

    dialogs: {
      // Genel Dialoglar
      confirmTitle: "İşlemi Onayla",
      deleteConfirmationPrompt: "Onaylamak için lütfen şunu yazın:",
      yesButton: "Evet",
      noButton: "Hayır",
      okButton: "Tamam",
      // Özel İstemler
      unsavedChangesPrompt:
        "Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?",
      // Bluetooth Hataları
      btNotConnected: "Herhangi bir cihaza bağlı değil.",
      btConfigFailed: "Yapılandırma cihaza gönderilemedi.",
    },

    // =================================================================
    // Sayfa ve Özelliklere Özel Çeviriler
    // =================================================================
    dashboard: {
      title: "Gösterge Paneli",
      welcomeMessage: "Hoş geldiniz!",
      instructionText: "Bu alan, sisteminizin genel durumunu özetleyecektir...",
    },

    stores: {
      // Genel
      title: "Mağazalar ve Şubeler",
      loading: "Mağazalar yükleniyor...",
      noStoresFound: "Hiç mağaza bulunamadı.",
      fetchError: "Mağazalar yüklenirken bir hata oluştu.",
      couldNotLoadStoreData: "Mağaza verileri yüklenemedi.",
      storeNotFound: "Mağaza bulunamadı.",
      // Sayfa Başlıkları ve Açıklamaları
      createStoreTitle: "Yeni Mağaza Oluştur",
      createStoreDesc: "Sisteme yeni bir mağaza veya şube ekleyin.",
      editStoreTitle: "Mağaza Bilgilerini Düzenle",
      editStoreDesc: "Mevcut mağaza veya şubelerin detaylarını güncelleyin.",
      deleteStoreTitle: "Mağazayı Sil",
      deleteStoreDesc: "Sistemden bir mağazayı veya şubeyi kaldırın.",
      viewLogsTitle: "Kayıtları Görüntüle",
      viewLogsDesc: "Mağaza işlemleriyle ilgili kayıtlara erişin.",
      logDetailsTitle: "Kayıt Detayları",
      backToLogsList: "Kayıt Listesine Geri Dön",
      serverLogsTitle: "Sunucu Kayıtları",
      serverLogsDesc: "Detaylı sunucu aktivitesini ve durumunu görüntüleyin.",
      esp32LogsTitle: "ESP32 Kayıtları",
      esp32LogsDesc:
        "Bağlı ESP32 cihazlarından gelen detaylı kayıtları görüntüleyin.",
      // Formlar ve Alanlar
      storeNameLabel: "Mağaza Adı",
      countryLabel: "Ülke",
      cityLabel: "Şehir",
      addBranchLabel: "Şube Ekle",
      branchNameLabel: "Şube Adı",
      storeBranchAddressLabel: "Mağaza/Şube Adresi",
      allDayOpenLabel: "Tüm Gün Açık (7/24)",
      openingHourLabel: "Açılış Saati",
      closingHourLabel: "Kapanış Saati",
      selectHour: "Saat Seçin",
      ownerNameLabel: "Sahibinin Adı",
      ownerSurnameLabel: "Sahibinin Soyadı",
      installerNameLabel: "Kurulumu Yapan Kişi",
      serverIpLabel: "Sunucu IP Adresi",
      requiredFieldWarning: "Bu alan zorunludur.",
      // Tablo Başlıkları
      nameHeader: "Mağaza Adı",
      location: "Konum",
      installer: "Kurulumu Yapan",
      devices: "Cihazlar",
      // Butonlar ve İşlemler
      nextButton: "İleri",
      previousButton: "Geri",
      saveButton: "Kaydet",
      saveChangesButton: "Tüm Değişiklikleri Kaydet",
      editButton: "Düzenle",
      deleteButton: "Sil",
      viewLogsButton: "Kayıtları Görüntüle",
      addNewDeviceButton: "Yeni Cihaz Ekle",
      // Dialoglar
      confirmDeleteTitle: "Silme İşlemini Onayla",
      confirmDeleteMessage: "Silmek istediğinizden emin misiniz:",
      deleteProcessError: "Silme işlemi sırasında bir hata oluştu.",
      // Sunucu Kayıtları Sayfası
      serverSoftwareVersion: "Yazılım Sürümü",
      lastUpdateDate: "Son Güncelleme Tarihi",
      connectedEsp32Count: "Bağlı ESP32 Sayısı",
      serverToken: "Sunucu Token'ı",
      registeredByName: "Kaydı Yapan",
      backToStoreLogDetails: "Kayıt Detaylarına Geri Dön",
    },

    "stores.filterControls": {
      country: "Ülke",
      allCountries: "Tüm Ülkeler",
      city: "Şehir",
      allCities: "Tüm Şehirler",
      resetButton: "Filtreleri Sıfırla",
    },

    "stores.deleteStore": {
      pageTitle: "Mağaza Sil",
      pageDescription:
        "Sistemden kalıcı olarak kaldırmak için bir mağaza seçin.",
    },

    "stores.editStore": {
      pageTitle: "Mağaza Detaylarını Düzenle",
      pageDescription: "Bilgilerini düzenlemek için bir mağaza seçin.",
      workflowTitle: "Mağazayı Düzenle",
      step1Title: "Mağaza Bilgileri",
      step2Title: "Cihaz Yönetimi",
      successTitle: "Başarılı",
      storeUpdateSuccessMessage: "Mağaza detayları başarıyla güncellendi.",
      updateFailedTitle: "Güncelleme Başarısız",
    },

    "stores.installationWizard": {
      title: "Yeni Mağaza Kurulumu",
      description:
        "Yeni bir mağaza ve cihazlarını kaydetmek için adımları izleyin.",
      // Adım Başlıkları
      step1Title: "Mağaza Oluştur",
      step2Title: "Sunucu Token'ı",
      step3Title: "ESP32 Token'ı",
      step4Title: "Cihaz Ayarları",
      step5Title: "Tamamla",
      // Adıma Özel Metinler
      step2Description:
        "Mağaza sunucusunun bağlanması için benzersiz bir token oluşturun.",
      step3Description:
        "Bu mağazadaki tüm ESP32 cihazları için ortak bir token oluşturun.",
      step5Description:
        "Cihazlarınızın son durumu aşağıda gösterilmektedir. Gözden geçirip kurulumu tamamlayın.",
      // Cihaz Formu
      installedDevicesTitle: "Kurulu Cihazlar",
      editDeviceTitle: "Cihazı Düzenle",
      newDeviceTitle: "Yeni Cihaz Kurulumu",
      noDevicesYet: "Henüz hiç cihaz eklenmedi.",
      idLabel: "ID",
      tokenLabel: "ESP32 Token",
      allDayWorkLabel: "Tüm Gün Çalışma",
      awakeTimeLabel: "Uyanma Zamanı",
      sleepTimeLabel: "Uyku Zamanı",
      screenSizeLabel: "Ekran Boyutu",
      selectScreenSize: "Seçiniz...",
      wifiSsidLabel: "WIFI SSID",
      wifiPasswordLabel: "WIFI Şifresi",
      fontSettingsLabel: "Yazı Tipi Ayarları",
      productNameFontSizeLabel: "Ürün Adı",
      productPriceFontSizeBeforeDiscountLabel: "Fiyat (İndirimsiz)",
      productPriceFontSizeAfterDiscountLabel: "Fiyat (İndirimli)",
      productBarcodeFontSizeLabel: "Barkod",
      productBarcodeNumbersFontSizeLabel: "Barkod Numaraları",
      noSsid: "SSID Yok",
      allDay: "Tüm Gün",
      // Token'lar ve Bağlantı
      generateTokenButton: "Token Oluştur",
      generating: "Oluşturuluyor...",
      tokenPlaceholder: "Token burada görünecek...",
      step3TokenPlaceholder: "Bir token oluşturmak için 'Oluştur'a tıklayın...",
      copyToClipboardButton: "Panoya Kopyala",
      copiedMessage: "Kopyalandı!",
      checkConnectionButton: "Bağlantıyı Kontrol Et",
      checking: "Kontrol ediliyor...",
      connectionSuccess: "Bağlantı başarılı!",
      connectionError: "Bağlantı başarısız:",
      // Hatalar ve Uyarılar
      storeIdNotFoundError:
        "Mağaza ID'si bulunamadı. Lütfen 1. Adıma geri dönün.",
      tokenGenerationError: "Token oluşturulamadı.",
      generateTokenFirst: "Lütfen önce bir token oluşturun.",
      cannotProceedTitle: "Devam Edilemiyor",
      checkConnectionFirst:
        "Lütfen 'Bağlantıyı Kontrol Et'e basın ve başarılı olduğundan emin olun.",
      idRequired: "ID alanı zorunludur.",
      idMustBePositive: "ID pozitif bir tam sayı olmalıdır.",
      idInUse: "Bu ID zaten kullanılıyor.",
      screenSizeRequired: "Ekran boyutu zorunludur.",
      wifiSsidRequired: "WIFI SSID zorunludur.",
      wifiPasswordRequired: "WIFI Şifresi zorunludur.",
      passwordRequiredForNew: "Yeni cihazlar için şifre zorunludur.",
      awakeTimeRequired: "Uyanma zamanı zorunludur.",
      sleepTimeRequired: "Uyku zamanı zorunludur.",
      unsavedChangesTitle: "Kaydedilmemiş Değişiklikler",
      unsavedChangesMessage:
        "Lütfen açık olan cihaz formunu kaydedin veya iptal edin.",
      validationErrorTitle: "Doğrulama Hatası",
      validationErrorMessage:
        "Devam etmek için geçerli bir Sunucu IP Adresi gereklidir.",
      warningTitle: "Uyarı",
      noDevicesWarning: "Devam etmek için lütfen en az bir cihaz ekleyin.",
      exitConfirmation:
        "Kurulum devam ediyor. Bu sayfadan ayrılmak istediğinizden emin misiniz? İlerlemeniz kaybolacaktır.",
      beforeUnloadPrompt:
        "Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?",
      // Son Adım
      loadingStatus: "Son durum yükleniyor...",
      installingText: "Kuruluyor...",
      completeInstallationButton: "Kurulumu Tamamla",
      installationErrorTitle: "Kurulum Hatası",
      installationTimeoutError:
        "Kurulum isteği zaman aşımına uğradı. Lütfen tekrar deneyin.",
      deleteDeviceTooltip: "Cihazı Sil",

      installationSuccessTitle: "Kurulum Başarılı",
      installationSuccessMessage:
        "Kurulum başarıyla tamamlandı! Ana sayfaya yönlendiriliyorsunuz...",
      installationFailedMessage:
        "Kurulum tamamlanamadı. Lütfen tekrar deneyin.",
      installationTimeoutMessage:
        "Kurulum isteği zaman aşımına uğradı. Lütfen tekrar deneyin.",

      // Adım 5 logları için çeviriler
      error: "Hata",
      errorValidation: "Doğrulama Hatası",
      logSourceServer: "Mağaza Sunucusu",
      logSourceDevices: "Cihazlar",
      logStatusOnline: "Çevrimiçi",
      logStatusReady: "Hazır",
      logStatusNotFound: "Bulunamadı",
      logDetailHeartbeat: "Yaşam Sinyali Alındı",
      logDetailLastSeen: "Son Görülme",
      logDetailYes: "Evet",
      logDetailBattery: "Pil Durumu",
      logDetailRefreshRate: "Ekran Yenileme Hızı",
      logDetailLastSync: "Son Senkronizasyon",
      logDetailInfo: "Bilgi",
      logDevicePrefix: "Cihaz ID:",
      logNoDevices: "Adım 4'te hiç cihaz eklenmedi.",
      logRefreshRateValue: "15 dakika",
    },

    "stores.esp32LogFilters": {
      filterTitle: "Filtreler",
      date: "Tarih",
      selectDate: "Tarih seçin...",
      logTime: "Kayıt Zamanı",
      allTimes: "Tüm Zamanlar",
      opening: "Açılış (06-10)",
      midDay: "Öğlen (11-15)",
      closing: "Kapanış (17+)",
      noDataSuffix: " - Veri yok",
      batteryLevel: "Pil Seviyesi",
      allBatteries: "Tüm Piller",
      highBattery: "Yüksek (>%50)",
      mediumBattery: "Orta (%20-50)",
      lowBattery: "Düşük (<%20)",
      softwareVersion: "Yazılım Sürümü",
      allVersions: "Tüm Sürümler",
      filterInfo:
        "Son 30 günün kayıtları gösterilmektedir. Pasif seçeneklerde seçili tarih için veri yoktur.",
      resetFilters: "Filtreleri Sıfırla",
    },

    "stores.esp32LogTable": {
      title: "ESP32 Kayıtları -", // Mağaza adı eklenecek
      headerTimestamp: "Zaman Damgası",
      headerDeviceId: "Cihaz ID",
      headerStore: "Mağaza",
      headerBranch: "Şube",
      headerBattery: "Pil",
      headerRefresh: "Yenileme (ms)",
      headerMosfet: "Mosfet",
      headerVersion: "Sürüm",
      headerLogType: "Kayıt Türü",
      noLogsFoundTitle: "Kayıt bulunamadı",
      noLogsFoundMessage:
        "Mevcut filtre kriterlerinize uyan hiçbir kayıt bulunamadı.",
    },

    users: {
      // Genel
      usersRolesTitle: "Kullanıcılar ve Roller",
      // Sayfa Başlıkları ve Açıklamaları
      userForSupermarketTitle: "Süpermarket Kullanıcıları",
      userForSupermarketDesc:
        "Süpermarket şubeleriyle ilişkili kullanıcıları yönetin.",
      userForCompanyTitle: "Şirket Kullanıcıları",
      userForCompanyDesc: "Ana şirketle ilişkili kullanıcıları yönetin.",
      // Tablo Başlıkları
      fullNameHeader: "Ad Soyad",
      roleHeader: "Rol",
      countryHeader: "Ülke",
      cityHeader: "Şehir",
      assignedStoreHeader: "Atanmış Mağaza",
      // Durum ve Hata Mesajları
      noUsersFound: "Hiç kullanıcı bulunamadı.",
      userLoadError:
        "Kullanıcı verileri yüklenemedi. Kullanıcı mevcut olmayabilir.",
      usersLoadError:
        "Kullanıcılar yüklenemedi. Lütfen daha sonra tekrar deneyin.",
      userDeleteError: "Kullanıcı silinirken bir hata oluştu.",
      userOrStoreLoadError: "Kullanıcı verileri veya mağazalar yüklenemedi.",
      // Dialoglar
      confirmDeleteTitle: "Kullanıcı Silme Onayı",
      confirmDeleteMessage: "Silmek istediğinizden emin misiniz:", // Kullanıcı adı eklenecek
      // Diğer
      profilePreviewAlt: "Profil Önizlemesi",
      userAvatarAlt: "{userName} için avatar", // {userName} bir yer tutucudur
    },

    "users.companyUsersPage": {
      title: "Şirket Kullanıcıları",
      subtitle: "Yöneticileri, ülke sorumlularını ve mühendisleri yönetin",
      addUser: "Kullanıcı Ekle",
    },

    "users.supermarketUsersPage": {
      title: "Süpermarket Kullanıcıları",
      subtitle: "Belirli süpermarket şubelerine atanmış kullanıcıları yönetin",
      addUser: "Kullanıcı Ekle",
    },

    "users.addUserForm": {
      title: "Yeni Şirket Kullanıcısı Ekle",
      subtitle: "Yeni bir kullanıcı hesabı oluşturmak için detayları doldurun.",
      nameLabel: "Ad",
      surnameLabel: "Soyad",
      emailLabel: "E-posta",
      passwordLabel: "Şifre",
      repeatPasswordLabel: "Şifre Tekrar",
      roleLabel: "Rol",
      selectRole: "Bir rol seçin",
      countryLabel: "Ülke",
      cityLabel: "Şehir",
      saveButton: "Kullanıcıyı Kaydet",
      profilePictureLabel: "Profil Resmi",
      passwordMismatchError: "Şifreler uyuşmuyor.",
      roleRequiredError: "Lütfen kullanıcı için bir rol seçin.",
    },

    "users.addSupermarketUserForm": {
      title: "Yeni Süpermarket Kullanıcısı Ekle",
      subtitle: "Bir mağazaya atanmış yeni bir kullanıcı oluşturun",
      fetchStoresError: "Mağazalar yüklenemedi.",
      storeRequiredError: "Lütfen kullanıcıyı bir mağazaya atayın.",
      assignStoreLabel: "Mağazaya Ata",
      selectStore: "Bir mağaza seçin",
    },

    "users.editUserForm": {
      title: "Kullanıcıyı Düzenle",
      titleSupermarket: "Süpermarket Kullanıcısını Düzenle",
      subtitlePrefix: "için detayları güncelleyin:",
      saveButton: "Değişiklikleri Kaydet",
    },

    roles: {
      Admin: "Yönetici",
      Country_Chief: "Ülke Sorumlusu",
      Engineer: "Mühendis",
      Analyst: "Analist",
      Runner: "Saha Personeli",
    },

    firmware: {
      title: "Yazılım",
      introText: "Bu bölüm, yazılım güncellemelerini yönettiğiniz yerdir.",
      instructionText: "Cihazlara yeni yazılımları buradan dağıtabilirsiniz.",
      futureFeatures:
        "Yakında: Mevcut yazılım sürümlerini görüntüleme ve yeni sürümleri dağıtma özellikleri eklenecektir.",
    },

    profile: {
      // Profil Detayları Sayfası
      detailsTitle: "Profil Detayları",
      profilePictureLabel: "Profil Resmi",
      nameLabel: "Ad",
      surnameLabel: "Soyad",
      emailLabel: "E-posta",
      changePasswordTitle: "Şifreyi Değiştir",
      changePasswordSubtitle: "Mevcut şifreyi korumak için boş bırakın",
      newPasswordLabel: "Yeni Şifre",
      repeatPasswordLabel: "Yeni Şifre Tekrar",
      saveButton: "Değişiklikleri Kaydet",
      updateSuccess: "Profil bilgileri başarıyla güncellendi!",
      // Header Açılır Menü
      logOut: "Çıkış Yap",
      avatarAlt: "Profil",
      // Hatalar
      passwordMismatchError: "Şifreler uyuşmuyor.",
      passwordLengthError: "Şifre en az 6 karakter olmalıdır.",
      nameRequired: "Ad alanı zorunludur.",
      surnameRequired: "Soyad alanı zorunludur.",
      emailRequired: "E-posta alanı zorunludur.",
      invalidEmail: "Lütfen geçerli bir e-posta adresi girin.",
      profilePictureSizeError: "Profil resmi 15MB'den küçük olmalıdır.",
      profilePictureTypeError: "Lütfen geçerli bir resim dosyası seçin.",
      updateError: "Güncelleme sırasında bir hata oluştu.",
      updateInvalidDataError:
        "Gönderilen veriler geçersiz. Lütfen tüm alanları kontrol edin.",
      sessionExpiredError:
        "Oturumunuzun süresi doldu. Lütfen tekrar giriş yapın.",
      permissionError: "Bu işlem için yetkiniz bulunmamaktadır.",
    },

    footer: {
      rights: "Tüm Hakları Saklıdır.",
      address: "Örnek Mah. No: 123, Örnek Şehir, Ülke.",
      email: "E-posta:",
      phone: "Telefon:",
      privacy: "Gizlilik Politikası",
      terms: "Kullanım Koşulları",
    },

    login: {
      title: "Giriş Yap",
      mailLabel: "E-posta",
      passwordLabel: "Şifre",
      rememberMe: "Beni Hatırla",
      loginButton: "Giriş Yap",
      loginError: "Geçersiz e-posta veya şifre.",
    },

    accessDenied: {
      title: "Erişim Engellendi",
      message: "Bu bölüme erişim yetkiniz bulunmamaktadır.",
      goBackButton: "Geri Dön",
    },

    notFound: {
      title: "404 - Sayfa Bulunamadı",
      message: "Aradığınız sayfa mevcut değil veya taşınmış.",
      backToHomeButton: "Anasayfaya Git",
    },
  },

  pl: {
    languages: {
      en: "Angielski",
      az: "Azerbejdżański",
      tr: "Turecki",
      pl: "Polski",
      ru: "Rosyjski",
    },
    languagesShort: {
      en: "EN",
      tr: "TR",
      az: "AZ",
      pl: "PL",
      ru: "RU",
    },
    // =================================================================
    // Ogólnego przeznaczenia i wspólne komponenty
    // =================================================================
    common: {
      cancel: "Anuluj",
      saving: "Zapisywanie...",
      notAvailable: "N/D",
      genericError: "Wystąpił nieoczekiwany błąd. Proszę spróbować ponownie.",
      couldNotLoadData: "Nie można załadować danych.",
      updatingText: "Aktualizowanie...",
      actionsLabel: "Akcje",
      genericUser: "Użytkownik",
      selectOption: "Wybierz opcję",
      typeToSearch: "Wpisz, aby wyszukać...",
      nothingFound: "Nic nie znaleziono.",
      searchPlaceholder: "Szukaj...",
    },

    // =================================================================
    // Systemy ogólnosystemowe (Menu, Ładowanie, Dialogi, itp.)
    // =================================================================
    menu: {
      dashboard: "Panel główny",
      stores: "Sklepy i Oddziały",
      newInstallation: "Nowa instalacja",
      firmware: "Oprogramowanie",
      users: "Użytkownicy i Role",
    },

    loader: {
      loadingTitle: "Ładowanie...",
    },

    dialogs: {
      // Ogólne dialogi
      confirmTitle: "Potwierdź akcję",
      deleteConfirmationPrompt: "Aby potwierdzić, wpisz:",
      yesButton: "Tak",
      noButton: "Nie",
      okButton: "OK",
      // Specyficzne monity
      unsavedChangesPrompt:
        "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?",
      // Błędy Bluetooth
      btNotConnected: "Nie połączono z żadnym urządzeniem.",
      btConfigFailed: "Nie udało się wysłać konfiguracji do urządzenia.",
    },

    // =================================================================
    // Tłumaczenia specyficzne для stron i funkcji
    // =================================================================
    dashboard: {
      title: "Panel główny",
      welcomeMessage: "Witaj!",
      instructionText:
        "Ten obszar będzie podsumowywał ogólny stan Twojego systemu...",
    },

    stores: {
      // Ogólne
      title: "Sklepy i Oddziały",
      loading: "Ładowanie sklepów...",
      noStoresFound: "Nie znaleziono sklepów.",
      fetchError: "Wystąpił błąd podczas ładowania sklepów.",
      couldNotLoadStoreData: "Nie można załadować danych sklepu.",
      storeNotFound: "Sklep nie został znaleziony.",
      // Tytuły i opisy stron
      createStoreTitle: "Utwórz nowy sklep",
      createStoreDesc: "Dodaj nowy sklep lub oddział do systemu.",
      editStoreTitle: "Edytuj informacje o sklepie",
      editStoreDesc:
        "Zaktualizuj szczegóły istniejących sklepów lub oddziałów.",
      deleteStoreTitle: "Usuń sklep",
      deleteStoreDesc: "Usuń sklep lub oddział z systemu.",
      viewLogsTitle: "Wyświetl logi",
      viewLogsDesc: "Uzyskaj dostęp do logów związanych z operacjami sklepu.",
      logDetailsTitle: "Szczegóły logu",
      backToLogsList: "Powrót do listy logów",
      serverLogsTitle: "Logi serwera",
      serverLogsDesc: "Wyświetl szczegółową aktywność i status serwera.",
      esp32LogsTitle: "Logi ESP32",
      esp32LogsDesc: "Wyświetl szczegółowe logi z podłączonych urządzeń ESP32.",
      // Formularze i pola
      storeNameLabel: "Nazwa sklepu",
      countryLabel: "Kraj",
      cityLabel: "Miasto",
      addBranchLabel: "Dodaj oddział",
      branchNameLabel: "Nazwa oddziału",
      storeBranchAddressLabel: "Adres sklepu/oddziału",
      allDayOpenLabel: "Czynne całą dobę (24/7)",
      openingHourLabel: "Godzina otwarcia",
      closingHourLabel: "Godzina zamknięcia",
      selectHour: "Wybierz godzinę",
      ownerNameLabel: "Imię właściciela",
      ownerSurnameLabel: "Nazwisko właściciela",
      installerNameLabel: "Imię instalatora",
      serverIpLabel: "Adres IP serwera",
      requiredFieldWarning: "To pole jest wymagane.",
      // Nagłówki tabel
      nameHeader: "Nazwa sklepu",
      location: "Lokalizacja",
      installer: "Instalator",
      devices: "Urządzenia",
      // Przyciski i akcje
      nextButton: "Dalej",
      previousButton: "Wstecz",
      saveButton: "Zapisz",
      saveChangesButton: "Zapisz wszystkie zmiany",
      editButton: "Edytuj",
      deleteButton: "Usuń",
      viewLogsButton: "Wyświetl logi",
      addNewDeviceButton: "Dodaj nowe urządzenie",
      // Dialogi
      confirmDeleteTitle: "Potwierdź usunięcie",
      confirmDeleteMessage: "Czy na pewno chcesz usunąć",
      deleteProcessError: "Wystąpił błąd podczas procesu usuwania.",
      // Strona logów serwera
      serverSoftwareVersion: "Wersja oprogramowania",
      lastUpdateDate: "Data ostatniej aktualizacji",
      connectedEsp32Count: "Liczba podłączonych ESP32",
      serverToken: "Token serwera",
      registeredByName: "Zarejestrowane przez",
      backToStoreLogDetails: "Powrót do szczegółów logu",
    },

    "stores.filterControls": {
      country: "Kraj",
      allCountries: "Wszystkie kraje",
      city: "Miasto",
      allCities: "Wszystkie miasta",
      resetButton: "Resetuj filtry",
    },

    "stores.deleteStore": {
      pageTitle: "Usuń sklep",
      pageDescription: "Wybierz sklep, aby trwale usunąć go z systemu.",
    },

    "stores.editStore": {
      pageTitle: "Edytuj szczegóły sklepu",
      pageDescription: "Wybierz sklep, aby edytować jego szczegóły.",
      workflowTitle: "Edytuj sklep",
      step1Title: "Informacje o sklepie",
      step2Title: "Zarządzanie urządzeniami",
      successTitle: "Sukces",
      storeUpdateSuccessMessage: "Szczegóły sklepu zaktualizowane pomyślnie.",
      updateFailedTitle: "Aktualizacja nie powiodła się",
    },

    "stores.installationWizard": {
      title: "Instalacja nowego sklepu",
      description:
        "Postępuj zgodnie z krokami, aby zarejestrować nowy sklep i jego urządzenia.",
      // Tytuły kroków
      step1Title: "Utwórz sklep",
      step2Title: "Token serwera",
      step3Title: "Token ESP32",
      step4Title: "Konfiguracja urządzenia",
      step5Title: "Zakończ",
      // Teksty specyficzne dla kroków
      step2Description:
        "Wygeneruj unikalny token dla serwera sklepu, aby mógł się połączyć.",
      step3Description:
        "Wygeneruj wspólny token dla wszystkich urządzeń ESP32 w tym sklepie.",
      step5Description:
        "Ostateczny status Twoich urządzeń jest pokazany poniżej. Przejrzyj i zakończ instalację.",
      // Formularz urządzenia
      installedDevicesTitle: "Zainstalowane urządzenia",
      editDeviceTitle: "Edytuj urządzenie",
      newDeviceTitle: "Instalacja nowego urządzenia",
      noDevicesYet: "Nie dodano jeszcze żadnych urządzeń.",
      idLabel: "ID",
      tokenLabel: "Token ESP32",
      allDayWorkLabel: "Praca całodobowa",
      awakeTimeLabel: "Czas wybudzenia",
      sleepTimeLabel: "Czas uśpienia",
      screenSizeLabel: "Rozmiar ekranu",
      selectScreenSize: "Wybierz...",
      wifiSsidLabel: "SSID WIFI",
      wifiPasswordLabel: "Hasło WIFI",
      fontSettingsLabel: "Ustawienia czcionki",
      productNameFontSizeLabel: "Nazwa produktu",
      productPriceFontSizeBeforeDiscountLabel: "Cena (przed)",
      productPriceFontSizeAfterDiscountLabel: "Cena (po)",
      productBarcodeFontSizeLabel: "Kod kreskowy",
      productBarcodeNumbersFontSizeLabel: "Numery kodu kreskowego",
      noSsid: "Brak SSID",
      allDay: "Cały dzień",
      // Tokeny i połączenie
      generateTokenButton: "Generuj token",
      generating: "Generowanie...",
      tokenPlaceholder: "Token pojawi się tutaj...",
      step3TokenPlaceholder: "Kliknij 'Generuj', aby utworzyć token...",
      copyToClipboardButton: "Kopiuj do schowka",
      copiedMessage: "Skopiowano!",
      checkConnectionButton: "Sprawdź połączenie",
      checking: "Sprawdzanie...",
      connectionSuccess: "Połączenie udane!",
      connectionError: "Połączenie nieudane:",
      // Błędy i ostrzeżenia
      storeIdNotFoundError:
        "Nie znaleziono ID sklepu. Proszę wrócić do kroku 1.",
      tokenGenerationError: "Nie udało się wygenerować tokenu.",
      generateTokenFirst: "Proszę najpierw wygenerować token.",
      cannotProceedTitle: "Nie można kontynuować",
      checkConnectionFirst:
        "Proszę nacisnąć 'Sprawdź połączenie' i upewnić się, że jest udane.",
      idRequired: "ID jest wymagane.",
      idMustBePositive: "ID musi być dodatnią liczbą całkowitą.",
      idInUse: "To ID jest już w użyciu.",
      screenSizeRequired: "Rozmiar ekranu jest wymagany.",
      wifiSsidRequired: "SSID WIFI jest wymagane.",
      wifiPasswordRequired: "Hasło WIFI jest wymagane.",
      passwordRequiredForNew: "Hasło jest wymagane dla nowych urządzeń.",
      awakeTimeRequired: "Czas wybudzenia jest wymagany.",
      sleepTimeRequired: "Czas uśpienia jest wymagany.",
      unsavedChangesTitle: "Niezapisane zmiany",
      unsavedChangesMessage:
        "Proszę zapisać lub anulować otwarty formularz urządzenia.",
      validationErrorTitle: "Błąd walidacji",
      validationErrorMessage:
        "Wymagany jest prawidłowy adres IP serwera, aby kontynuować.",
      warningTitle: "Ostrzeżenie",
      noDevicesWarning:
        "Proszę dodać co najmniej jedno urządzenie, aby kontynuować.",
      exitConfirmation:
        "Instalacja jest w toku. Czy na pewno chcesz opuścić tę stronę? Twój postęp zostanie utracony.",
      beforeUnloadPrompt:
        "Masz niezapisane zmiany. Czy na pewno chcesz opuścić stronę?",
      // Ostatni krok
      loadingStatus: "Ładowanie ostatecznego statusu...",
      installingText: "Instalowanie...",
      completeInstallationButton: "Zakończ instalację",
      installationErrorTitle: "Błąd instalacji",
      installationTimeoutError:
        "Upłynął limit czasu żądania instalacji. Proszę spróbować ponownie.",
      deleteDeviceTooltip: "Usuń urządzenie",

      installationSuccessTitle: "Instalacja Zakończona Pomyślnie",
      installationSuccessMessage:
        "Instalacja została pomyślnie zakończona! Przekierowywanie do panelu głównego...",
      installationFailedMessage:
        "Nie udało się ukończyć instalacji. Proszę spróbować ponownie.",
      installationTimeoutMessage:
        "Przekroczono limit czasu żądania instalacji. Proszę spróbować ponownie.",

      // PL: Tłumaczenia dla logów w Kroku 5
      error: "Błąd",
      errorValidation: "Błąd walidacji",
      logSourceServer: "Serwer sklepu",
      logSourceDevices: "Urządzenia",
      logStatusOnline: "Online",
      logStatusReady: "Gotowe",
      logStatusNotFound: "Nie znaleziono",
      logDetailHeartbeat: "Odebrano sygnał Heartbeat",
      logDetailLastSeen: "Ostatnio widziano",
      logDetailYes: "Tak",
      logDetailBattery: "Stan baterii",
      logDetailRefreshRate: "Częstotliwość odświeżania ekranu",
      logDetailLastSync: "Ostatnia synchronizacja",
      logDetailInfo: "Informacja",
      logDevicePrefix: "ID urządzenia:",
      logNoDevices: "W Kroku 4 nie dodano żadnych urządzeń.",
      logRefreshRateValue: "15 minut",
    },

    "stores.esp32LogFilters": {
      filterTitle: "Filtry",
      date: "Data",
      selectDate: "Wybierz datę...",
      logTime: "Godzina logu",
      allTimes: "Wszystkie godziny",
      opening: "Otwarcie (06-10)",
      midDay: "Południe (11-15)",
      closing: "Zamknięcie (17+)",
      noDataSuffix: " - Brak danych",
      batteryLevel: "Poziom baterii",
      allBatteries: "Wszystkie baterie",
      highBattery: "Wysoki (>50%)",
      mediumBattery: "Średni (20-50%)",
      lowBattery: "Niski (<20%)",
      softwareVersion: "Wersja oprogramowania",
      allVersions: "Wszystkie wersje",
      filterInfo:
        "Wyświetlane są logi z ostatnich 30 dni. Wyłączone opcje nie mają danych dla wybranej daty.",
      resetFilters: "Resetuj filtry",
    },

    "stores.esp32LogTable": {
      title: "Logi ESP32 -",
      headerTimestamp: "Znacznik czasu",
      headerDeviceId: "ID urządzenia",
      headerStore: "Sklep",
      headerBranch: "Oddział",
      headerBattery: "Bateria",
      headerRefresh: "Odświeżanie (ms)",
      headerMosfet: "Mosfet",
      headerVersion: "Wersja",
      headerLogType: "Typ logu",
      noLogsFoundTitle: "Nie znaleziono logów",
      noLogsFoundMessage:
        "Brak logów pasujących do bieżących kryteriów filtrowania.",
    },

    users: {
      // Ogólne
      usersRolesTitle: "Użytkownicy i Role",
      // Tytuły i opisy stron
      userForSupermarketTitle: "Użytkownicy supermarketu",
      userForSupermarketDesc:
        "Zarządzaj użytkownikami powiązanymi z oddziałami supermarketu.",
      userForCompanyTitle: "Użytkownicy firmy",
      userForCompanyDesc: "Zarządzaj użytkownikami powiązanymi z główną firmą.",
      // Nagłówki tabel
      fullNameHeader: "Imię i nazwisko",
      roleHeader: "Rola",
      countryHeader: "Kraj",
      cityHeader: "Miasto",
      assignedStoreHeader: "Przypisany sklep",
      // Status i komunikaty o błędach
      noUsersFound: "Nie znaleziono użytkowników.",
      userLoadError:
        "Nie można załadować danych użytkownika. Użytkownik może nie istnieć.",
      usersLoadError:
        "Nie udało się załadować użytkowników. Spróbuj ponownie później.",
      userDeleteError: "Wystąpił błąd podczas usuwania użytkownika.",
      userOrStoreLoadError:
        "Nie można załadować danych użytkownika lub sklepów.",
      // Dialogi
      confirmDeleteTitle: "Potwierdź usunięcie użytkownika",
      confirmDeleteMessage: "Czy na pewno chcesz usunąć",
      // Różne
      profilePreviewAlt: "Podgląd profilu",
      userAvatarAlt: "Awatar dla {userName}",
    },

    "users.companyUsersPage": {
      title: "Użytkownicy firmy",
      subtitle: "Zarządzaj administratorami, szefami krajów i inżynierami",
      addUser: "Dodaj użytkownika",
    },

    "users.supermarketUsersPage": {
      title: "Użytkownicy supermarketu",
      subtitle:
        "Zarządzaj użytkownikami przypisanymi do konkretnych oddziałów supermarketu",
      addUser: "Dodaj użytkownika",
    },

    "users.addUserForm": {
      title: "Dodaj nowego użytkownika firmy",
      subtitle: "Wypełnij szczegóły, aby utworzyć nowe konto użytkownika.",
      nameLabel: "Imię",
      surnameLabel: "Nazwisko",
      emailLabel: "Email",
      passwordLabel: "Hasło",
      repeatPasswordLabel: "Powtórz hasło",
      roleLabel: "Rola",
      selectRole: "Wybierz rolę",
      countryLabel: "Kraj",
      cityLabel: "Miasto",
      saveButton: "Zapisz użytkownika",
      profilePictureLabel: "Zdjęcie profilowe",
      passwordMismatchError: "Hasła nie pasują do siebie.",
      roleRequiredError: "Proszę wybrać rolę dla użytkownika.",
    },

    "users.addSupermarketUserForm": {
      title: "Dodaj nowego użytkownika supermarketu",
      subtitle: "Utwórz nowego użytkownika przypisanego do sklepu",
      fetchStoresError: "Nie udało się załadować sklepów.",
      storeRequiredError: "Proszę przypisać sklep do użytkownika.",
      assignStoreLabel: "Przypisz do sklepu",
      selectStore: "Wybierz sklep",
    },

    "users.editUserForm": {
      title: "Edytuj użytkownika",
      titleSupermarket: "Edytuj użytkownika supermarketu",
      subtitlePrefix: "Zaktualizuj szczegóły dla",
      saveButton: "Zapisz zmiany",
    },

    roles: {
      Admin: "Administrator",
      Country_Chief: "Szef kraju",
      Engineer: "Inżynier",
      Analyst: "Analityk",
      Runner: "Pracownik terenowy",
    },

    firmware: {
      title: "Oprogramowanie",
      introText: "W tej sekcji zarządzasz aktualizacjami oprogramowania.",
      instructionText:
        "Możesz stąd dystrybuować nowe oprogramowanie do urządzeń.",
      futureFeatures:
        "Wkrótce: Zostaną dodane funkcje do przeglądania obecnych wersji oprogramowania i dystrybucji nowych.",
    },

    profile: {
      // Strona szczegółów profilu
      detailsTitle: "Szczegóły profilu",
      profilePictureLabel: "Zdjęcie profilowe",
      nameLabel: "Imię",
      surnameLabel: "Nazwisko",
      emailLabel: "Email",
      changePasswordTitle: "Zmień hasło",
      changePasswordSubtitle: "Pozostaw puste, aby zachować obecne hasło",
      newPasswordLabel: "Nowe hasło",
      repeatPasswordLabel: "Powtórz nowe hasło",
      saveButton: "Zapisz zmiany",
      updateSuccess: "Informacje profilowe zaktualizowane pomyślnie!",
      // Menu rozwijane w nagłówku
      logOut: "Wyloguj się",
      avatarAlt: "Profil",
      // Błędy
      passwordMismatchError: "Hasła nie pasują do siebie.",
      passwordLengthError: "Hasło musi mieć co najmniej 6 znaków.",
      nameRequired: "Pole imię jest wymagane.",
      surnameRequired: "Pole nazwisko jest wymagane.",
      emailRequired: "Pole email jest wymagane.",
      invalidEmail: "Proszę podać prawidłowy adres email.",
      profilePictureSizeError: "Zdjęcie profilowe musi być mniejsze niż 15MB.",
      profilePictureTypeError: "Proszę wybrać prawidłowy plik obrazu.",
      updateError: "Wystąpił błąd podczas aktualizacji.",
      updateInvalidDataError:
        "Przesłane dane są nieprawidłowe. Proszę sprawdzić wszystkie pola.",
      sessionExpiredError:
        "Twoja sesja wygasła. Proszę zalogować się ponownie.",
      permissionError: "Nie masz uprawnień do tej akcji.",
    },

    footer: {
      rights: "Wszelkie prawa zastrzeżone.",
      address: "Przykładowa ul. Nr 123, Przykładowe Miasto, Kraj.",
      email: "Email:",
      phone: "Telefon:",
      privacy: "Polityka prywatności",
      terms: "Warunki użytkowania",
    },

    login: {
      title: "Logowanie",
      mailLabel: "Email",
      passwordLabel: "Hasło",
      rememberMe: "Zapamiętaj mnie",
      loginButton: "Zaloguj się",
      loginError: "Nieprawidłowy email lub hasło.",
    },

    accessDenied: {
      title: "Dostęp zabroniony",
      message: "Nie masz uprawnień do dostępu do tej sekcji.",
      goBackButton: "Wróć",
    },

    notFound: {
      title: "404 - Strona nie została znaleziona",
      message: "Strona, której szukasz, nie istnieje lub została przeniesiona.",
      backToHomeButton: "Przejdź do strony głównej",
    },
  },

  ru: {
    languages: {
      en: "Английский",
      az: "Азербайджанский",
      tr: "Турецкий",
      pl: "Польский",
      ru: "Русский",
    },
    languagesShort: {
      en: "EN",
      az: "AZ",
      tr: "TR",
      pl: "PL",
      ru: "RU",
    },
    // =================================================================
    // Общего назначения и общие компоненты
    // =================================================================
    common: {
      cancel: "Отмена",
      saving: "Сохранение...",
      notAvailable: "Н/Д",
      genericError:
        "Произошла непредвиденная ошибка. Пожалуйста, попробуйте снова.",
      couldNotLoadData: "Не удалось загрузить данные.",
      updatingText: "Обновление...",
      actionsLabel: "Действия",
      genericUser: "Пользователь",
      selectOption: "Выберите вариант",
      typeToSearch: "Введите для поиска...",
      nothingFound: "Ничего не найдено.",
      searchPlaceholder: "Поиск...",
    },

    // =================================================================
    // Системные компоненты (Меню, Загрузчик, Диалоги и т.д.)
    // =================================================================
    menu: {
      dashboard: "Панель управления",
      stores: "Магазины и филиалы",
      newInstallation: "Новая установка",
      firmware: "Прошивка",
      users: "Пользователи и роли",
    },

    loader: {
      loadingTitle: "Загрузка...",
    },

    dialogs: {
      // Общие диалоги
      confirmTitle: "Подтвердите действие",
      deleteConfirmationPrompt: "Для подтверждения, пожалуйста, введите:",
      yesButton: "Да",
      noButton: "Нет",
      okButton: "ОК",
      // Специфические запросы
      unsavedChangesPrompt:
        "У вас есть несохраненные изменения. Вы уверены, что хотите уйти?",
      // Ошибки Bluetooth
      btNotConnected: "Нет подключения к устройству.",
      btConfigFailed: "Не удалось отправить конфигурацию на устройство.",
    },

    // =================================================================
    // Переводы для конкретных страниц и функций
    // =================================================================
    dashboard: {
      title: "Панель управления",
      welcomeMessage: "Добро пожаловать!",
      instructionText:
        "Здесь будет отображаться общая информация о состоянии вашей системы...",
    },

    stores: {
      // Общее
      title: "Магазины и филиалы",
      loading: "Загрузка магазинов...",
      noStoresFound: "Магазины не найдены.",
      fetchError: "Произошла ошибка при загрузке магазинов.",
      couldNotLoadStoreData: "Не удалось загрузить данные магазина.",
      storeNotFound: "Магазин не найден.",
      // Заголовки и описания страниц
      createStoreTitle: "Создать новый магазин",
      createStoreDesc: "Добавьте новый магазин или филиал в систему.",
      editStoreTitle: "Редактировать информацию о магазине",
      editStoreDesc: "Обновите детали существующих магазинов или филиалов.",
      deleteStoreTitle: "Удалить магазин",
      deleteStoreDesc: "Удалите магазин или филиал из системы.",
      viewLogsTitle: "Просмотр логов",
      viewLogsDesc: "Доступ к логам, связанным с операциями магазина.",
      logDetailsTitle: "Детали лога",
      backToLogsList: "Назад к списку логов",
      serverLogsTitle: "Логи сервера",
      serverLogsDesc: "Просмотр детальной активности и статуса сервера.",
      esp32LogsTitle: "Логи ESP32",
      esp32LogsDesc: "Просмотр детальных логов с подключенных устройств ESP32.",
      // Формы и поля
      storeNameLabel: "Название магазина",
      countryLabel: "Страна",
      cityLabel: "Город",
      addBranchLabel: "Добавить филиал",
      branchNameLabel: "Название филиала",
      storeBranchAddressLabel: "Адрес магазина/филиала",
      allDayOpenLabel: "Открыто круглосуточно (24/7)",
      openingHourLabel: "Час открытия",
      closingHourLabel: "Час закрытия",
      selectHour: "Выберите час",
      ownerNameLabel: "Имя владельца",
      ownerSurnameLabel: "Фамилия владельца",
      installerNameLabel: "Имя установщика",
      serverIpLabel: "IP-адрес сервера",
      requiredFieldWarning: "Это поле обязательно для заполнения.",
      // Заголовки таблиц
      nameHeader: "Название магазина",
      location: "Местоположение",
      installer: "Установщик",
      devices: "Устройства",
      // Кнопки и действия
      nextButton: "Далее",
      previousButton: "Назад",
      saveButton: "Сохранить",
      saveChangesButton: "Сохранить все изменения",
      editButton: "Редактировать",
      deleteButton: "Удалить",
      viewLogsButton: "Просмотр логов",
      addNewDeviceButton: "Добавить новое устройство",
      // Диалоги
      confirmDeleteTitle: "Подтвердите удаление",
      confirmDeleteMessage: "Вы уверены, что хотите удалить",
      deleteProcessError: "Произошла ошибка в процессе удаления.",
      // Страница логов сервера
      serverSoftwareVersion: "Версия ПО",
      lastUpdateDate: "Дата последнего обновления",
      connectedEsp32Count: "Количество подключенных ESP32",
      serverToken: "Токен сервера",
      registeredByName: "Зарегистрировано",
      backToStoreLogDetails: "Назад к деталям лога",
    },

    "stores.filterControls": {
      country: "Страна",
      allCountries: "Все страны",
      city: "Город",
      allCities: "Все города",
      resetButton: "Сбросить фильтры",
    },

    "stores.deleteStore": {
      pageTitle: "Удалить магазин",
      pageDescription:
        "Выберите магазин, чтобы навсегда удалить его из системы.",
    },

    "stores.editStore": {
      pageTitle: "Редактировать детали магазина",
      pageDescription: "Выберите магазин, чтобы отредактировать его детали.",
      workflowTitle: "Редактировать магазин",
      step1Title: "Информация о магазине",
      step2Title: "Управление устройствами",
      successTitle: "Успех",
      storeUpdateSuccessMessage: "Детали магазина успешно обновлены.",
      updateFailedTitle: "Ошибка обновления",
    },

    "stores.installationWizard": {
      title: "Установка нового магазина",
      description:
        "Следуйте шагам, чтобы зарегистрировать новый магазин и его устройства.",
      // Заголовки шагов
      step1Title: "Создать магазин",
      step2Title: "Токен сервера",
      step3Title: "Токен ESP32",
      step4Title: "Настройка устройства",
      step5Title: "Завершение",
      // Тексты для шагов
      step2Description:
        "Создайте уникальный токен для подключения сервера магазина.",
      step3Description:
        "Создайте общий токен для всех устройств ESP32 в этом магазине.",
      step5Description:
        "Ниже показан окончательный статус ваших устройств. Проверьте и завершите установку.",
      // Форма устройства
      installedDevicesTitle: "Установленные устройства",
      editDeviceTitle: "Редактировать устройство",
      newDeviceTitle: "Установка нового устройства",
      noDevicesYet: "Устройства еще не добавлены.",
      idLabel: "ID",
      tokenLabel: "Токен ESP32",
      allDayWorkLabel: "Круглосуточная работа",
      awakeTimeLabel: "Время пробуждения",
      sleepTimeLabel: "Время сна",
      screenSizeLabel: "Размер экрана",
      selectScreenSize: "Выберите...",
      wifiSsidLabel: "WIFI SSID",
      wifiPasswordLabel: "Пароль WIFI",
      fontSettingsLabel: "Настройки шрифта",
      productNameFontSizeLabel: "Название продукта",
      productPriceFontSizeBeforeDiscountLabel: "Цена (до)",
      productPriceFontSizeAfterDiscountLabel: "Цена (после)",
      productBarcodeFontSizeLabel: "Штрих-код",
      productBarcodeNumbersFontSizeLabel: "Цифры штрих-кода",
      noSsid: "Нет SSID",
      allDay: "Весь день",
      // Токены и подключение
      generateTokenButton: "Сгенерировать токен",
      generating: "Генерация...",
      tokenPlaceholder: "Токен появится здесь...",
      step3TokenPlaceholder: "Нажмите 'Сгенерировать', чтобы создать токен...",
      copyToClipboardButton: "Копировать в буфер обмена",
      copiedMessage: "Скопировано!",
      checkConnectionButton: "Проверить соединение",
      checking: "Проверка...",
      connectionSuccess: "Соединение успешно!",
      connectionError: "Ошибка соединения:",
      // Ошибки и предупреждения
      storeIdNotFoundError:
        "ID магазина не найден. Пожалуйста, вернитесь к Шагу 1.",
      tokenGenerationError: "Не удалось сгенерировать токен.",
      generateTokenFirst: "Пожалуйста, сначала сгенерируйте токен.",
      cannotProceedTitle: "Невозможно продолжить",
      checkConnectionFirst:
        "Пожалуйста, нажмите 'Проверить соединение' и убедитесь в его успешности.",
      idRequired: "Требуется ID.",
      idMustBePositive: "ID должен быть положительным целым числом.",
      idInUse: "Этот ID уже используется.",
      screenSizeRequired: "Требуется размер экрана.",
      wifiSsidRequired: "Требуется WIFI SSID.",
      wifiPasswordRequired: "Требуется пароль WIFI.",
      passwordRequiredForNew: "Пароль обязателен для новых устройств.",
      awakeTimeRequired: "Требуется время пробуждения.",
      sleepTimeRequired: "Требуется время сна.",
      unsavedChangesTitle: "Несохраненные изменения",
      unsavedChangesMessage:
        "Пожалуйста, сохраните или отмените открытую форму устройства.",
      validationErrorTitle: "Ошибка валидации",
      validationErrorMessage:
        "Для продолжения требуется действительный IP-адрес сервера.",
      warningTitle: "Предупреждение",
      noDevicesWarning:
        "Пожалуйста, добавьте хотя бы одно устройство, чтобы продолжить.",
      exitConfirmation:
        "Идет установка. Вы уверены, что хотите покинуть эту страницу? Ваш прогресс будет потерян.",
      beforeUnloadPrompt:
        "У вас есть несохраненные изменения. Вы уверены, что хотите уйти?",
      // Последний шаг
      loadingStatus: "Загрузка финального статуса...",
      installingText: "Установка...",
      completeInstallationButton: "Завершить установку",
      installationErrorTitle: "Ошибка установки",
      installationTimeoutError:
        "Время ожидания запроса на установку истекло. Пожалуйста, попробуйте снова.",
      deleteDeviceTooltip: "Удалить устройство",

      installationSuccessTitle: "Установка прошла успешно",
      installationSuccessMessage:
        "Установка успешно завершена! Перенаправление на панель управления...",
      installationFailedMessage:
        "Не удалось завершить установку. Пожалуйста, попробуйте снова.",
      installationTimeoutMessage:
        "Время ожидания запроса на установку истекло. Пожалуйста, попробуйте снова.",

      // Новое: Переводы для логов Шага 5
      error: "Ошибка",
      errorValidation: "Ошибка валидации",
      logSourceServer: "Сервер магазина",
      logSourceDevices: "Устройства",
      logStatusOnline: "В сети",
      logStatusReady: "Готово",
      logStatusNotFound: "Не найдено",
      logDetailHeartbeat: "Получен сигнал Heartbeat",
      logDetailLastSeen: "Последний раз в сети",
      logDetailYes: "Да",
      logDetailBattery: "Состояние батареи",
      logDetailRefreshRate: "Частота обновления экрана",
      logDetailLastSync: "Последняя синхронизация",
      logDetailInfo: "Информация",
      logDevicePrefix: "ID устройства:",
      logNoDevices: "На Шаге 4 не было добавлено ни одного устройства.",
      logRefreshRateValue: "15 минут",
    },

    "stores.esp32LogFilters": {
      filterTitle: "Фильтры",
      date: "Дата",
      selectDate: "Выберите дату...",
      logTime: "Время лога",
      allTimes: "Все время",
      opening: "Утро (06-10)",
      midDay: "День (11-15)",
      closing: "Вечер (17+)",
      noDataSuffix: " - Нет данных",
      batteryLevel: "Уровень заряда",
      allBatteries: "Все батареи",
      highBattery: "Высокий (>50%)",
      mediumBattery: "Средний (20-50%)",
      lowBattery: "Низкий (<20%)",
      softwareVersion: "Версия ПО",
      allVersions: "Все версии",
      filterInfo:
        "Отображаются логи за последние 30 дней. Отключенные опции не имеют данных для выбранной даты.",
      resetFilters: "Сбросить фильтры",
    },

    "stores.esp32LogTable": {
      title: "Логи ESP32 -", // Добавляется название магазина
      headerTimestamp: "Временная метка",
      headerDeviceId: "ID устройства",
      headerStore: "Магазин",
      headerBranch: "Филиал",
      headerBattery: "Батарея",
      headerRefresh: "Обновление (мс)",
      headerMosfet: "Mosfet",
      headerVersion: "Версия",
      headerLogType: "Тип лога",
      noLogsFoundTitle: "Логи не найдены",
      noLogsFoundMessage:
        "Нет логов, соответствующих вашим текущим критериям фильтрации.",
    },

    users: {
      // Общее
      usersRolesTitle: "Пользователи и роли",
      // Заголовки и описания страниц
      userForSupermarketTitle: "Пользователи супермаркета",
      userForSupermarketDesc:
        "Управление пользователями, связанными с филиалами супермаркета.",
      userForCompanyTitle: "Пользователи компании",
      userForCompanyDesc:
        "Управление пользователями, связанными с основной компанией.",
      // Заголовки таблиц
      fullNameHeader: "Полное имя",
      roleHeader: "Роль",
      countryHeader: "Страна",
      cityHeader: "Город",
      assignedStoreHeader: "Приписанный магазин",
      // Статус и сообщения об ошибках
      noUsersFound: "Пользователи не найдены.",
      userLoadError:
        "Не удалось загрузить данные пользователя. Пользователь может не существовать.",
      usersLoadError:
        "Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.",
      userDeleteError: "Произошла ошибка при удалении пользователя.",
      userOrStoreLoadError:
        "Не удалось загрузить данные пользователя или магазинов.",
      // Диалоги
      confirmDeleteTitle: "Подтвердите удаление пользователя",
      confirmDeleteMessage: "Вы уверены, что хотите удалить", // Добавляется имя пользователя
      // Разное
      profilePreviewAlt: "Предпросмотр профиля",
      userAvatarAlt: "Аватар для {userName}", // {userName} - это заполнитель
    },

    "users.companyUsersPage": {
      title: "Пользователи компании",
      subtitle:
        "Управление администраторами, руководителями стран и инженерами",
      addUser: "Добавить пользователя",
    },

    "users.supermarketUsersPage": {
      title: "Пользователи супермаркета",
      subtitle:
        "Управление пользователями, назначенными на конкретные филиалы супермаркета",
      addUser: "Добавить пользователя",
    },

    "users.addUserForm": {
      title: "Добавить нового пользователя компании",
      subtitle:
        "Заполните данные для создания новой учетной записи пользователя.",
      nameLabel: "Имя",
      surnameLabel: "Фамилия",
      emailLabel: "Email",
      passwordLabel: "Пароль",
      repeatPasswordLabel: "Повторите пароль",
      roleLabel: "Роль",
      selectRole: "Выберите роль",
      countryLabel: "Страна",
      cityLabel: "Город",
      saveButton: "Сохранить пользователя",
      profilePictureLabel: "Фото профиля",
      passwordMismatchError: "Пароли не совпадают.",
      roleRequiredError: "Пожалуйста, выберите роль для пользователя.",
    },

    "users.addSupermarketUserForm": {
      title: "Добавить нового пользователя супермаркета",
      subtitle: "Создать нового пользователя, приписанного к магазину",
      fetchStoresError: "Не удалось загрузить магазины.",
      storeRequiredError: "Пожалуйста, припишите пользователя к магазину.",
      assignStoreLabel: "Приписать к магазину",
      selectStore: "Выберите магазин",
    },

    "users.editUserForm": {
      title: "Редактировать пользователя",
      titleSupermarket: "Редактировать пользователя супермаркета",
      subtitlePrefix: "Обновите данные для",
      saveButton: "Сохранить изменения",
    },

    roles: {
      Admin: "Администратор",
      Country_Chief: "Глава страны",
      Engineer: "Инженер",
      Analyst: "Аналитик",
      Runner: "Полевой сотрудник",
    },

    firmware: {
      title: "Прошивка",
      introText: "В этом разделе вы управляете обновлениями прошивки.",
      instructionText:
        "Отсюда вы можете распространять новое программное обеспечение на устройства.",
      futureFeatures:
        "Скоро: Будут добавлены функции для просмотра текущих версий прошивки и распространения новых версий.",
    },

    profile: {
      // Страница деталей профиля
      detailsTitle: "Детали профиля",
      profilePictureLabel: "Фото профиля",
      nameLabel: "Имя",
      surnameLabel: "Фамилия",
      emailLabel: "Email",
      changePasswordTitle: "Изменить пароль",
      changePasswordSubtitle: "Оставьте пустым, чтобы сохранить текущий пароль",
      newPasswordLabel: "Новый пароль",
      repeatPasswordLabel: "Повторите новый пароль",
      saveButton: "Сохранить изменения",
      updateSuccess: "Информация профиля успешно обновлена!",
      // Выпадающее меню в шапке
      logOut: "Выйти",
      avatarAlt: "Профиль",
      // Ошибки
      passwordMismatchError: "Пароли не совпадают.",
      passwordLengthError: "Пароль должен содержать не менее 6 символов.",
      nameRequired: "Поле 'Имя' обязательно для заполнения.",
      surnameRequired: "Поле 'Фамилия' обязательно для заполнения.",
      emailRequired: "Поле 'Email' обязательно для заполнения.",
      invalidEmail:
        "Пожалуйста, введите действительный адрес электронной почты.",
      profilePictureSizeError: "Фото профиля должно быть меньше 15 МБ.",
      profilePictureTypeError:
        "Пожалуйста, выберите действительный файл изображения.",
      updateError: "Произошла ошибка при обновлении.",
      updateInvalidDataError:
        "Отправленные данные неверны. Пожалуйста, проверьте все поля.",
      sessionExpiredError: "Ваша сессия истекла. Пожалуйста, войдите снова.",
      permissionError: "У вас нет прав для выполнения этого действия.",
    },

    footer: {
      rights: "Все права защищены.",
      address: "Примерная ул., д. 123, Примерный Город, Страна.",
      email: "Email:",
      phone: "Телефон:",
      privacy: "Политика конфиденциальности",
      terms: "Условия использования",
    },

    login: {
      title: "Вход",
      mailLabel: "Email",
      passwordLabel: "Пароль",
      rememberMe: "Запомнить меня",
      loginButton: "Войти",
      loginError: "Неверный email или пароль.",
    },

    accessDenied: {
      title: "Доступ запрещен",
      message: "У вас нет прав для доступа к этому разделу.",
      goBackButton: "Назад",
    },

    notFound: {
      title: "404 - Страница не найдена",
      message: "Страница, которую вы ищете, не существует или была перемещена.",
      backToHomeButton: "На главную страницу",
    },
  },
};
