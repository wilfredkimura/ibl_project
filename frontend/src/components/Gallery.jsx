import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Gallery = () => {
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState({}); // id -> images[]
  const [loadingAlbumId, setLoadingAlbumId] = useState(null);
  const [ungroupedImages, setUngroupedImages] = useState(null);

  // Fullscreen viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      const res = await axios.get("/api/albums");
      setAlbums(res.data);
    };
    load();
  }, []);

  const openAlbum = async (album) => {
    if (selectedAlbum && selectedAlbum.id === album.id) {
      setSelectedAlbum(null);
      return;
    }
    setSelectedAlbum(album);
    if (!albumImages[album.id]) {
      setLoadingAlbumId(album.id);
      const res = await axios.get(`/api/albums/${album.id}/images`);
      setAlbumImages((prev) => ({ ...prev, [album.id]: res.data }));
      setLoadingAlbumId(null);
    }
  };

  const openUngrouped = async () => {
    if (selectedAlbum === "ungrouped") {
      setSelectedAlbum(null);
      return;
    }
    setSelectedAlbum("ungrouped");
    if (!ungroupedImages) {
      setLoadingAlbumId("ungrouped");
      const res = await axios.get("/api/gallery");
      const imgs = res.data.filter((i) => !i.album_id);
      setUngroupedImages(imgs);
      setLoadingAlbumId(null);
    }
  };

  return (
    <div className="container section-centered" style={{ padding: "2rem 1.5rem", maxWidth: "960px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div className="academia-label">Volume VI</div>
          <h2 style={{ marginBottom: "0.5rem" }}>YCS Gallery</h2>
          <p className="dropcap-intro" style={{ maxWidth: "48rem", margin: "0 auto", opacity: 0.9 }}>
            Explore moments from Youth Serving Christ (YCS) activities at St. Dominic Catholic Church, St. Theresa Kalimoni Parish,
            including Masses, retreats, and community service.
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>

      {/* Album grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        {/* Ungrouped pseudo-album */}
        <div
          className="card glass-surface ornate-frame"
          style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
          onClick={openUngrouped}
        >
          <div className="card-body">
            <h3 className="card-title" style={{ marginBottom: "0.25rem" }}>Ungrouped Photos</h3>
            <p className="card-text" style={{ fontSize: "0.9rem", opacity: 0.85 }}>
              Photos without an album
            </p>
          </div>
        </div>

        {albums.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
            No albums yet. Check back soon.
          </div>
        ) : (
          albums.map((album, index) => (
            <motion.div
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card glass-surface ornate-frame"
              style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
              onClick={() => openAlbum(album)}
            >
              <div className="arch-top" style={{ height: 180 }}>
                <img
                  src={album.cover_url || "https://via.placeholder.com/600x300?text=Album+Cover"}
                  alt={album.title}
                  className="academia-photo"
                />
              </div>
              <div className="card-body">
                <h3 className="card-title" style={{ marginBottom: "0.25rem" }}>{album.title}</h3>
                <small className="text-muted" style={{ display: "block", marginBottom: "0.35rem" }}>
                  {album.date && new Date(album.date).toLocaleDateString()}
                </small>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    opacity: 0.8,
                  }}
                >
                  <span>
                    {album.photo_count ?? 0} {Number(album.photo_count) === 1 ? "photo" : "photos"}
                  </span>
                  <span>View </span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Expanded album view */}
      {selectedAlbum && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <div className="academia-label">Volume VI</div>
            <h3 style={{ marginBottom: "0.25rem" }}>
              {selectedAlbum === "ungrouped" ? "Ungrouped Photos" : selectedAlbum.title}
            </h3>
            <div className="ornate-divider" aria-hidden="true" />
          </div>
          {loadingAlbumId === (selectedAlbum === "ungrouped" ? "ungrouped" : selectedAlbum.id) ? (
            <div style={{ textAlign: "center", padding: "2rem 0", opacity: 0.8 }}>Loading photos…</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                gap: "1rem",
                marginBottom: "1rem",
              }}
            >
              {(selectedAlbum === "ungrouped" ? ungroupedImages || [] : albumImages[selectedAlbum.id] || []).map((img, idx) => (
                <div
                  key={img.id}
                  className="card glass-surface"
                  style={{ overflow: "hidden", cursor: "pointer" }}
                  onClick={() => { setCurrentIndex(idx); setViewerOpen(true); }}
                >
                  <div className="arch-top" style={{ height: 160 }}>
                    <img
                      src={img.picture_url || "https://via.placeholder.com/300?text=YCS+Activity"}
                      alt={img.caption || "YCS Activity"}
                      className="academia-photo"
                    />
                  </div>
                  <div className="card-body">
                    <p
                      className="card-text"
                      style={{ fontSize: "0.85rem", textAlign: "center" }}
                    >
                      {img.caption || "A moment from YCS at St. Dominic"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setSelectedAlbum(null)}
            >
              Close album
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen viewer */}
      {viewerOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
          }}
          onClick={() => setViewerOpen(false)}
        >
          <div
            className="glass-surface"
            style={{
              maxWidth: "960px",
              width: "100%",
              padding: "0.75rem 1rem 1rem",
              borderRadius: "1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const list = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
              const item = list[currentIndex];
              if (!item) return null;
              return (
                <>
                  <div style={{ background: "black", borderRadius: "0.75rem", overflow: "hidden" }}>
                    <img
                      src={item.picture_url || "https://via.placeholder.com/1200x800?text=YCS+Activity"}
                      alt={item.caption || "YCS Activity"}
                      style={{ width: "100%", height: "70vh", objectFit: "contain" }}
                    />
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "0.75rem",
                      gap: "0.75rem",
                    }}
                  >
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                      disabled={currentIndex <= 0}
                    >
                      Previous
                    </button>
                    <p style={{ flex: 1, textAlign: "center", margin: 0, fontSize: "0.9rem" }}>
                      {item.caption || ""}
                    </p>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        const listInner = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
                        setCurrentIndex((i) => Math.min(listInner.length - 1, i + 1));
                      }}
                      disabled={(() => {
                        const listInner = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
                        return currentIndex >= listInner.length - 1;
                      })()}
                    >
                      Next
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
