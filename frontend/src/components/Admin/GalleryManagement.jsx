import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal, Alert } from "react-bootstrap";
import { useForm } from "react-hook-form";

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get("/api/gallery");
      setImages(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load gallery";
      setError(msg);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("caption", data.caption);
    if (data.picture[0]) formData.append("picture", data.picture[0]);

    try {
      await axios.post("/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages();
      setShowModal(false);
      reset();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Operation failed";
      setError(msg);
    }
  };

  const deleteImage = async (id) => {
    try {
      await axios.delete(`/api/gallery/${id}`);
      fetchImages();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete image";
      setError(msg);
    }
  };

  return (
    <>
      {error && (
        <Alert variant="danger" className="mb-3">{error}</Alert>
      )}
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Image
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Image</th>
            <th>Caption</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {images.map((img) => (
            <tr key={img.id}>
              <td>
                <img
                  src={img.picture_url}
                  alt={img.caption}
                  style={{ width: "100px" }}
                />
              </td>
              <td>{img.caption}</td>
              <td>
                <Button variant="danger" onClick={() => deleteImage(img.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Picture</Form.Label>
              <Form.Control type="file" {...register("picture")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caption</Form.Label>
              <Form.Control type="text" {...register("caption")} />
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default GalleryManagement;
