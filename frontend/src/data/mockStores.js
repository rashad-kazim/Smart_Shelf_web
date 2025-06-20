// src/data/mockStores.js
// Mock data for stores and installed devices

export const mockStores = [
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
    allDayOpen: false,
    openingHour: "09:00",
    closingHour: "21:00",
    ownerName: "Alice",
    ownerSurname: "Smith",
    installerName: "Bob",
    installerSurname: "Johnson",
    addBranch: true,
    server_software_version: "1.0.5",
    last_update_date: "2025-06-10T14:30:00Z",
    num_esp32_connected: 5,
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
    allDayOpen: false,
    openingHour: "08:00",
    closingHour: "22:00",
    ownerName: "Can",
    ownerSurname: "Yilmaz",
    installerName: "Deniz",
    installerSurname: "Aslan",
    addBranch: true,
    server_software_version: "1.0.6",
    last_update_date: "2025-06-11T10:00:00Z",
    num_esp32_connected: 8,
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
    allDayOpen: false,
    openingHour: "10:00",
    closingHour: "20:00",
    ownerName: "Lena",
    ownerSurname: "Müller",
    installerName: "Max",
    installerSurname: "Schmidt",
    addBranch: true,
    server_software_version: "1.0.4",
    last_update_date: "2025-05-20T08:00:00Z",
    num_esp32_connected: 2,
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
    allDayOpen: false,
    openingHour: "07:00",
    closingHour: "23:00",
    ownerName: "Jan",
    ownerSurname: "Kowalski",
    installerName: "Piotr",
    installerSurname: "Nowak",
    addBranch: true,
    server_software_version: "1.0.7",
    last_update_date: "2025-06-12T09:45:00Z",
    num_esp32_connected: 10,
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
    allDayOpen: false,
    openingHour: "09:00",
    closingHour: "21:00",
    ownerName: "Ayşe",
    ownerSurname: "Demir",
    installerName: "Emre",
    installerSurname: "Kara",
    addBranch: true,
    server_software_version: "1.0.6",
    last_update_date: "2025-06-05T11:00:00Z",
    num_esp32_connected: 4,
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
    allDayOpen: true,
    openingHour: "00:00",
    closingHour: "00:00",
    ownerName: "Chris",
    ownerSurname: "Evans",
    installerName: "Sarah",
    installerSurname: "Connor",
    addBranch: true,
    server_software_version: "1.0.7",
    last_update_date: "2025-06-13T18:00:00Z",
    num_esp32_connected: 12,
  },
  {
    id: 7,
    name: "EilSense Old Logs",
    country: "Poland",
    city: "Krakow",
    branch: "Old Town",
    address: "Rynek Główny 1, 31-042 Kraków",
    server_token: "SRV_OLDLOGS1234567890",
    status: "active",
    created_at: "2024-01-01T09:00:00Z",
    working_hours: "09:00-17:00",
    allDayOpen: false,
    openingHour: "09:00",
    closingHour: "17:00",
    ownerName: "Old",
    ownerSurname: "Log",
    installerName: "Log",
    installerSurname: "User",
    addBranch: true,
    server_software_version: "1.0.1",
    last_update_date: "2024-12-30T23:59:59Z",
    num_esp32_connected: 1,
  },
];

