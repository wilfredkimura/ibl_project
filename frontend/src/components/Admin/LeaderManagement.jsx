import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
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
    <>
      {error && (
        <Alert variant="danger" className="mb-3">{error}</Alert>
      )}
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Leader
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaders.map((leader) => (
            <tr key={leader.id}>
              <td>{leader.name}</td>
              <td>{leader.position}</td>
              <td>
                <Button variant="info" onClick={() => editLeader(leader)}>
                  Edit
                </Button>{" "}
                <Button
                  variant="danger"
                  onClick={() => deleteLeader(leader.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Leader" : "Add Leader"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" {...register("name")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Position</Form.Label>
              <Form.Control type="text" {...register("position")} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control as="textarea" {...register("bio")} />
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

export default LeaderManagement;
