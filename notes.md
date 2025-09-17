bolt-ysc-app/
├── backend/
│ ├── server.js # Main server file (root of backend)
│ ├── .env # Environment variables
│ ├── db.js # Database connection setup
│ ├── package.json # Node.js dependencies and scripts
│ ├── middleware/ # Middleware folder
│ │ ├── auth.js # Authentication middleware
│ │ ├── admin.js # Admin-only middleware
│ │ └── upload.js # Multer setup for file uploads
│ ├── routes/ # API route handlers
│ │ ├── auth.js # Authentication routes (login/register)
│ │ ├── profile.js # User profile routes
│ │ ├── leaders.js # Leader management routes
│ │ ├── blog.js # Blog management routes
│ │ ├── events.js # Event management routes
│ │ ├── gallery.js # Gallery management routes
│ │ └── users.js # User management routes (admin)
│ ├── uploads/ # Folder for storing uploaded images
│ └── node_modules/ # Installed dependencies (auto-generated)
├── frontend/
│ └── (frontend files, as per Vite setup)
