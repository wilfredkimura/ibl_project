import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
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
    <div className="container section-centered" style={{ maxWidth: "640px", padding: "2rem 1.5rem" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div className="academia-label">Volume X</div>
          <h2 style={{ marginBottom: "0.5rem" }}>
            {isOwnProfile ? "Your Profile" : profile?.name ? `${profile.name}'s Profile` : "Member Profile"}
          </h2>
          <p className="dropcap-intro" style={{ maxWidth: "36rem", margin: "0 auto", opacity: 0.9 }}>
            {isOwnProfile
              ? "Manage your Youth Serving Christ (YCS) profile at St. Dominic Catholic Church."
              : "Learn more about this YCS member at St. Dominic Catholic Church, St. Theresa Kalimoni Parish."}
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>

      {error && (
        <div className="glass-surface" style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderLeft: "3px solid var(--clr-danger-a40)" }}>
          <strong style={{ display: "block", marginBottom: "0.25rem" }}>Error</strong>
          <span style={{ fontSize: "0.9rem" }}>{error}</span>
        </div>
      )}
      {!error && !profile && <p>Loading...</p>}

      {profile && (
        <>
          {success && (
            <div className="glass-surface" style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderLeft: "3px solid var(--clr-accent-a40)" }}>
              <strong style={{ display: "block", marginBottom: "0.25rem" }}>Profile updated</strong>
              <span style={{ fontSize: "0.9rem" }}>{success}</span>
            </div>
          )}
          <div className="card glass-surface" style={{ padding: "1.5rem 1.75rem" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <div
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.4)",
                }}
              >
                <img
                  src={profile.picture_url || "/images/ycs-member-placeholder.png"}
                  alt={profile.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <h3 style={{ margin: 0 }}>{profile.name || "YCS Member"}</h3>
            </div>

            {editMode && isOwnProfile ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
              >
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ fontSize: "0.9rem" }}>Name</span>
                  <input
                    className="form-input"
                    placeholder="Enter your name"
                    {...register("name")}
                  />
                </label>
                <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                  <span style={{ fontSize: "0.9rem" }}>Bio</span>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Tell us about yourself"
                    {...register("bio")}
                  />
                </label>
                <label
                  className="btn btn-outline"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                  }}
                >
                  <span>Upload Profile Picture</span>
                  <input hidden type="file" accept="image/*" {...register("picture")} />
                </label>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                  <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <>
                <p className="dropcap-intro" style={{ marginBottom: "1rem", opacity: 0.95 }}>
                  {profile.bio || "A dedicated member of our YCS community."}
                </p>
                {isOwnProfile && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setEditMode(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
