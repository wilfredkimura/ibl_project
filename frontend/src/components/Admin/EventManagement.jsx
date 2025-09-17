import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
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
    <>
      {error && (
        <Alert variant="danger" className="mb-3">{error}</Alert>
      )}
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Event
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Future?</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.title}</td>
              <td>{new Date(event.date).toLocaleDateString()}</td>
              <td>{event.is_future ? "Yes" : "No"}</td>
              <td>
                <Button variant="info" onClick={() => editEvent(event)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => deleteEvent(event.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Event" : "Add Event"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" {...register("title")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" {...register("description")} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" {...register("date")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Is Future Event"
                {...register("is_future")}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Picture</Form.Label>
              <Form.Control type="file" {...register("picture")} />
            </Form.Group>
            <Button type="submit">{editing ? "Update" : "Add"}</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EventManagement;
