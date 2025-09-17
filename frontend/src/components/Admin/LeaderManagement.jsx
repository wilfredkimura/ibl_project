import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";

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
    <Container disableGutters>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" onClick={() => setShowModal(true)}>
          Add Leader
        </Button>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Position</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders.map((leader) => (
                <TableRow key={leader.id} hover>
                  <TableCell>{leader.name}</TableCell>
                  <TableCell>{leader.position}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => editLeader(leader)}>
                        Edit
                      </Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteLeader(leader.id)}>
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

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Leader" : "Add Leader"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="leader-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Name" {...register("name")} required />
            <TextField label="Position" {...register("position")} />
            <TextField label="Bio" multiline minRows={3} {...register("bio")} />
            <TextField type="file" inputProps={{ accept: 'image/*' }} {...register("picture")} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button type="submit" form="leader-form" variant="contained">{editing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default LeaderManagement;
