import { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load users";
      setError(msg);
    }
  };

  const toggleAdmin = async (id) => {
    try {
      await axios.put(`/api/users/${id}/toggle-admin`);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to toggle admin";
      setError(msg);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`/api/users/${id}`);
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete user";
      setError(msg);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {error && (
          <div className="glass-surface" style={{ padding: "0.75rem 1rem", borderLeft: "3px solid var(--clr-accent-a40)" }}>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>Error</strong>
            <span style={{ fontSize: "0.9rem" }}>{error}</span>
          </div>
        )}
        <div className="glass-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>ID</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Username</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Email</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Admin</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.5rem" }}>{u.id}</td>
                  <td style={{ padding: "0.5rem" }}>{u.username}</td>
                  <td style={{ padding: "0.5rem" }}>{u.email}</td>
                  <td style={{ padding: "0.5rem" }}>{u.is_admin ? "Yes" : "No"}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => toggleAdmin(u.id)}
                      >
                        Toggle Admin
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "var(--clr-danger-a40)" }}
                        onClick={() => deleteUser(u.id)}
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
    </div>
  );
};

export default UserManagement;
