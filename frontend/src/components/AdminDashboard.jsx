import { useState } from "react";
import UserManagement from "./Admin/UserManagement.jsx";
import LeaderManagement from "./Admin/LeaderManagement.jsx";
import BlogManagement from "./Admin/BlogManagement.jsx";
import EventManagement from "./Admin/EventManagement.jsx";
import GalleryManagement from "./Admin/GalleryManagement.jsx";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");

  const handleChange = (value) => setKey(value);

  return (
    <div className="container" style={{ maxWidth: "960px" }}>
      <nav className="ycs-tabs nav nav-tabs mb-3" aria-label="Admin Tabs">
        <button
          type="button"
          className={`nav-link ${key === "users" ? "active" : ""}`}
          onClick={() => handleChange("users")}
        >
          User Management
        </button>
        <button
          type="button"
          className={`nav-link ${key === "leaders" ? "active" : ""}`}
          onClick={() => handleChange("leaders")}
        >
          Leader Management
        </button>
        <button
          type="button"
          className={`nav-link ${key === "blogs" ? "active" : ""}`}
          onClick={() => handleChange("blogs")}
        >
          Blog Management
        </button>
        <button
          type="button"
          className={`nav-link ${key === "events" ? "active" : ""}`}
          onClick={() => handleChange("events")}
        >
          Event Management
        </button>
        <button
          type="button"
          className={`nav-link ${key === "gallery" ? "active" : ""}`}
          onClick={() => handleChange("gallery")}
        >
          Gallery Management
        </button>
      </nav>
      <div className="ycs-tab-surface glass-surface">
        {key === "users" && <UserManagement />}
        {key === "leaders" && <LeaderManagement />}
        {key === "blogs" && <BlogManagement />}
        {key === "events" && <EventManagement />}
        {key === "gallery" && <GalleryManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
