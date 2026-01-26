import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

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
  const fileInputRef = useRef(null);

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
    console.log("Submitting form:", data);
    console.log("Selected files:", selectedFiles);

    if (!selectedFiles || selectedFiles.length === 0) {
      alert("Please select at least one image to upload.");
      return;
    }

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
      console.error("Upload error:", err);
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
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {error && (
          <div className="glass-surface" style={{ padding: "0.75rem 1rem", borderLeft: "3px solid var(--clr-danger-a40)" }}>
            <strong style={{ display: "block", marginBottom: "0.25rem" }}>Error</strong>
            <span style={{ fontSize: "0.9rem" }}>{error}</span>
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            alignItems: "center",
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            Add Image
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowAlbumModal(true)}
          >
            New Album
          </button>
          <div style={{ minWidth: "220px", flex: "1 1 220px" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.9rem" }}>
              <span>Filter by album</span>
              <select
                className="form-input"
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
              >
                <option value="">All Albums</option>
                {albums.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.date ? new Date(a.date).toLocaleDateString() : ""})
                  </option>
                ))}
              </select>
            </label>
          </div>
          {selectedAlbumId && (
            <button
              type="button"
              className="btn btn-outline"
              style={{ color: "var(--clr-danger-a40)" }}
              onClick={deleteAlbum}
            >
              Delete Album
            </button>
          )}
        </div>

        <h3 style={{ marginTop: "1rem" }}>Albums</h3>
        <div className="glass-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Title</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Date</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Photos</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums.map((a) => (
                <tr key={a.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.5rem" }}>{a.title}</td>
                  <td style={{ padding: "0.5rem" }}>{a.date ? new Date(a.date).toLocaleDateString() : ""}</td>
                  <td style={{ padding: "0.5rem" }}>{a.photo_count ?? 0}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => startEditAlbum(a)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "var(--clr-danger-a40)" }}
                        onClick={() => deleteAlbumById(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {albums.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "0.75rem" }}>No albums yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="glass-surface" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Image</th>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Caption</th>
                <th style={{ textAlign: "right", padding: "0.5rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {images.map((img) => (
                <tr key={img.id} style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <td style={{ padding: "0.5rem" }}>
                    <img src={img.picture_url} alt={img.caption} style={{ width: 100 }} />
                  </td>
                  <td style={{ padding: "0.5rem" }}>{img.caption}</td>
                  <td style={{ padding: "0.5rem", textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => startEdit(img)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: "var(--clr-danger-a40)" }}
                        onClick={() => deleteImage(img.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Images Dialog */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass-surface"
            style={{ maxWidth: "720px", width: "100%", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>Add Image</h3>
            <form
              id="add-image-form"
              onSubmit={handleSubmit(onSubmit)}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <span>Select Pictures</span>
              </button>
              <input
                ref={fileInputRef}
                hidden
                type="file"
                multiple
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  console.log("Files selected:", files);
                  setSelectedFiles(files);
                  setPerFileCaptions(Array(files.length).fill(""));
                }}
              />
              {selectedFiles.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <strong>Captions (optional)</strong>
                  {selectedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.5rem",
                        alignItems: "center",
                      }}
                    >
                      <div style={{ flex: "1 1 40%" }}>
                        <span title={file.name} style={{ fontSize: "0.85rem" }}>
                          {file.name}
                        </span>
                      </div>
                      <div style={{ flex: "1 1 60%" }}>
                        <input
                          className="form-input"
                          style={{ fontSize: "0.85rem" }}
                          placeholder="Caption for this image"
                          value={perFileCaptions[idx] || ""}
                          onChange={(e) => {
                            const next = [...perFileCaptions];
                            next[idx] = e.target.value;
                            setPerFileCaptions(next);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Album</span>
                <select
                  className="form-input"
                  {...register("album_id")}
                >
                  <option value="">(No album)</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Album Dialog */}
      {showAlbumModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setShowAlbumModal(false)}
        >
          <div
            className="glass-surface"
            style={{ maxWidth: "480px", width: "100%", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>New Album</h3>
            <form
              id="new-album-form"
              onSubmit={createAlbum}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Title</span>
                <input name="title" className="form-input" placeholder="Album title" required />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Date</span>
                <input name="date" type="date" className="form-input" />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowAlbumModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create Album
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Album Dialog */}
      {showEditAlbumModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setShowEditAlbumModal(false)}
        >
          <div
            className="glass-surface"
            style={{ maxWidth: "480px", width: "100%", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>Edit Album</h3>
            <form
              id="edit-album-form"
              onSubmit={submitEditAlbum}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Title</span>
                <input
                  name="title"
                  className="form-input"
                  defaultValue={albumEditing?.title || ""}
                  required
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Date</span>
                <input
                  name="date"
                  type="date"
                  className="form-input"
                  defaultValue={albumEditing?.date ? new Date(albumEditing.date).toISOString().slice(0, 10) : ""}
                />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowEditAlbumModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Image Dialog */}
      {!!editItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setEditItem(null)}
        >
          <div
            className="glass-surface"
            style={{ maxWidth: "720px", width: "100%", borderRadius: "1rem", padding: "1.25rem 1.5rem" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginBottom: "0.75rem" }}>Edit Image</h3>
            <form
              id="edit-image-form"
              onSubmit={submitEdit}
              style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
            >
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Caption</span>
                <input
                  name="caption"
                  className="form-input"
                  defaultValue={editItem?.caption || ""}
                />
              </label>
              <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span style={{ fontSize: "0.9rem" }}>Album</span>
                <select
                  name="album_id"
                  className="form-input"
                  defaultValue={editItem?.album_id || ""}
                >
                  <option value="">(No album)</option>
                  {albums.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              </label>
              <label
                className="btn btn-outline"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  cursor: "pointer",
                }}
              >
                <span>Replace Picture</span>
                <input hidden type="file" name="picture" />
              </label>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" className="btn btn-outline" onClick={() => setEditItem(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
