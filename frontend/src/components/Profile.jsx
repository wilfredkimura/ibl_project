import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  Container,
  Paper,
  TextField,
  Button,
  Alert,
  Stack,
  Typography,
  Avatar,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { register, handleSubmit, reset } = useForm();
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view your profile");
          return;
        }
        const endpoint = userId ? `/api/profile/${userId}` : "/api/profile";
        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);
        reset(res.data);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load profile";
        setError(errorMessage);
        console.error("Error fetching profile:", err.response?.data || err);
      }
    };
    fetchProfile();
  }, [userId, reset]);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please log in to update your profile");
        return;
      }
      const formData = new FormData();
      if (data.name) formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      if (data.picture && data.picture[0])
        formData.append("picture", data.picture[0]);

      const res = await axios.put("/api/profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(res.data);
      setEditMode(false);
      reset(res.data);
      setError("");
      setSuccess("Profile updated successfully!");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to update profile";
      setError(errorMessage);
      console.error("Error updating profile:", err.response?.data || err);
    }
  };

  const isOwnProfile = !userId || userId === String(user?.id);

  return (
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <Typography variant="h4">
            {isOwnProfile ? "Your Profile" : profile?.name ? `${profile.name}'s Profile` : "Member Profile"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isOwnProfile
              ? "Manage your Youth Serving Christ (YCS) profile at St. Dominic Catholic Church."
              : "Learn more about this YCS member at St. Dominic Catholic Church, St. Theresa Kalimoni Parish."}
          </Typography>
        </div>
      </motion.div>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!error && !profile && <Typography>Loading...</Typography>}

      {profile && (
        <>
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Paper sx={{ p: 3, mx: 'auto' }}>
            <Stack alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Avatar src={profile.picture_url || "/images/ycs-member-placeholder.png"} alt={profile.name} sx={{ width: 120, height: 120 }} />
              <Typography variant="h6">{profile.name || "YCS Member"}</Typography>
            </Stack>
            {editMode && isOwnProfile ? (
              <Stack spacing={2} component="form" onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Name" {...register("name")} placeholder="Enter your name" />
                <TextField label="Bio" multiline minRows={3} {...register("bio")} placeholder="Tell us about yourself" />
                <Button variant="outlined" component="label">
                  Upload Profile Picture
                  <input hidden type="file" accept="image/*" {...register("picture")} />
                </Button>
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <Button onClick={() => setEditMode(false)}>Cancel</Button>
                  <Button type="submit" variant="contained">Save</Button>
                </Stack>
              </Stack>
            ) : (
              <>
                <Typography variant="body1" sx={{ mb: 2 }}>{profile.bio || "A dedicated member of our YCS community."}</Typography>
                {isOwnProfile && (
                  <Button variant="contained" onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
              </>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default Profile;
