Smart Shelf Management - Backend Documentation
This document provides a detailed explanation of the setup, architecture, API endpoints, and business logic for the Backend (server-side) application of the "Smart Shelf Management Panel" project.

1. Project Purpose
   This Backend application serves as a central API (Application Programming Interface) to manage digital price tags on supermarket shelves. The system's core responsibilities include:

Managing users, their roles, and permissions.

Registering and managing stores (branches) and their associated devices (ESP32s).

Handling field operations, including logging, status monitoring, and firmware updates.

Providing a secure data exchange for the Frontend (web panel) and Tier 2 Servers (in-store servers).

2. Technology Stack
   Framework: FastAPI

Database: MySQL

Database Interface (ORM): SQLAlchemy

Data Validation: Pydantic

Asynchronous Server: Uvicorn

Security:

Authentication: JWT (JSON Web Tokens)

Password Hashing: Passlib (with bcrypt algorithm)

Data Encryption: Cryptography (with Fernet symmetric encryption)

Rate Limiting: SlowAPI

3. Setup and Launch
   Follow these steps to run the project on a local machine.

Prerequisites
Python 3.10+

MySQL Server

Git (optional)

Installation Steps

1. Get the Project Files:

# Clone the project (optional)

git clone <project_repo_address>
cd backend/

2. Create and Activate a Virtual Environment:
   This isolates the project dependencies from the rest of your system.

# Create the virtual environment

python -m venv venv

# Activate the virtual environment (Windows)

.\venv\Scripts\activate

3. Install Required Libraries:

# First, upgrade pip

.\venv\Scripts\python.exe -m pip install --upgrade pip

# Install all libraries from requirements.txt

.\venv\Scripts\python.exe -m pip install -r requirements.txt

4. Create the .env Configuration File:
   In the main backend/ directory, create a file named .env. This file holds sensitive configuration data.

First, generate the keys:
Run the generate_key.py script to produce secure values for both ENCRYPTION_KEY and SECRET_KEY.

.\venv\Scripts\python.exe generate_key.py

Copy the output of this command and paste it into your .env file according to the template below.

.env File Content:

# Database Connection (replace with your MySQL credentials)

DATABASE_URL=mysql+mysqlconnector://root:your_password_here@localhost:3306/supermarket_db

# JWT Token Settings

# Copy from the output of generate_key.py

SECRET_KEY=...

# Data Encryption Settings

# Copy from the output of generate_key.py

ENCRYPTION_KEY=...

# Token Expiration Time (in minutes)

ACCESS_TOKEN_EXPIRE_MINUTES=60

5. Create the Database:
   Our Python code cannot create the database itself. Connect to your MySQL management tool (Workbench, DBeaver, etc.) and run the following SQL command:

CREATE DATABASE supermarket_db;

6. Create the First Admin User:
   To log into the system, create the initial administrator user. Run the following command in your terminal and enter the requested information:

.\venv\Scripts\python.exe create_admin.py

7. Launch the Server:
   Everything is now ready. You can start the web server with the following command:

uvicorn app.main:app --reload

Once successfully started, the server will be running at http://127.0.0.1:8000.

4. API Endpoints
   You can interactively access and test the API at http://127.0.0.1:8000/docs.

4.1. Authentication (/api/auth)
POST /api/auth/login

Description: Logs a user in with an email and password. On success, it returns user information and a JWT token.

Authorization: Public.

Rate Limit: 3 requests per 5 minutes.

Note: Only "Company Roles" (Admin, Country Chief, Engineer, Analyst) can log in. Market roles cannot access this panel.

4.2. Users (/api/users)
POST /

Description: Creates a new user.

Authorization: Requires Token. Hierarchical authorization is enforced (e.g., an Admin can create any role, a Country Chief can create sub-roles in their country).

GET /

Description: Lists users.

Authorization: Requires Token. An Admin sees all users, a Country Chief sees users in their country, and other roles see only themselves.

GET /{user_id}

Description: Retrieves a single user by ID.

PUT /{user_id}

Description: Updates an existing user's information.

Authorization: Can only be performed by an Admin or a Country Chief (for sub-roles in their country). Other roles cannot change roles.

DELETE /{user_id}

Description: Deletes a user. Can only be performed by an Admin.

PUT /me/preferences

Description: Updates the theme (light/dark) and language (en/tr/pl) preferences for the currently logged-in user.

4.3. Stores (/api/stores)
POST /

Description: Creates a new store and all its associated devices in a single transaction. The installer_id is automatically taken from the ID of the requesting user.

Authorization: Requires Token. Allowed for Admin, Country Chief, and Engineer roles only.

GET /

Description: Lists stores, enriched with related device and installer information.

Authorization: Requires Token. An Admin sees all stores, a Country Chief sees stores in their country.

PUT /{store_id}, DELETE /{store_id}

Description: Updates or deletes a store. Can only be performed by an Admin.

POST /{store_id}/generate-server-token

Description: Generates a new token for the store's Tier 2 Server.

POST /{store_id}/generate-esp32-token

Description: Generates the shared token to be used by all ESP32 devices in the store.

4.4. Operational (/api/ops)
POST /heartbeat

Description: Receives a "I'm alive" signal from a Tier 2 Server.

Authorization: Requires X-Server-Token header.

POST /logs

Description: Accepts logs from a Tier 2 Server.

Authorization: Requires X-Server-Token header.

GET /logs/{store_id}

Description: Lists logs for a specific store for the Frontend.

Authorization: Requires JWT Token.

4.5. Firmware (/api/firmware)
POST /

Description: Uploads a new firmware update file (.bin, etc.). Can only be performed by an Admin.

GET /latest

Description: Allows a Tier 2 Server to check for the latest update for a specific target (server or esp32).

Authorization: Requires X-Server-Token header.

4.6. Utilities (/api/utils)
GET /countries, GET /cities

Description: Returns a standard list of all world countries or a list of cities for a specific country, respectively, to populate dropdown menus in the Frontend.

Authorization: Requires JWT Token.

5. Key Business Logic and Rules
   Installer: When a store record is created, the installer_id field is automatically assigned from the ID of the user making the request (the token holder).

Store Status: A store's status (Online/Offline) is dynamically calculated based on whether it has sent a heartbeat signal within the last 5 minutes.

Data Encryption: Sensitive data, such as WiFi passwords, is encrypted using the ENCRYPTION_KEY before being saved to the database. This data is never exposed in API responses.

User Preferences: Theme and language preferences are tied to the user account and stored in the database, allowing settings to follow the user across different devices.
