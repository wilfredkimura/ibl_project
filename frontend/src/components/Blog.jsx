import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/blog").then((res) => setBlogs(res.data));
  }, []);

  // Open modal if /blog/:id is present and blogs are loaded
  useEffect(() => {
    if (!blogs.length) return;
    if (id) {
      const idx = blogs.findIndex((b) => String(b.id) === String(id));
      if (idx !== -1) {
        setSelectedBlog(blogs[idx]);
        setSelectedIndex(idx);
      }
    } else {
      setSelectedBlog(null);
      setSelectedIndex(-1);
    }
  }, [id, blogs]);

  const truncateWords = (text = "", maxWords = 100) => {
    const words = String(text).trim().split(/\s+/);
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "…";
  };

  const stripHtml = (html = "") => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const openBlog = (blog, index) => {
    setSelectedBlog(blog);
    setSelectedIndex(index);
    navigate(`/blog/${blog.id}`);
  };

  const closeBlog = () => {
    setSelectedBlog(null);
    setSelectedIndex(-1);
    navigate(`/blog`);
  };

  const goPrev = () => {
    if (!blogs.length) return;
    const nextIndex = (selectedIndex - 1 + blogs.length) % blogs.length;
    setSelectedIndex(nextIndex);
    setSelectedBlog(blogs[nextIndex]);
    navigate(`/blog/${blogs[nextIndex].id}`);
  };

  const goNext = () => {
    if (!blogs.length) return;
    const nextIndex = (selectedIndex + 1) % blogs.length;
    setSelectedIndex(nextIndex);
    setSelectedBlog(blogs[nextIndex]);
    navigate(`/blog/${blogs[nextIndex].id}`);
  };

  // Keyboard navigation when modal is open
  useEffect(() => {
    if (!selectedBlog) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "Escape") closeBlog();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedBlog, selectedIndex, blogs]);

  return (
    <div className="container section-centered" style={{ padding: "2rem 1.5rem", maxWidth: "840px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div className="academia-label">Volume V</div>
          <h2 style={{ marginBottom: "0.5rem" }}>YCS Reflections</h2>
          <p className="dropcap-intro" style={{ maxWidth: "48rem", margin: "0 auto", opacity: 0.9 }}>
            Explore reflections, testimonies, and insights from our Youth Serving Christ (YCS) community at St. Dominic Catholic Church,
            St. Theresa Kalimoni Parish, as we grow in faith together.
          </p>
          <div className="ornate-divider" aria-hidden="true" />
        </div>
      </motion.div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "1.25rem",
        }}
      >
        {blogs.length === 0 ? (
          <div style={{ gridColumn: "1 / -1", opacity: 0.7, textAlign: "center" }}>
            No blog posts yet. Discover our latest reflections!
          </div>
        ) : (
          blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card glass-surface"
              style={{ overflow: "hidden", cursor: "pointer", display: "flex", flexDirection: "column" }}
              onClick={() => openBlog(blog, index)}
            >
              <div className="arch-top" style={{ height: 180 }}>
                <img
                  src={blog.picture_url || "https://via.placeholder.com/600x300?text=YCS+Blog"}
                  alt={blog.title}
                  className="academia-photo"
                />
              </div>
              <div className="card-body" style={{ flex: 1 }}>
                <h3
                  className="card-title"
                  style={{
                    fontSize: "1.1rem",
                    marginBottom: "0.25rem",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {blog.title || "Untitled Post"}
                </h3>
                <small className="text-muted" style={{ display: "block", marginBottom: "0.5rem" }}>
                  {blog.date && new Date(blog.date).toLocaleDateString()}
                </small>
                <p
                  className="card-text"
                  style={{ fontSize: "0.9rem", opacity: 0.85 }}
                >
                  {truncateWords(stripHtml(blog.content || "Discover our latest reflections!"), 60)}
                </p>
              </div>
              <div
                style={{
                  padding: "0.5rem 1rem 0.9rem",
                  display: "flex",
                  justifyContent: "flex-end",
                  fontSize: "0.75rem",
                  opacity: 0.7,
                }}
              >
                Read more 
              </div>
            </motion.div>
          ))
        )}
      </div>

      {selectedBlog && (
        <div
          className="blog-modal-overlay"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem 1rem",
            background: "rgba(0,0,0,0.75)",
          }}
          onClick={closeBlog}
        >
          <div
            className="glass-surface"
            style={{
              maxWidth: "900px",
              width: "100%",
              maxHeight: "100%",
              overflow: "auto",
              borderRadius: "1rem",
              padding: "1.25rem 1.5rem 1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <header style={{ marginBottom: "0.75rem" }}>
              <div className="academia-label">Volume V</div>
              <h2 style={{ marginBottom: "0.25rem" }}>{selectedBlog?.title || "Untitled Post"}</h2>
              <small className="text-muted">
                {selectedBlog?.date && new Date(selectedBlog.date).toLocaleString()}
              </small>
              <div className="ornate-divider" aria-hidden="true" />
            </header>
            <div style={{ marginBottom: "1rem" }}>
              {selectedBlog?.picture_url && (
                <div className="arch-top" style={{ maxHeight: 400, marginBottom: "1rem" }}>
                  <img
                    src={selectedBlog.picture_url}
                    alt={selectedBlog.title}
                    className="academia-photo"
                    style={{ maxHeight: 400, objectFit: "cover" }}
                  />
                </div>
              )}
              <div
                className="dropcap-intro"
                style={{ lineHeight: 1.7, fontSize: "1.02rem" }}
                dangerouslySetInnerHTML={{ __html: selectedBlog?.content || "" }}
              />
            </div>
            <footer
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  const url = window.location.origin + `/blog/${selectedBlog?.id}`;
                  navigator.clipboard.writeText(url);
                }}
              >
                Copy link
              </button>
              <button type="button" className="btn" onClick={closeBlog}>
                Close
              </button>
              <button type="button" className="btn" onClick={goPrev}>
                 Prev
              </button>
              <button type="button" className="btn btn-primary" onClick={goNext}>
                Next 
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
