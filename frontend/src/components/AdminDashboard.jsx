import { useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import UserManagement from "./Admin/UserManagement.jsx";
import LeaderManagement from "./Admin/LeaderManagement.jsx";
import BlogManagement from "./Admin/BlogManagement.jsx";
import EventManagement from "./Admin/EventManagement.jsx";
import GalleryManagement from "./Admin/GalleryManagement.jsx";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");

  return (
    <Tabs
      id="admin-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k)}
      className="mb-3"
    >
      <Tab eventKey="users" title="User Management">
        <UserManagement />
      </Tab>
      <Tab eventKey="leaders" title="Leader Management">
        <LeaderManagement />
      </Tab>
      <Tab eventKey="blogs" title="Blog Management">
        <BlogManagement />
      </Tab>
      <Tab eventKey="events" title="Event Management">
        <EventManagement />
      </Tab>
      <Tab eventKey="gallery" title="Gallery Management">
        <GalleryManagement />
      </Tab>
    </Tabs>
  );
};

export default AdminDashboard;
