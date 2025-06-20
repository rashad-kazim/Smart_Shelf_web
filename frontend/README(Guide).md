Project: Smart Shelf Management Panel - Frontend Integration Guide (Final Version)
Hello, this document outlines the current state of the React-based Smart Shelf Management Panel and describes the API endpoints required for backend integration.

1. Project Purpose & General Architecture
   This project is a web-based management panel for the "Smart Shelf" system, used to manage stores, devices, and users. The frontend has been developed using React with a modern, component-based architecture.

State Management: Global application state (e.g., logged-in user, theme, language) is managed centrally within an AuthContext using the React Context API.
Routing: Page navigation is handled by react-router-dom.
Authorization: Access to pages is controlled by a central ProtectedRoute component, based on the user's role (Admin, Country Chief, etc.). Permissions are defined in the PERMISSIONS object in the src/config/roles.js file. 2. Required API Endpoints for Integration
Below is a list of the main workflows that have been completed on the frontend. The immediate task for the backend is to provide the API endpoints that will replace the mock (static) data currently used by the frontend.

2.1. User Authentication
Endpoint: POST /api/auth/login
Purpose: To validate user credentials and return user data with an auth token.
Request Body: { "email": "user@example.com", "password": "somepassword" }
Success Response (200 OK): A JSON object with the user profile and a token.
JSON

{
"user": {
"id": 1,
"name": "John",
"surname": "Doe",
"email": "john.doe@example.com",
"role": "Admin",
"country": "Poland",
"profilePicture": "url_to_picture.jpg"
},
"token": "your_jwt_or_session_token_here"
}
2.2. Store Management
Endpoint: GET /api/stores
Purpose: To list all stores. The response will be used to populate tables in various management pages (EditStoreDetailsPage, DeleteStorePage, etc.).
Response: An array of store objects.
JSON

[
{
"id": 1,
"name": "Carrefour City Center",
"country": "Poland",
"city": "Warsaw",
"branch": "Downtown",
"address": "123 Main St, Warsaw",
"ownerName": "Jan",
"ownerSurname": "Kowalski",
"installerName": "Piotr",
"installerSurname": "Nowak",
"working_hours": "09:00-21:00",
"created_at": "2024-06-20T10:00:00Z",
"server_token": "xyz-abc-123",
"status": "active",
"num_esp32_connected": 15
}
]
Endpoint: POST /api/stores
Purpose: To create a new store and its initial devices.
Request Body: A JSON object with all store and device information from the NewInstallationPage wizard.
Endpoint: DELETE /api/stores/{storeId}
Purpose: To delete a store.
Endpoint: PUT /api/stores/{storeId}
Purpose: To update an existing store's information and its list of associated devices.
Request Body: A JSON object with the updated store and device information from the StoreEditingWorkflow page.
2.3. Device Management (ESP32)
Endpoint: GET /api/stores/{storeId}/devices
Purpose: To list all devices associated with a specific store. This is used in the "ESP32 Logs" page and the "Edit Store" workflow.
Response: An array of device objects.
JSON

[
{
"id": 101,
"storeId": 1,
"screenSize": "130cm",
"allDayWork": false,
"awakeTime": "08:00",
"sleepTime": "22:00",
"wifi_ssid": "Store_WIFI_1",
"wifi_password": "store_wifi_password",
"softwareVersion": "1.2.0",
"batteryStatus": 88
}
]
2.4. User Management
Endpoint: GET /api/users
Purpose: To list all users (both company and supermarket). Can be filtered with query parameters (e.g., ?role=Runner&country=Poland).
Response: An array of user objects.
Endpoints:
POST /api/users
PUT /api/users/{userId}
DELETE /api/users/{userId} 3. Notes for the Backend Developer
The frontend currently uses mock data from files in the src/data/ folder. The primary task is to create the API endpoints listed above so the frontend can replace the mock data with live API calls.
Web Bluetooth API: All logic for discovering and connecting to Bluetooth devices is handled entirely on the frontend via the browser's Web Bluetooth API. The backend is not involved in this process. The frontend will gather device configuration (like WiFi credentials) and send it to the backend for storage via the standard API endpoints.
API Protection: All routes (except /api/auth/login) must be protected to ensure that only authenticated and authorized users can perform actions. The token generated at login should be validated for every subsequent request. 4. Future Enhancements / Next Steps
Once the primary endpoints are functional, the following API endpoints will be needed to make the frontend filtering fully dynamic and scalable:

Endpoint: GET /api/countries
Purpose: To dynamically populate country dropdowns based on where stores currently exist.
Response: [{"id": 1, "name": "Poland"}, {"id": 2, "name": "Turkey"}]
Endpoint: GET /api/cities?country=Poland
Purpose: To get a list of unique cities for a selected country where stores exist.
Response: [{"id": 10, "name": "Warsaw"}, {"id": 12, "name": "Krakow"}]
This phased approach will allow for a smooth integration process.
