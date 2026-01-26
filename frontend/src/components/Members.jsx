import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

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
    <div className="container section-centered" style={{ padding: "2rem 1.5rem", maxWidth: "1024px" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="academia-label">Volume IX</div>
          <h2 style={{ marginBottom: "0.5rem" }}>YCS Members</h2>
          <p className="dropcap-intro" style={{ maxWidth: "48rem", margin: "0 auto", opacity: 0.9 }}>
            Meet our vibrant Youth Serving Christ community at St. Dominic Catholic Church.
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>

      {error && (
        <div className="glass-surface" style={{ padding: "0.75rem 1rem", marginBottom: "1rem", borderLeft: "3px solid var(--clr-accent-a40)", textAlign: "left" }}>
          <strong style={{ display: "block", marginBottom: "0.25rem" }}>Error</strong>
          <span style={{ fontSize: "0.9rem" }}>{error}</span>
        </div>
      )}

      {!error && members.length === 0 && (
        <p style={{ marginBottom: "1rem", opacity: 0.8, textAlign: "center" }}>Loading...</p>
      )}

      {members.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {members.map((member) => (
            <div
              key={member.id}
              className="card glass-surface"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div className="arch-top" style={{ height: 200 }}>
                <img
                  src={member.picture_url || "/images/ycs-member-placeholder.png"}
                  alt={member.name}
                  className="academia-photo"
                />
              </div>
              <div className="card-body">
                <h4 style={{ marginBottom: "0.25rem" }}>{member.name || "YCS Member"}</h4>
                <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                  {member.bio || "A dedicated YCS member."}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Members;