export const mockInstalledDevices = [
  {
    id: 101,
    storeId: 1,
    country: "USA",
    city: "New York",
    token: "ESP-NYC-001",
    allDayWork: true,
    screenSize: "130cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 85,
    last_update_date: "2025-06-13T10:00:00Z",
  },
  {
    id: 102,
    storeId: 1,
    country: "USA",
    city: "New York",
    token: "ESP-NYC-002",
    allDayWork: false,
    awakeTime: "09:00",
    sleepTime: "17:00",
    screenSize: "80cm",
    productNameFontSize: 12,
    productPriceFontSizeBeforeDiscount: 12,
    productPriceFontSizeAfterDiscount: 12,
    productBarcodeFontSize: 12,
    productBarcodeNumbersFontSize: 12,
    dataRefreshRate: "5s",
    mosfetStatus: "Inactive",
    softwareVersion: "2.0.5",
    batteryStatus: 15,
    last_update_date: "2025-06-12T09:30:00Z",
  },
  {
    id: 103,
    storeId: 1,
    country: "USA",
    city: "New York",
    token: "ESP-NYC-003",
    allDayWork: true,
    screenSize: "110cm",
    productNameFontSize: 13,
    productPriceFontSizeBeforeDiscount: 13,
    productPriceFontSizeAfterDiscount: 13,
    productBarcodeFontSize: 13,
    productBarcodeNumbersFontSize: 13,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "8s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 75,
    last_update_date: "2025-06-11T16:00:00Z",
  },

  {
    id: 201,
    storeId: 2,
    country: "Turkey",
    city: "Istanbul",
    token: "ESP-IST-001",
    allDayWork: true,
    screenSize: "110cm",
    productNameFontSize: 16,
    productPriceFontSizeBeforeDiscount: 16,
    productPriceFontSizeAfterDiscount: 16,
    productBarcodeFontSize: 16,
    productBarcodeNumbersFontSize: 16,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "15s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.1",
    batteryStatus: 92,
    last_update_date: "2025-06-11T11:00:00Z",
  },
  {
    id: 202,
    storeId: 2,
    country: "Turkey",
    city: "Istanbul",
    token: "ESP-IST-002",
    allDayWork: false,
    awakeTime: "08:00",
    sleepTime: "22:00",
    screenSize: "130cm",
    productNameFontSize: 15,
    productPriceFontSizeBeforeDiscount: 15,
    productPriceFontSizeAfterDiscount: 15,
    productBarcodeFontSize: 15,
    productBarcodeNumbersFontSize: 15,
    dataRefreshRate: "12s",
    mosfetStatus: "Inactive",
    softwareVersion: "2.1.0",
    batteryStatus: 30,
    last_update_date: "2025-06-10T19:00:00Z",
  },
  {
    id: 203,
    storeId: 2,
    country: "Turkey",
    city: "Istanbul",
    token: "ESP-IST-003",
    allDayWork: true,
    screenSize: "80cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.1",
    batteryStatus: 60,
    last_update_date: "2025-06-09T08:00:00Z",
  },

  {
    id: 301,
    storeId: 3,
    country: "Germany",
    city: "Berlin",
    token: "ESP-BER-001",
    allDayWork: false,
    awakeTime: "10:00",
    sleepTime: "20:00",
    screenSize: "130cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.0.8",
    batteryStatus: 50,
    last_update_date: "2025-05-15T23:00:00Z",
  },
  {
    id: 302,
    storeId: 3,
    country: "Germany",
    city: "Berlin",
    token: "ESP-BER-002",
    allDayWork: false,
    awakeTime: "10:00",
    sleepTime: "20:00",
    screenSize: "110cm",
    productNameFontSize: 12,
    productPriceFontSizeBeforeDiscount: 12,
    productPriceFontSizeAfterDiscount: 12,
    productBarcodeFontSize: 12,
    productBarcodeNumbersFontSize: 12,
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.0.7",
    batteryStatus: 30,
    last_update_date: "2025-05-14T15:00:00Z",
  },
  {
    id: 303,
    storeId: 3,
    country: "Germany",
    city: "Berlin",
    token: "ESP-BER-003",
    allDayWork: true,
    screenSize: "80cm",
    productNameFontSize: 10,
    productPriceFontSizeBeforeDiscount: 10,
    productPriceFontSizeAfterDiscount: 10,
    productBarcodeFontSize: 10,
    productBarcodeNumbersFontSize: 10,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "7s",
    mosfetStatus: "Inactive",
    softwareVersion: "2.0.9",
    batteryStatus: 25,
    last_update_date: "2025-06-13T05:00:00Z",
  },

  {
    id: 401,
    storeId: 4,
    country: "Poland",
    city: "Warsaw",
    token: "ESP-WAW-001",
    allDayWork: false,
    awakeTime: "08:00",
    sleepTime: "20:00",
    screenSize: "130cm",
    productNameFontSize: 15,
    productPriceFontSizeBeforeDiscount: 15,
    productPriceFontSizeAfterDiscount: 15,
    productBarcodeFontSize: 15,
    productBarcodeNumbersFontSize: 15,
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 70,
    last_update_date: "2025-06-12T22:00:00Z",
  },
  {
    id: 402,
    storeId: 4,
    country: "Poland",
    city: "Warsaw",
    token: "ESP-WAW-002",
    allDayWork: false,
    awakeTime: "08:00",
    sleepTime: "20:00",
    screenSize: "110cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    dataRefreshRate: "10s",
    mosfetStatus: "Inactive",
    softwareVersion: "2.1.0",
    batteryStatus: 20,
    last_update_date: "2025-06-12T21:00:00Z",
  },
  {
    id: 403,
    storeId: 4,
    country: "Poland",
    city: "Warsaw",
    token: "ESP-WAW-003",
    allDayWork: false,
    awakeTime: "08:00",
    sleepTime: "20:00",
    screenSize: "80cm",
    productNameFontSize: 12,
    productPriceFontSizeBeforeDiscount: 12,
    productPriceFontSizeAfterDiscount: 12,
    productBarcodeFontSize: 12,
    productBarcodeNumbersFontSize: 12,
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.0.9",
    batteryStatus: 45,
    last_update_date: "2025-06-11T19:00:00Z",
  },

  {
    id: 501,
    storeId: 5,
    country: "Turkey",
    city: "Ankara",
    token: "ESP-ANK-001",
    allDayWork: true,
    screenSize: "130cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 88,
    last_update_date: "2025-06-05T11:00:00Z",
  },
  {
    id: 502,
    storeId: 5,
    country: "Turkey",
    city: "Ankara",
    token: "ESP-ANK-002",
    allDayWork: false,
    awakeTime: "09:00",
    sleepTime: "21:00",
    screenSize: "110cm",
    productNameFontSize: 13,
    productPriceFontSizeBeforeDiscount: 13,
    productPriceFontSizeAfterDiscount: 13,
    productBarcodeFontSize: 13,
    productBarcodeNumbersFontSize: 13,
    dataRefreshRate: "8s",
    mosfetStatus: "Inactive",
    softwareVersion: "2.0.7",
    batteryStatus: 22,
    last_update_date: "2025-06-04T15:00:00Z",
  },
  {
    id: 503,
    storeId: 5,
    country: "Turkey",
    city: "Ankara",
    token: "ESP-ANK-003",
    allDayWork: false,
    awakeTime: "09:00",
    sleepTime: "21:00",
    screenSize: "80cm",
    productNameFontSize: 11,
    productPriceFontSizeBeforeDiscount: 11,
    productPriceFontSizeAfterDiscount: 11,
    productBarcodeFontSize: 11,
    productBarcodeNumbersFontSize: 11,
    dataRefreshRate: "6s",
    mosfetStatus: "Active",
    softwareVersion: "2.0.6",
    batteryStatus: 55,
    last_update_date: "2025-06-03T10:00:00Z",
  },

  {
    id: 601,
    storeId: 6,
    country: "USA",
    city: "Los Angeles",
    token: "ESP-LA-001",
    allDayWork: true,
    screenSize: "130cm",
    productNameFontSize: 16,
    productPriceFontSizeBeforeDiscount: 16,
    productPriceFontSizeAfterDiscount: 16,
    productBarcodeFontSize: 16,
    productBarcodeNumbersFontSize: 16,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 95,
    last_update_date: "2025-06-13T18:00:00Z",
  },
  {
    id: 602,
    storeId: 6,
    country: "USA",
    city: "Los Angeles",
    token: "ESP-LA-002",
    allDayWork: true,
    screenSize: "110cm",
    productNameFontSize: 15,
    productPriceFontSizeBeforeDiscount: 15,
    productPriceFontSizeAfterDiscount: 15,
    productBarcodeFontSize: 15,
    productBarcodeNumbersFontSize: 15,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.1.0",
    batteryStatus: 80,
    last_update_date: "2025-06-12T12:00:00Z",
  },
  {
    id: 603,
    storeId: 6,
    country: "USA",
    city: "Los Angeles",
    token: "ESP-LA-003",
    allDayWork: true,
    screenSize: "80cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    awakeTime: "00:00",
    sleepTime: "00:00",
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "2.0.9",
    batteryStatus: 70,
    last_update_date: "2025-06-11T10:00:00Z",
  },

  {
    id: 701,
    storeId: 7,
    country: "Poland",
    city: "Krakow",
    token: "ESP-KRA-001",
    allDayWork: false,
    awakeTime: "09:00",
    sleepTime: "17:00",
    screenSize: "130cm",
    productNameFontSize: 14,
    productPriceFontSizeBeforeDiscount: 14,
    productPriceFontSizeAfterDiscount: 14,
    productBarcodeFontSize: 14,
    productBarcodeNumbersFontSize: 14,
    dataRefreshRate: "10s",
    mosfetStatus: "Active",
    softwareVersion: "1.0.0",
    batteryStatus: 65,
    last_update_date: "2024-12-30T10:00:00Z",
  },
];
