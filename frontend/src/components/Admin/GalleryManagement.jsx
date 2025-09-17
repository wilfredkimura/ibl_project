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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
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

const GalleryManagement = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showAlbumModal, setShowAlbumModal] = useState(false);
  const [showEditAlbumModal, setShowEditAlbumModal] = useState(false);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState("");
  const [editItem, setEditItem] = useState(null);
  const [albumEditing, setAlbumEditing] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [perFileCaptions, setPerFileCaptions] = useState([]);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchAlbums();
  }, []);

  useEffect(() => {
    fetchImages();
  }, [selectedAlbumId]);

  const fetchImages = async () => {
    try {
      const url = selectedAlbumId ? `/api/gallery?album_id=${selectedAlbumId}` : "/api/gallery";
      const res = await axios.get(url);
      setImages(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load gallery";
      setError(msg);
    }
  };

  const deleteAlbum = async () => {
    if (!selectedAlbumId) return;
    const ok = window.confirm("Delete this album and keep images ungrouped? This cannot be undone.");
    if (!ok) return;
    try {
      await axios.delete(`/api/albums/${selectedAlbumId}`);
      setSelectedAlbumId("");
      await fetchAlbums();
      await fetchImages();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete album";
      setError(msg);
    }
  };

  const deleteAlbumById = async (id) => {
    const ok = window.confirm("Delete this album and keep images ungrouped? This cannot be undone.");
    if (!ok) return;
    try {
      await axios.delete(`/api/albums/${id}`);
      if (selectedAlbumId === String(id)) setSelectedAlbumId("");
      await fetchAlbums();
      await fetchImages();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to delete album";
      setError(msg);
    }
  };

  const startEditAlbum = (album) => {
    setAlbumEditing(album);
    setShowEditAlbumModal(true);
  };

  const submitEditAlbum = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      title: form.title.value || undefined,
      date: form.date.value || undefined,
    };
    try {
      await axios.put(`/api/albums/${albumEditing.id}`, payload);
      setShowEditAlbumModal(false);
      setAlbumEditing(null);
      await fetchAlbums();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to update album";
      setError(msg);
    }
  };

  const fetchAlbums = async () => {
    try {
      const res = await axios.get("/api/albums");
      setAlbums(res.data);
      setError("");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to load albums";
      setError(msg);
    }
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (data.album_id) formData.append("album_id", data.album_id);
    // Use selectedFiles state so we can associate captions
    if (selectedFiles?.length) {
      selectedFiles.forEach((file) => formData.append("pictures", file));
      // Append a captions array aligned with files
      perFileCaptions.forEach((cap) => formData.append("captions", cap || ""));
    }

    try {
      await axios.post("/api/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchImages();
      setShowModal(false);
      reset();
      setSelectedFiles([]);
      setPerFileCaptions([]);
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

  const createAlbum = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = {
      title: form.title.value,
      date: form.date.value || undefined,
    };
    try {
      await axios.post("/api/albums", data);
      setShowAlbumModal(false);
      await fetchAlbums();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to create album";
      setError(msg);
    }
  };

  const startEdit = (img) => {
    setEditItem(img);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    if (form.caption.value) formData.append("caption", form.caption.value);
    if (form.album_id.value) formData.append("album_id", form.album_id.value);
    if (form.picture.files[0]) formData.append("picture", form.picture.files[0]);
    try {
      await axios.put(`/api/gallery/${editItem.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setEditItem(null);
      fetchImages();
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.msg || err.message || "Failed to update image";
      setError(msg);
    }
  };

  return (
    <Container disableGutters>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Button variant="contained" onClick={() => setShowModal(true)}>Add Image</Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => setShowAlbumModal(true)}>New Album</Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="album-filter-label">Filter by album</InputLabel>
              <Select
                labelId="album-filter-label"
                label="Filter by album"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
              >
                <MenuItem value="">All Albums</MenuItem>
                {albums.map((a) => (
                  <MenuItem key={a.id} value={a.id}>
                    {a.title} ({new Date(a.date).toLocaleDateString()})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {selectedAlbumId && (
            <Grid item>
              <Button variant="outlined" color="error" onClick={deleteAlbum}>Delete Album</Button>
            </Grid>
          )}
        </Grid>

        <Typography variant="h6">Albums</Typography>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Photos</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {albums.map((a) => (
                <TableRow key={a.id} hover>
                  <TableCell>{a.title}</TableCell>
                  <TableCell>{a.date ? new Date(a.date).toLocaleDateString() : ""}</TableCell>
                  <TableCell>{a.photo_count ?? 0}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => startEditAlbum(a)}>Edit</Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteAlbumById(a.id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {albums.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No albums yet</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Image</TableCell>
                <TableCell>Caption</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images.map((img) => (
                <TableRow key={img.id} hover>
                  <TableCell>
                    <img src={img.picture_url} alt={img.caption} style={{ width: 100 }} />
                  </TableCell>
                  <TableCell>{img.caption}</TableCell>
                  <TableCell align="right">
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} justifyContent="flex-end" alignItems={{ xs: 'stretch', sm: 'center' }}>
                      <Button size="small" variant="outlined" onClick={() => startEdit(img)}>Edit</Button>
                      <Button size="small" color="error" variant="contained" onClick={() => deleteImage(img.id)}>Delete</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      {/* Add Images Dialog */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Add Image</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="add-image-form" onSubmit={handleSubmit(onSubmit)}>
            <Button variant="outlined" component="label">
              Select Pictures
              <input hidden type="file" multiple {...register("pictures")}
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  setSelectedFiles(files);
                  setPerFileCaptions(Array(files.length).fill(""));
                }} />
            </Button>
            {selectedFiles.length > 0 && (
              <Stack spacing={1}>
                <Typography fontWeight={600}>Captions (optional)</Typography>
                {selectedFiles.map((file, idx) => (
                  <Grid container spacing={2} alignItems="center" key={idx}>
                    <Grid item xs={12} md={5}>
                      <Typography noWrap title={file.name}>{file.name}</Typography>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <TextField
                        size="small"
                        placeholder="Caption for this image"
                        value={perFileCaptions[idx] || ""}
                        onChange={(e) => {
                          const next = [...perFileCaptions];
                          next[idx] = e.target.value;
                          setPerFileCaptions(next);
                        }}
                      />
                    </Grid>
                  </Grid>
                ))}
              </Stack>
            )}
            <FormControl fullWidth>
              <InputLabel id="album-label">Album</InputLabel>
              <Select labelId="album-label" label="Album" defaultValue={selectedAlbumId} {...register("album_id")}>
                <MenuItem value="">(No album)</MenuItem>
                {albums.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)}>Cancel</Button>
          <Button type="submit" form="add-image-form" variant="contained">Add</Button>
        </DialogActions>
      </Dialog>

      {/* New Album Dialog */}
      <Dialog open={showAlbumModal} onClose={() => setShowAlbumModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>New Album</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="new-album-form" onSubmit={createAlbum}>
            <TextField name="title" label="Title" placeholder="Album title" required />
            <TextField name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAlbumModal(false)}>Cancel</Button>
          <Button type="submit" form="new-album-form" variant="contained">Create Album</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Album Dialog */}
      <Dialog open={showEditAlbumModal} onClose={() => setShowEditAlbumModal(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Album</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="edit-album-form" onSubmit={submitEditAlbum}>
            <TextField name="title" label="Title" defaultValue={albumEditing?.title || ""} required />
            <TextField name="date" label="Date" type="date" InputLabelProps={{ shrink: true }} defaultValue={albumEditing?.date ? new Date(albumEditing.date).toISOString().slice(0,10) : ""} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowEditAlbumModal(false)}>Cancel</Button>
          <Button type="submit" form="edit-album-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Image Dialog */}
      <Dialog open={!!editItem} onClose={() => setEditItem(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Image</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} component="form" id="edit-image-form" onSubmit={submitEdit}>
            <TextField name="caption" label="Caption" defaultValue={editItem?.caption || ""} />
            <FormControl fullWidth>
              <InputLabel id="edit-album-select">Album</InputLabel>
              <Select labelId="edit-album-select" name="album_id" label="Album" defaultValue={editItem?.album_id || ""}>
                <MenuItem value="">(No album)</MenuItem>
                {albums.map((a) => (
                  <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="outlined" component="label">Replace Picture<input hidden type="file" name="picture" /></Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button type="submit" form="edit-image-form" variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GalleryManagement;
