import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function GalleryAlbums() {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/albums");
        setAlbums(res.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="container" style={{ padding: "2rem 1.5rem", maxWidth: "960px" }}>
      <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
        <h2 style={{ marginBottom: "0.5rem" }}>YCS Gallery</h2>
        <p style={{ maxWidth: "60rem", margin: "0 auto", opacity: 0.85 }}>
          Select an album to view photos. You can also view ungrouped photos.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div
          className="card glass-surface"
          style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
          onClick={() => navigate('/gallery/ungrouped')}
        >
          <div className="card-body">
            <h3 className="card-title" style={{ marginBottom: "0.25rem" }}>Ungrouped Photos</h3>
            <p className="card-text" style={{ fontSize: "0.9rem", opacity: 0.85 }}>
              Photos without an album
            </p>
          </div>
        </div>

        {loading && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "2rem 0", opacity: 0.8 }}>
            Loading albums…
          </div>
        )}

        {(albums || []).map((album) => (
          <div
            key={album.id}
            className="card glass-surface"
            style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
            onClick={() => navigate(`/gallery/album/${album.id}`)}
          >
            <img
              src={album.cover_url || "https://via.placeholder.com/600x300?text=Album+Cover"}
              alt={album.title}
              style={{ width: "100%", height: 180, objectFit: "cover" }}
            />
            <div className="card-body">
              <h3 className="card-title" style={{ marginBottom: "0.25rem" }}>{album.title}</h3>
              <small className="text-muted" style={{ display: "block" }}>
                {album.date && new Date(album.date).toLocaleDateString()}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
