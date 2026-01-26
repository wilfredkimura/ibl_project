import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const LeaderManagement = () => {
  const [leaders, setLeaders] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const res = await axios.get("/api/leaders");
      setLeaders(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load leaders";
      setError(msg);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("position", data.position);
    formData.append("bio", data.bio);
    if (data.picture[0]) formData.append("picture", data.picture[0]);

    try {
      if (editing) {
        await axios.put(`/api/leaders/${editing.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/leaders", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchLeaders();
      setShowModal(false);
      reset();
      setEditing(null);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Operation failed";
      setError(msg);
    }
  };

  const deleteLeader = async (id) => {
    try {
      await axios.delete(`/api/leaders/${id}`);
      fetchLeaders();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete leader";
      setError(msg);
    }
  };

  const editLeader = (leader) => {
    setEditing(leader);
    reset({ name: leader.name, position: leader.position, bio: leader.bio });
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
          Add Leader
        </button>
        <div className="glass-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Name</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Position</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => (
                <tr key={leader.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.5rem" }}>{leader.name}</td>
                  <td style={{ padding: "0.5rem" }}>{leader.position}</td>
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
                        onClick={() => editLeader(leader)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "var(--clr-danger-a40)" }}
                        onClick={() => deleteLeader(leader.id)}
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
            <h3 style={{ marginBottom: "0.75rem" }}>{editing ? "Edit Leader" : "Add Leader"}</h3>
            <form
              id="leader-form"
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Name</span>
                <input className="form-input" required {...register("name")} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Position</span>
                <input className="form-input" {...register("position")} />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Bio</span>
                <textarea
                  className="form-input"
                  rows={3}
                  {...register("bio")}
                />
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

export default LeaderManagement;
