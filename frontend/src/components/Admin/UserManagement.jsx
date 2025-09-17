import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Alert } from "react-bootstrap";

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
    <>
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}
      <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Admin</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.is_admin ? "Yes" : "No"}</td>
            <td>
              <Button variant="info" onClick={() => toggleAdmin(user.id)}>
                Toggle Admin
              </Button>{" "}
              <Button variant="danger" onClick={() => deleteUser(user.id)}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
      </Table>
    </>
  );
};

export default UserManagement;
