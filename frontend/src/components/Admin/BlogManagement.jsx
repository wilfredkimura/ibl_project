import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = () => {
    axios.get("/api/blog").then((res) => setBlogs(res.data));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("content", data.content);
    if (data.picture[0]) formData.append("picture", data.picture[0]);

    try {
      if (editing) {
        await axios.put(`/api/blog/${editing.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/blog", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchBlogs();
      setShowModal(false);
      reset();
      setEditing(null);
    } catch (err) {
      alert("Operation failed");
    }
  };

  const deleteBlog = (id) => {
    axios.delete(`/api/blog/${id}`).then(() => fetchBlogs());
  };

  const editBlog = (blog) => {
    setEditing(blog);
    reset({ title: blog.title, content: blog.content });
    setShowModal(true);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)} className="mb-3">
        Add Blog
      </Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>{new Date(blog.date).toLocaleDateString()}</td>
              <td>
                <Button variant="info" onClick={() => editBlog(blog)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" onClick={() => deleteBlog(blog.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editing ? "Edit Blog" : "Add Blog"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" {...register("title")} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                {...register("content")}
                required
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

export default BlogManagement;
