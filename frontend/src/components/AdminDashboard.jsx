import { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import UserManagement from "./Admin/UserManagement.jsx";
import LeaderManagement from "./Admin/LeaderManagement.jsx";
import BlogManagement from "./Admin/BlogManagement.jsx";
import EventManagement from "./Admin/EventManagement.jsx";
import GalleryManagement from "./Admin/GalleryManagement.jsx";

const AdminDashboard = () => {
  const [key, setKey] = useState("users");

  const handleChange = (_e, newValue) => setKey(newValue);

  return (
    <Container maxWidth="lg">
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={key} onChange={handleChange} aria-label="Admin Tabs" variant="scrollable" allowScrollButtonsMobile>
          <Tab value="users" label="User Management" />
          <Tab value="leaders" label="Leader Management" />
          <Tab value="blogs" label="Blog Management" />
          <Tab value="events" label="Event Management" />
          <Tab value="gallery" label="Gallery Management" />
        </Tabs>
      </Box>
      <Paper sx={{ p: 2 }}>
        {key === "users" && <UserManagement />}
        {key === "leaders" && <LeaderManagement />}
        {key === "blogs" && <BlogManagement />}
        {key === "events" && <EventManagement />}
        {key === "gallery" && <GalleryManagement />}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;
