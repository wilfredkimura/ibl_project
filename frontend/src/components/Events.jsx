import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/events").then((res) => setEvents(res.data));
  }, []);

  const upcomingEvents = events.filter((event) => event.is_future);
  const pastEvents = events.filter((event) => !event.is_future);

  return (
    <div className="container section-centered" style={{ padding: "2rem 1.5rem", maxWidth: "960px" }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div className="academia-label">Volume VII</div>
          <h2 style={{ marginBottom: "0.5rem" }}>YCS Events at St. Dominic</h2>
          <p className="dropcap-intro" style={{ maxWidth: "48rem", margin: "0 auto", opacity: 0.9 }}>
            Join Youth Serving Christ (YCS) at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, for faith-filled events,
            including Masses, retreats, and community service, as we grow closer to Christ together.
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>

      <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
        <div className="academia-label">I</div>
        <h3 style={{ marginBottom: "0.25rem" }}>Upcoming Events</h3>
        <div className="ornate-divider" aria-hidden="true" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card glass-surface"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div className="arch-top" style={{ height: 180 }}>
                <img
                  src={event.picture_url || "https://via.placeholder.com/200?text=YCS+Event"}
                  alt={event.title}
                  className="academia-photo"
                />
              </div>
              <div className="card-body">
                <h4 style={{ marginBottom: "0.25rem" }}>{event.title || "Upcoming Event"}</h4>
                <small className="text-muted" style={{ display: "block", marginBottom: "0.5rem" }}>
                  {new Date(event.date).toLocaleDateString()}
                </small>
                <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                  {event.description || "Join us for a faith-filled event!"}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
            No upcoming events. Stay tuned for more YCS activities!
          </div>
        )}
      </div>

      <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
        <div className="academia-label">II</div>
        <h3 style={{ marginBottom: "0.25rem" }}>Past Events</h3>
        <div className="ornate-divider" aria-hidden="true" />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {pastEvents.length > 0 ? (
          pastEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card glass-surface"
              style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <img
                src={event.picture_url || "https://via.placeholder.com/200?text=YCS+Event"}
                alt={event.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
              <div className="card-body">
                <h4 style={{ marginBottom: "0.25rem" }}>{event.title || "Past Event"}</h4>
                <small className="text-muted" style={{ display: "block", marginBottom: "0.5rem" }}>
                  {new Date(event.date).toLocaleDateString()}
                </small>
                <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
                  {event.description || "Relive our faith-filled moments!"}
                </p>
              </div>
            </motion.div>
          ))
        ) : (
          <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
            No past events yet. Join us for future YCS events!
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
