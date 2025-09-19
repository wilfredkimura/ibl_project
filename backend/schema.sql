-- Schema for Render PostgreSQL
-- Creates tables used by the application based on backend/routes/* queries

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  bio TEXT,
  picture_url TEXT
);

-- Blogs
CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  picture_url TEXT
);

-- Events
CREATE TABLE IF NOT EXISTS events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  picture_url TEXT,
  is_future BOOLEAN DEFAULT NULL
);

-- Leaders
CREATE TABLE IF NOT EXISTS leaders (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  picture_url TEXT
);

-- Albums
CREATE TABLE IF NOT EXISTS albums (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date DATE DEFAULT NOW()
);

-- Gallery
CREATE TABLE IF NOT EXISTS gallery (
  id SERIAL PRIMARY KEY,
  picture_url TEXT NOT NULL,
  caption TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL
);

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_gallery_album_id ON gallery(album_id);
CREATE INDEX IF NOT EXISTS idx_blogs_date ON blogs(date DESC);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Ensure at least one admin exists (optional). Commented out by default.
-- INSERT INTO users (name, email, password, is_admin)
-- VALUES ('Admin', 'admin@example.com', '$2a$10$hash_goes_here', true)
-- ON CONFLICT (email) DO NOTHING;
