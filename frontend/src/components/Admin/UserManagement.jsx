import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "react-bootstrap";

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    axios.get("/api/users").then((res) => setUsers(res.data));
  };

  const toggleAdmin = (id) => {
    axios.put(`/api/users/${id}/toggle-admin`).then(() => fetchUsers());
  };

  const deleteUser = (id) => {
    axios.delete(`/api/users/${id}`).then(() => fetchUsers());
  };

  return (
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
  );
};

export default UserManagement;
