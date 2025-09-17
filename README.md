# YCS St. Dominic Web App

Youth Serving Christ (YCS) at St. Dominic Catholic Church — a full‑stack web application built with React (Vite + Material UI) on the frontend and Node.js + Express on the backend. The app supports authentication, profiles, leaders, blogs, events, and a gallery.

This document explains the project structure, how to run it locally, how to expose it on your LAN, and how to set up PostgreSQL.

---

## Tech Stack

- **Frontend**: React (Vite), React Router, Material UI, Framer Motion, Swiper, React Hook Form
- **Backend**: Node.js, Express, CORS, Static uploads
- **Database**: PostgreSQL
- **Auth**: JWT (access token stored in localStorage)

---

## Repository Structure

```
ibl_project/
├─ backend/
│  ├─ index.js                  # Express server entry
│  ├─ routes/
│  │  ├─ auth.js                # /api/auth (login/register)
│  │  ├─ profile.js             # /api/profile
│  │  └─ users.js               # /api/users (admin)
│  ├─ uploads/                  # uploaded files (served at /uploads)
│  └─ .env                      # backend environment (you create this)
│
├─ frontend/
│  ├─ public/
│  │  └─ images/                # static images, available at /images/*
│  ├─ src/
│  │  ├─ App.jsx                # routes
│  │  ├─ main.jsx               # ThemeProvider, CssBaseline
│  │  ├─ theme.js               # MUI theme (colors, typography)
│  │  ├─ index.css              # global CSS (self-host fonts, footer)
│  │  ├─ context/AuthContext.jsx
│  │  ├─ components/
│  │  │  ├─ Navbar.jsx, Footer.jsx
│  │  │  ├─ Home.jsx, Blog.jsx, Events.jsx, Gallery.jsx
│  │  │  ├─ Register.jsx, Login.jsx, Profile.jsx, Members.jsx, Leaders.jsx
│  │  │  ├─ AdminDashboard.jsx
│  │  │  └─ Admin/* (management UIs)
│  └─ package.json              # Vite scripts
│
└─ README.md                    # This file
```

---

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (local or hosted)
- Git (optional)

---

## Backend Setup (Express + PostgreSQL)

1. Create a PostgreSQL database and user

   ```sql
   -- from psql or any SQL client
   CREATE DATABASE ycs_st_dominic;
   CREATE USER ycs_user WITH ENCRYPTED PASSWORD 'strong_password_here';
   GRANT ALL PRIVILEGES ON DATABASE ycs_st_dominic TO ycs_user;
   ```

2. Create required tables (suggested schema)

   You can adapt these tables to match your exact needs. These align with API endpoints used by the frontend.

   ```sql
   -- users
   CREATE TABLE IF NOT EXISTS users (
     id SERIAL PRIMARY KEY,
     username VARCHAR(100) UNIQUE NOT NULL,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     is_admin BOOLEAN DEFAULT FALSE,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- profiles (1:1 with users)
   CREATE TABLE IF NOT EXISTS profiles (
     id SERIAL PRIMARY KEY,
     user_id INT REFERENCES users(id) ON DELETE CASCADE,
     name VARCHAR(150),
     bio TEXT,
     picture_url TEXT
   );

   -- leaders
   CREATE TABLE IF NOT EXISTS leaders (
     id SERIAL PRIMARY KEY,
     name VARCHAR(150) NOT NULL,
     position VARCHAR(150),
     bio TEXT,
     picture_url TEXT
   );

   -- blog posts
   CREATE TABLE IF NOT EXISTS blog (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     content TEXT NOT NULL,
     picture_url TEXT,
     date TIMESTAMP DEFAULT NOW()
   );

   -- events
   CREATE TABLE IF NOT EXISTS events (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     date DATE NOT NULL,
     picture_url TEXT
   );

   -- gallery images (optional album_id)
   CREATE TABLE IF NOT EXISTS albums (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     date DATE,
     cover_url TEXT
   );

   CREATE TABLE IF NOT EXISTS gallery (
     id SERIAL PRIMARY KEY,
     album_id INT REFERENCES albums(id) ON DELETE SET NULL,
     caption TEXT,
     picture_url TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

   Note: The frontend determines “upcoming” by checking if an event date is in the future, or your backend can expose `is_future` in its API response.

3. Backend environment variables (`backend/.env`)

   Create a `.env` file in `backend/`:

   ```env
   PORT=5000
   DATABASE_URL=postgres://ycs_user:strong_password_here@localhost:5432/ycs_st_dominic
   JWT_SECRET=replace_with_a_long_random_string
   CORS_ORIGIN=http://localhost:5173
   UPLOAD_DIR=uploads
   ```

4. Install backend dependencies & run (from `backend/`)

   ```bash
   npm install
   npm run start    # or: node index.js
   ```

   The server will start on `http://localhost:5000`.

