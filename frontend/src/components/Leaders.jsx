import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Leaders = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("/api/leaders").then((res) => setLeaders(res.data));
  }, []);

  return (
    <div className="container section-centered" style={{ padding: "2rem 1.5rem", maxWidth: "960px" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="academia-label">Volume VIII</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Meet Our YCS Leaders</h2>
          <p className="dropcap-intro" style={{ maxWidth: "48rem", margin: "0 auto", opacity: 0.9 }}>
            Our dedicated Youth Serving Christ (YCS) leaders at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, guide our youth
            in faith, service, and community, inspiring all to live for Christ.
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {leaders.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
            No leaders to display yet. Check back soon to meet our YCS leaders.
          </div>
        ) : (
          leaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card glass-surface"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div className="arch-top" style={{ height: 200 }}>
                <img
                  src={leader.picture_url || "https://via.placeholder.com/200?text=YCS+Leader"}
                  alt={leader.name}
                  className="academia-photo"
                />
              </div>
              <div className="card-body">
                <h4 style={{ marginBottom: "0.25rem" }}>{leader.name}</h4>
                <small className="text-muted" style={{ display: "block", marginBottom: "0.5rem" }}>
                  {leader.position || "YCS Leader"}
                </small>
                <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                  {leader.bio || "Guiding our youth in faith and service."}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Leaders;
