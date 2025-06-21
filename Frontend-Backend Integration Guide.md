Frontend-Backend Integration Guide
This guide provides a step-by-step process for connecting your React application to the live Backend API, replacing the mock data currently in use.

Step 1: Configure the API Base URL
It's best practice to define the main API address in a central location. You can create a file like src/apiConfig.js:

// src/apiConfig.js

export const API_BASE_URL = "http://localhost:8000"; // Your Backend server address

This way, if the server address changes, you only need to update this one file.

Step 2: Create an API Request Helper (Recommended)
Using a library like axios simplifies API request management. Add axios to your project:
npm install axios

Next, create an axios instance that will automatically attach the authentication token to every request.

// src/api/axiosInstance.js (new file)

import axios from 'axios';
import { API_BASE_URL } from '../apiConfig';

const axiosInstance = axios.create({
baseURL: API_BASE_URL,
});

// This is an interceptor. It runs before each API request is sent.
axiosInstance.interceptors.request.use(
(config) => {
// Get the token from the browser's storage (e.g., localStorage).
const token = localStorage.getItem('authToken');

    // If the token exists, add it to the request's Authorization header.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;

},
(error) => {
return Promise.reject(error);
}
);

export default axiosInstance;

Step 3: Connect the Authentication (Login) Flow
Update the login function in your AuthContext.js file to call the real API instead of checking mock user data.

// src/context/AuthContext.js (updated login function)
import axiosInstance from '../api/axiosInstance'; // Import the new axios instance

const login = async (email, password) => {
try {
// Remember, our login endpoint expects form data.
const formData = new URLSearchParams();
formData.append('username', email);
formData.append('password', password);

    const response = await axiosInstance.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { user, token } = response.data;

    // Save the received token to the browser's storage.
    localStorage.setItem('authToken', token);

    // Set the user information in the state.
    setUser(user);

    return true; // Successful login

} catch (error) {
console.error("Login failed:", error);
// You can update a state here to show an error message to the user.
return false; // Failed login
}
};

Step 4: Example Integration - Listing Stores (StoresPage.jsx)
This will serve as a template for all other pages.

1. Remove Mock Data: In StoresPage.jsx, delete the import for mockStores.

2. Add States: Use useState to hold the data, loading status, and any potential errors.

// src/pages/Stores/StoresPage.jsx

import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance'; // Import the API helper

function StoresPage() {
const [stores, setStores] = useState([]); // State to hold store data
const [isLoading, setIsLoading] = useState(true); // State to hold loading status
const [error, setError] = useState(null); // State to hold error status

// ...
}

3. Fetch Data from API: Use the useEffect hook to request the stores from the API when the page first loads.

// src/pages/Stores/StoresPage.jsx (with useEffect)

// ...

useEffect(() => {
const fetchStores = async () => {
try {
setIsLoading(true); // Start loading
setError(null); // Clear previous errors

      const response = await axiosInstance.get('/api/stores');
      setStores(response.data); // Assign the fetched data to the state

    } catch (err) {
      console.error("Failed to fetch stores:", err);
      setError("An error occurred while loading stores."); // Set the error message
    } finally {
      setIsLoading(false); // Finish loading
    }

};

fetchStores();
}, []); // The empty dependency array `[]` ensures this effect runs only once.

// ...

4. Update the UI: In the return part, use these new states to make the UI dynamic.

// src/pages/Stores/StoresPage.jsx (the return part)

if (isLoading) {
return <div>Loading...</div>; // Content to show while loading
}

if (error) {
return <div>Error: {error}</div>; // Content to show in case of an error
}

return (

  <div>
    <h1>Stores</h1>
    <table>
      <thead>
        {/* Table Headers */}
      </thead>
      <tbody>
        {stores.map(store => (
          <tr key={store.id}>
            <td>{store.name}</td>
            <td>{store.country}</td>
            <td>{store.city}</td>
            <td>{store.installerName} {store.installerSurname}</td>
            <td>{store.status}</td>
            {/* Other columns */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

Next Steps
You now have a complete template! Using this StoresPage.jsx example, you can connect all other pages (UsersPage, CompanyUsers, etc.) to the Backend API. The principle is always the same:

Delete the mock data import.

Add useState hooks for data, isLoading, and error.

Call the relevant API endpoint using axiosInstance inside a useEffect hook.

Assign the result to the state.

Render the UI dynamically based on these states.

This guide will help you through the process of bringing your Frontend and Backend together.