> Note: The provided `backend/index.js` wires routes: `/api/auth`, `/api/profile`, `/api/users`. Ensure your route handlers connect to PostgreSQL using your preferred library (e.g., `pg`, `knex`, or an ORM) and implement the additional endpoints used by the frontend such as `/api/blog`, `/api/events`, `/api/gallery`.

---

## Frontend Setup (Vite + React + MUI)

1. Configure fonts & images
   - Self‑hosted font is already configured in `frontend/src/index.css` via `@font-face` (Ubuntu Mono). No external calls needed.
   - Put static images into `frontend/public/images/`. They are served at `/images/...`.

2. Install frontend dependencies & run (from `frontend/`)

   ```bash
   npm install
   npm run dev
   ```

   Vite will print a local dev URL like `http://localhost:5173`.

3. Environment variables (Frontend)
   - By default, frontend makes relative calls (e.g., `/api/...`). If your backend runs on another port, use a Vite proxy or set `VITE_API_BASE_URL` in an `.env` and read it in your axios config.

4. Build for production

   ```bash
   npm run build
   npm run preview   # serves the production build locally
   ```

---

## Expose the Frontend on Your Local Network (LAN)

- Start Vite listening on all interfaces:

  ```bash
  npm run dev -- --host 0.0.0.0 --port 5173
  ```

- On another device (same network), open:

  ```
  http://YOUR_COMPUTER_IP:5173
  ```

- Windows firewall may need to allow Node.js (or the terminal) on Private networks.

- Optional scripts to add in `frontend/package.json`:

  ```json
  {
    "scripts": {
      "dev:lan": "vite --host 0.0.0.0 --port 5173",
      "preview:lan": "vite preview --host 0.0.0.0 --port 4173"
    }
  }
  ```

---

## Key Frontend Features

- **Hero section** on `Home.jsx` with background image, call‑to‑action buttons.
- **Blog carousel** using Swiper (Autoplay, Navigation, Pagination) and linking to `/blog/:id`.
- **Gallery carousel** for recent images.
- **Upcoming events** showing soonest 3 events.
- **Responsive UI** with Material UI’s theme (`frontend/src/theme.js`), responsive typography, and Drawer navigation for small screens.
- **Self‑hosted fonts** (`Ubuntu Mono`).

---

## API Contracts (Expected by Frontend)

The frontend calls:

- `GET /api/blog` → `[ { id, title, content, picture_url, date } ]`
- `GET /api/events` → `[ { id, title, description, date, picture_url } ]`
- `GET /api/gallery` → `[ { id, album_id, caption, picture_url, created_at } ]`
- `GET /api/leaders` → `[ { id, name, position, bio, picture_url } ]`
- `GET /api/users` (admin) → users list
- `POST /api/auth/login` → `{ token, user }`
- `POST /api/auth/register` → `{ token, user }`
- `GET/PUT /api/profile` → current user profile

If your current backend is missing some of these routes, add them to match the UI. The provided SQL schemas above are a good starting point.

---

## File Uploads

- Backend serves files from `backend/uploads/` at `/uploads/*`.
- You can store user‑uploaded images (e.g., profile photos, gallery) there and save their URLs in PostgreSQL.

---

## Theming & Styling

- Theme is defined in `frontend/src/theme.js` (brown + beige palette) and applied in `frontend/src/main.jsx` via `ThemeProvider` and `CssBaseline`.
- Global CSS lives in `frontend/src/index.css` (footer behavior, self‑hosted fonts, variables).

---

## Development Tips

- **Hot reload**: Vite will hot‑reload when you edit frontend files.
- **Error boundaries**: Consider adding an error boundary around major routes (React 18+ error handling guidance).
- **Network errors**: If API calls fail, ensure backend CORS allows the frontend origin and both servers are running.
- **Placeholders**: Replace placeholder images in `frontend/public/images/` with real assets.

---

## Deployment Overview

You can deploy the frontend (static build) to any static host (Netlify, Vercel, S3 + CloudFront). The backend can be deployed to a VPS or PaaS (Railway, Render, Fly.io, Heroku successor platforms) with a managed PostgreSQL service. Make sure to:

- Set backend `.env` with production `DATABASE_URL` and `JWT_SECRET`.
- Serve uploads from a durable storage (S3, local volume, or shared disk), and point picture URLs accordingly.
- Configure CORS for your production frontend domain.

---

## Troubleshooting

- **Vite can’t resolve Swiper**: run `npm install` in `frontend/` and restart dev server.
- **Port conflicts**: change Vite port `--port 5174` or backend `PORT`.
- **CORS errors**: set `CORS_ORIGIN` to your frontend URL.
- **LAN access fails**: check Windows firewall and that devices share the same network.

---

## License

Private/internal. All rights reserved.
