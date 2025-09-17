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
import RichTextEditor from "../common/RichTextEditor.jsx";

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset } = useForm();
  const [contentHtml, setContentHtml] = useState("");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/blog");
      setBlogs(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load blogs";
      setError(msg);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (!contentHtml || contentHtml.replace(/<[^>]*>/g, "").trim().length === 0) {
      setError("Content is required");
      return;
    }
    formData.append("content", contentHtml);
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
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Operation failed";
      setError(msg);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await axios.delete(`/api/blog/${id}`);
      fetchBlogs();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete blog";
      setError(msg);
    }
  };

  const editBlog = (blog) => {
    setEditing(blog);
    reset({ title: blog.title });
    setContentHtml(blog.content || "");
    setShowModal(true);
  };

  return (
    <Container disableGutters>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" onClick={() => setShowModal(true)}>Add Blog</Button>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id} hover>
                  <TableCell>{blog.title}</TableCell>
                  <TableCell>{new Date(blog.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => editBlog(blog)}>Edit</Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteBlog(blog.id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="md">
        <DialogTitle>{editing ? "Edit Blog" : "Add Blog"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="blog-form" onSubmit={handleSubmit(onSubmit)}>
            <TextField label="Title" {...register("title")} required />
            <RichTextEditor value={contentHtml} onChange={setContentHtml} />
            <TextField type="file" inputProps={{ accept: 'image/*' }} {...register("picture")} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button type="submit" form="blog-form" variant="contained">{editing ? "Update" : "Add"}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogManagement;
