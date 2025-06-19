### **Project: Smart Shelf Management Panel - Frontend Integration Guide (Complete Version)**

Hello, this document outlines the current state of the React-based Smart Shelf Management Panel and describes the API endpoints required for backend integration.

#### **1. Project Purpose & General Architecture**

This project is a web-based management panel for the "Smart Shelf" system, used to manage stores, devices, and users. The frontend has been developed using **React** with a modern, component-based architecture.

- **State Management:** Global application state (logged-in user info, lists of stores/users, theme and language preferences, etc.) is managed centrally within an `AuthContext` using the React Context API.
- **Routing:** Page navigation is handled by the `react-router-dom` library.
- **Authorization:** Access to pages is controlled by a central `ProtectedRoute` component, based on the user's role (`Admin`, `Country Chief`, etc.). Permissions are defined in the `PERMISSIONS` object in the `src/config/roles.js` file.

#### **2. Existing Frontend Flows & Expected API Endpoints**

Below is a list of the main workflows that have been completed on the frontend and the corresponding API endpoints expected from the backend to make these flows functional.

##### **2.1. User Login**

- **Interface:** The `LoginPage.jsx` component at the `/login` route.
- **Expectation:** The backend should validate the user's credentials.
- **Required Endpoint:**
  - `POST /api/auth/login`
  - **Request Body:** `{ "email": "user@example.com", "password": "somepassword" }`
  - **Success Response (200 OK):** A JSON object containing the complete user profile and an authentication token.
    ```json
    {
      "user": {
        "id": 1,
        "name": "John",
        "surname": "Doe",
        "email": "john.doe@example.com",
        "role": "Admin",
        "country": "Poland",
        "city": "Warsaw",
        "storeName": "Main Office",
        "branch": null,
        "profilePicture": "url_to_picture.jpg"
      },
      "token": "your_jwt_or_session_token_here"
    }
    ```
  - **Error Response (401 Unauthorized):** For invalid credentials.

##### **2.2. Store Management**

- **Interfaces:** `StoresPage`, `DeleteStorePage`, `EditStoreDetailsPage`, `StoreEditingWorkflow`, `NewInstallationPage`.
- **Expectation:** Listing, filtering, deleting, editing, and creating new stores.
- **Required Endpoints:**
  - **List All Stores:**
    - `GET /api/stores`
    - **Response:** An array of store objects. Each object must contain all fields.
      ```json
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
      ```
  - **Create New Store:**
    - `POST /api/stores`
    - **Request Body:** A JSON object with all store and device information from the `NewInstallationPage` wizard.
    - **Response:** The complete object of the newly created store.
  - **Delete Store:**
    - `DELETE /api/stores/{storeId}`
    - **Response:** A success confirmation (e.g., `204 No Content` or `{ "message": "Store deleted" }`).
  - **Update Store:**
    - `PUT /api/stores/{storeId}`
    - **Request Body:** A JSON object with the updated store and device information.
    - **Response:** The complete, updated store object.

##### **2.3. Device Management (ESP32)**

- **Interfaces:** `NewInstallationPage` (Step 4), `StoreEditingWorkflow` (Step 2).
- **Expectation:** Managing devices associated with a specific store.
- **Required Endpoints:**
  - **List Devices for a Store:**
    - `GET /api/stores/{storeId}/devices`
    - **Response:** An array of device objects. Each object must contain all fields.
      ```json
      [
        {
          "id": 101,
          "storeId": 1,
          "screenSize": "130cm",
          "allDayWork": false,
          "awakeTime": "08:00",
          "sleepTime": "22:00",
          "productNameFontSize": 14,
          "productPriceFontSizeBeforeDiscount": 12,
          "productPriceFontSizeAfterDiscount": 16,
          "productBarcodeFontSize": 10,
          "productBarcodeNumbersFontSize": 8,
          "softwareVersion": "1.2.0",
          "batteryStatus": 88,
          "refreshRate": "30s",
          "mosfetStatus": "ON"
        }
      ]
      ```

##### **2.4. User Management**

- **Interfaces:** `SupermarketUsers`, `CompanyUsers`, `AddUserForm`, `EditUserForm`, etc.
- **Required Endpoints:**
  - **List Users:**
    - `GET /api/users` (with optional query parameters: `?role=Runner&country=Poland`)
    - **Response:** An array of user objects.
  - **Create/Update/Delete User:**
    - `POST /api/users`
    - `PUT /api/users/{userId}`
    - `DELETE /api/users/{userId}`

#### **3. Notes for the Backend Developer**

- The frontend currently uses **mock data** from files in the `src/data/` folder. The primary task is to replace this mock data fetching with live API calls.
- We recommend using a library like **axios** for making API requests on the frontend.
- The backend should provide consistent error responses. The frontend is prepared to display error messages received from the server.
- Backend API routes must be protected (e.g., with JWT) to ensure that only authenticated and authorized users can perform actions. The token generated at login should be used for all subsequent requests.
