# Project Appendix

**Project:** Youth Serving Christ (YCS) St. Dominic — Web & Mobile Application
**Date:** January 26, 2026

---

## Appendix A: Database Schema

This appendix contains the detailed SQL `CREATE TABLE` statements for the PostgreSQL database schema used in the project.

```sql
-- users: Stores user authentication credentials and roles.
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- profiles: Stores additional, non-critical user profile information.
-- This table has a one-to-one relationship with the users table.
CREATE TABLE IF NOT EXISTS profiles (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(150),
  bio TEXT,
  picture_url TEXT
);

-- leaders: Stores information about the leaders of the YCS group.
CREATE TABLE IF NOT EXISTS leaders (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  position VARCHAR(150),
  bio TEXT,
  picture_url TEXT
);

-- blog: Stores blog posts for announcements and articles.
CREATE TABLE IF NOT EXISTS blog (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  picture_url TEXT,
  date TIMESTAMP DEFAULT NOW()
);

-- events: Stores information about upcoming and past events.
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  picture_url TEXT
);

-- albums: Stores information about photo albums in the gallery.
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  date DATE,
  cover_url TEXT
);

-- gallery: Stores individual gallery images.
-- Each image can optionally belong to an album.
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  album_id INT REFERENCES albums(id) ON DELETE SET NULL,
  caption TEXT,
  picture_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Appendix B: API Endpoint Documentation

This section provides a more detailed breakdown of the backend API endpoints.

**Base URL:** `/api`

### Authentication (`/auth`)
*   **`POST /auth/register`**
    *   **Description:** Registers a new user.
    *   **Request Body:** `{ "username": "...", "email": "...", "password": "..." }`
    *   **Response:** `{ "token": "...", "user": { ... } }`
*   **`POST /auth/login`**
    *   **Description:** Authenticates a user.
    *   **Request Body:** `{ "email": "...", "password": "..." }`
    *   **Response:** `{ "token": "...", "user": { ... } }`

### Profile (`/profile`)
*   **`GET /profile`**
    *   **Description:** Retrieves the profile of the authenticated user.
    *   **Auth:** JWT required.
    *   **Response:** `{ "id": ..., "name": "...", "bio": "...", "picture_url": "..." }`
*   **`PUT /profile`**
    *   **Description:** Updates the profile of the authenticated user.
    *   **Auth:** JWT required.
    *   **Request Body:** `{ "name": "...", "bio": "..." }`
    *   **Response:** `{ "id": ..., "name": "...", "bio": "...", ... }`

### Users (`/users`)
*   **`GET /users`**
    *   **Description:** Retrieves a list of all users.
    *   **Auth:** Admin role required.
    *   **Response:** `[ { "id": ..., "username": "...", "email": "..." }, ... ]`

### Content Routes (Blog, Events, Leaders, Gallery, Albums)
These routes generally follow a standard RESTful pattern.
*   **`GET /<resource>`:** Retrieves a list of all items for the resource.
*   **`GET /<resource>/:id`:** Retrieves a single item by its ID.
*   **`POST /<resource>`:** Creates a new item (Admin only).
*   **`PUT /<resource>/:id`:** Updates an existing item (Admin only).
*   **`DELETE /<resource>/:id`:** Deletes an item (Admin only).

---

## Appendix C: Configuration Files

This section contains the contents of the `package.json` files for both the backend and frontend, which define the project's dependencies and scripts.

### Backend `package.json`

```json
{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "node scripts/migrate.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^3.0.2",
    "cloudinary": "^1.41.3",
    "@clerk/express": "^1.3.25",
    "cors": "^2.8.5",
    "dotenv": "^17.2.2",
    "express": "^5.1.0",
    "jsonwebtoken": "^9.0.2",
    "multer": "^2.0.2",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.10"
  }
}
```

### Frontend `package.json`

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@clerk/clerk-react": "^5.7.3",
    "axios": "^1.12.2",
    "framer-motion": "^12.23.12",
    "@emotion/react": "^11.13.5",
    "@emotion/styled": "^11.13.5",
    "@mui/icons-material": "^6.1.8",
    "@mui/material": "^6.1.8",
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "react-hook-form": "^7.62.0",
    "react-lazy-load-image-component": "^1.6.3",
    "react-router-dom": "^7.9.1",
    "swiper": "^11.1.14"
  },
  "devDependencies": {
    "@eslint/js": "^9.33.0",
    "@types/react": "^19.1.10",
    "@types/react-dom": "^19.1.7",
    "@vitejs/plugin-react": "^5.0.0",
    "eslint": "^9.33.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "eslint-plugin-react-refresh": "^0.4.20",
    "globals": "^16.3.0",
    "vite": "^7.1.2"
  }
}
```

---

## Appendix D: Source Code Snippets

This section provides key source code excerpts from the application to illustrate important implementation details.

### Backend: `server.js` (Entry Point)

This snippet shows the initialization of the Express server, middleware setup, and route mounting.

```javascript
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/profile", require("./routes/profile"));
// ... other routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Frontend: `App.jsx` (Routing Setup)

This snippet illustrates the client-side routing setup using `react-router-dom` and the implementation of protected routes.

```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./components/Home.jsx";
import AdminDashboard from "./components/AdminDashboard.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
// ... other imports

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* ... other public routes */}
            <Route
              path="/admin"
              element={
                <PrivateRoute adminOnly>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            {/* ... other protected routes */}
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
```

### Frontend: `AuthContext.jsx` (State Management)

A simplified example of the authentication context provider.

```jsx
import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Logic to fetch user profile based on token, login, logout, etc.

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
```