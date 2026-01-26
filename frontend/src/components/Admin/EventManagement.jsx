import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("/api/events");
      setEvents(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load events";
      setError(msg);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("date", data.date);
    formData.append("is_future", data.is_future);
    if (data.picture[0]) formData.append("picture", data.picture[0]);

    try {
      if (editing) {
        await axios.put(`/api/events/${editing.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/events", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchEvents();
      setShowModal(false);
      reset();
      setEditing(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Operation failed";
      setError(msg);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`/api/events/${id}`);
      fetchEvents();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete event";
      setError(msg);
    }
  };

  const editEvent = (event) => {
    setEditing(event);
    reset({
      title: event.title,
      description: event.description,
      date: event.date,
      is_future: event.is_future,
    });
    setShowModal(true);
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {error && (
          <div className="glass-surface" style={{ padding: "0.75rem 1rem", borderLeft: "3px solid var(--clr-danger-a40)" }}>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>Error</strong>
            <span style={{ fontSize: "0.9rem" }}>{error}</span>
          </div>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          style={{ alignSelf: "flex-start" }}
        >
          Add Event
        </button>
        <div className="glass-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Future?</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.5rem" }}>{event.title}</td>
                  <td style={{ padding: "0.5rem" }}>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={{ padding: "0.5rem" }}>{event.is_future ? "Yes" : "No"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => editEvent(event)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "var(--clr-danger-a40)" }}
                        onClick={() => deleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-surface"
            style={{ maxWidth: "720px", width: "100%", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>{editing ? "Edit Event" : "Add Event"}</h3>
            <form
              id="event-form"
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Title</span>
                <input className="form-input" required {...register("title")} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Description</span>
                <textarea
                  className="form-input"
                  rows={3}
                  {...register("description")}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Date</span>
                <input
                  type="date"
                  className="form-input"
                  required
                  {...register("date")}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.9rem" }}>
                <input type="checkbox" {...register("is_future")} />
                <span>Is Future Event</span>
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Picture</span>
                <input type="file" accept="image/*" {...register("picture")} />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManagement;
