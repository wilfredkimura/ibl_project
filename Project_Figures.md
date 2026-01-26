# Project Figures

This file contains text-based representations of the diagrams mentioned in the Final Project Report.

---

### Figure 1: High-Level System Architecture

This diagram illustrates the three-tier architecture of the application, showing the flow of information between the client, the backend server, and the database.

```
+-------------------------------------------------+
|                   End User                      |
| (on Desktop/Laptop Browser)                     |
+-------------------------------------------------+
                 |
                 | HTTPS Requests (e.g., GET, POST)
                 v
+-------------------------------------------------+
|             PRESENTATION LAYER                  |
|    - Frontend: React Web Application (Vite)     |
|    - Hosted on Render                            |
|    - Renders UI, handles user input             |
|    - UI built with Material-UI (MUI)            |
+-------------------------------------------------+
                 |
                 | REST API Calls (Axios)
                 | (e.g., /api/blog, /api/auth/login)
                 v
+-------------------------------------------------+
|                 LOGIC LAYER                     |
|     - Backend: Node.js + Express Server         |
|     - Hosted on Render                          |
|     - Handles business logic, auth, validation  |
|     - Serves static assets (uploads)            |
+-------------------------------------------------+
                 |
                 | SQL Queries (pg library)
                 | (e.g., SELECT *, INSERT ...)
                 v
+-------------------------------------------------+
|                   DATA LAYER                    |
|      - Database: PostgreSQL on Render           |
|      - Stores all persistent application data   |
|      - (users, blog, events, gallery, etc.)     |
+-------------------------------------------------+
```

---

### Figure 2: Frontend Component Hierarchy

This diagram shows the structural composition of the main React components on the frontend, illustrating how pages are built from smaller, reusable parts.

```
App.jsx
└── AuthProvider
    └── Router
        ├── Navbar.jsx
        │   ├── NavbarBrand.jsx
        │   ├── NavbarLinks.jsx
        │   └── NavbarDrawer.jsx (for mobile)
        │
        ├── main
        │   └── Routes
        │       ├── <Route path="/" element={<Home />} />
        │       ├── <Route path="/blog" element={<Blog />} />
        │       ├── <Route path="/events" element={<Events />} />
        │       ├── <Route path="/gallery" element={<GalleryAlbums />} />
        │       │
        │       ├── <Route path="/login" element={<Login />} />
        │       ├── <Route path="/register" element={<Register />} />
        │       │
        │       └── <Route path="/admin" element={<PrivateRoute adminOnly={true} />}>
        │           │   {/* This wraps the AdminDashboard and its sub-routes/components */}
        │           └── AdminDashboard.jsx
        │               ├── UserManagement.jsx
        │               ├── BlogManagement.jsx
        │               ├── EventManagement.jsx
        │               └── ... (etc.)
        │
        └── Footer.jsx
```

---

### Figure 3: Authentication Flow (JWT)

This sequence diagram illustrates the steps involved when a user logs in to receive a JSON Web Token (JWT) and uses it to access a protected resource.

```
  User (Client)            Frontend Server              Backend API                Database
      |                         |                           |                         |
      |---1. POST /login------>|                           |                         |
      |   (email, password)     |                           |                         |
      |                         |---2. POST /api/auth/login--->|                         |
      |                         |   (email, password)         |                         |
      |                         |                           |---3. Find user by email-->|
      |                         |                           |                         |<--4. Return user record--|
      |                         |                           | (with password hash)    |
      |                         |                           |                         |
      |                         |<--5. Compare hash----------| (bcrypt.compare)        |
      |                         |   (if valid, generate JWT)  |                         |
      |                         |                           |                         |
      |<--6. Return JWT---------|                           |                         |
      |   (Store JWT in         |                           |                         |
      |    localStorage)        |                           |                         |
      |                         |                           |                         |
      |---7. GET /api/profile-->|                           |                         |
      |   (Header: Auth Bearer) |                           |                         |
      |                         |---8. GET /api/profile------>|                         |
      |                         |   (Header: Auth Bearer)   |                         |
      |                         |                           |---9. Verify JWT----------| (auth middleware)
      |                         |                           | (extract user_id)       |
      |                         |                           |                         |
      |                         |                           |---10. Fetch profile----->|
      |                         |                           |                         |<--11. Return profile---|
      |                         |                           |                         |
      |<--12. Return profile----|                           |                         |
      |   (Render profile page) |                           |                         |
      |                         |                           |                         |
```

---

### Figure 4: Database Entity-Relationship Diagram (ERD)

This diagram describes the database schema using Mermaid syntax. You can copy and paste this into a Mermaid-compatible renderer (like the one on GitHub, or live editors online) to generate a visual ERD.

```mermaid
erDiagram
    users {
        INT id PK
        VARCHAR username
        VARCHAR email
        TEXT password_hash
        BOOLEAN is_admin
        TIMESTAMP created_at
    }

    profiles {
        INT id PK
        INT user_id FK
        VARCHAR name
        TEXT bio
        VARCHAR picture_url
    }

    leaders {
        INT id PK
        VARCHAR name
        VARCHAR position
        TEXT bio
        VARCHAR picture_url
    }

    blog {
        INT id PK
        VARCHAR title
        TEXT content
        VARCHAR picture_url
        TIMESTAMP date
    }

    events {
        INT id PK
        VARCHAR title
        TEXT description
        DATE date
        VARCHAR picture_url
    }

    albums {
        INT id PK
        VARCHAR title
        DATE date
        VARCHAR cover_url
    }

    gallery {
        INT id PK
        INT album_id FK "nullable"
        TEXT caption
        VARCHAR picture_url
        TIMESTAMP created_at
    }

    users ||--o{ profiles : "has one"
    albums }o--|| gallery : "contains"
```
