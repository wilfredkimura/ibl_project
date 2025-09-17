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
  FormControlLabel,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stack,
} from "@mui/material";

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
    <Container disableGutters>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" onClick={() => setShowModal(true)}>Add Event</Button>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Future?</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id} hover>
                  <TableCell>{event.title}</TableCell>
                  <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                  <TableCell>{event.is_future ? "Yes" : "No"}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => editEvent(event)}>Edit</Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteEvent(event.id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="event-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Title" {...register("title")} required />
            <TextField label="Description" multiline minRows={3} {...register("description")} />
            <TextField label="Date" type="date" InputLabelProps={{ shrink: true }} {...register("date")} required />
            <FormControlLabel control={<Checkbox {...register("is_future")} />} label="Is Future Event" />
            <TextField type="file" inputProps={{ accept: 'image/*' }} {...register("picture")} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button type="submit" form="event-form" variant="contained">{editing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default EventManagement;
