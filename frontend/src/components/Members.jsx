import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Alert } from "@mui/material";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view members");
          return;
        }
        const res = await axios.get("/api/users/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load members";
        setError(errorMessage);
        console.error("Error fetching members:", err.response?.data || err);
      }
    };
    fetchMembers();
  }, []);

  return (
    <Container maxWidth="lg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Typography variant="h4">YCS Members</Typography>
          <Typography variant="body1" color="text.secondary">
            Meet our vibrant Youth Serving Christ community at St. Dominic Catholic Church!
          </Typography>
        </div>
      </motion.div>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}

      {!error && members.length === 0 && (
        <Typography sx={{ mb: 2 }}>Loading...</Typography>
      )}

      {members.length > 0 && (
        <Grid container spacing={2}>
          {members.map((member) => (
            <Grid item md={4} xs={12} key={member.id}>
              <Card>
                <CardMedia
                  component="img"
                  height="200"
                  image={member.picture_url || "/images/ycs-member-placeholder.png"}
                  alt={member.name}
                />
                <CardContent>
                  <Typography variant="h6">{member.name || "YCS Member"}</Typography>
                  <Typography variant="body2" color="text.secondary">{member.bio || "A dedicated YCS member."}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Members;
