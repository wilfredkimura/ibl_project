import { useState, useEffect } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
  Typography,
} from "@mui/material";

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
    <Container disableGutters>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error">{error}</Alert>
        )}
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id} hover>
                  <TableCell>{u.id}</TableCell>
                  <TableCell>{u.username}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.is_admin ? "Yes" : "No"}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => toggleAdmin(u.id)}>
                        Toggle Admin
                      </Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteUser(u.id)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

export default UserManagement;
