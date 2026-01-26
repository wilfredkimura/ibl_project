import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Link as RouterLink } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/blog").then((res) => setBlogs(res.data || []));
    axios.get("/api/gallery").then((res) => setImages(res.data || []));
    axios.get("/api/events").then((res) => setEvents(res.data || []));
  }, []);

  const upcoming = [...events]
    .filter((e) => e.is_future)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <section
          style={{
            position: "relative",
            minHeight: 320,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/images/ysc-hero.jpeg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="container" style={{ maxWidth: "720px", padding: "2.5rem 1.75rem", color: "#e8dfd4" }}>
            <div style={{ marginBottom: "0.75rem" }}>
              <div className="academia-label">Volume I</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Welcome to YCS St. Dominic</h2>
            </div>
            <p className="dropcap-intro" style={{ marginBottom: "1.25rem" }}>
              Youth Serving Christ at St. Dominic Catholic Church, St. Theresa Kalimoni Parish. Grow in faith, serve in love.
            </p>
            <div className="ornate-divider" aria-hidden="true" />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginTop: "1rem",
              }}
            >
              <RouterLink to="/events" className="btn btn-secondary">
                See Events
              </RouterLink>
              <RouterLink to="/register" className="btn btn-primary">
                Join Us
              </RouterLink>
            </div>
          </div>
        </section>
      </motion.div>

      <div className="container" style={{ padding: "2rem 1.5rem" }}>
        {/* Blog Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
        >
          <div style={{ marginBottom: "0.75rem" }}>
            <div className="academia-label">Volume II</div>
            <h3 style={{ marginBottom: "0.25rem" }}>Latest Reflections</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>From our blog</p>
            <div className="ornate-divider" aria-hidden="true" />
          </div>
        </motion.div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={1}
          autoplay={{ delay: 4000 }}
          breakpoints={{ 600: { slidesPerView: 2 } }}
          navigation
          pagination={{ clickable: true }}
          style={{ paddingBottom: 24 }}
        >
          {(blogs || []).slice(0, 8).map((b) => (
            <SwiperSlide key={b.id}>
              <RouterLink
                to={`/blog/${b.id}`}
                className="card glass-surface"
                style={{ textDecoration: "none", overflow: "hidden" }}
              >
                <div className="arch-top" style={{ height: 180 }}>
                  <img
                    src={b.picture_url || "https://via.placeholder.com/600x300?text=YCS+Blog"}
                    alt={b.title}
                    className="academia-photo"
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {b.title || "Untitled"}
                  </h5>
                  <small className="text-muted">
                    {b.date ? new Date(b.date).toLocaleDateString() : ""}
                  </small>
                </div>
              </RouterLink>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gallery Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
        >
          <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
            <div className="academia-label">Volume III</div>
            <h3 style={{ marginBottom: "0.25rem" }}>Moments from Our Gallery</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Recent photos</p>
            <div className="ornate-divider" aria-hidden="true" />
          </div>
        </motion.div>
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={12}
          slidesPerView={2}
          autoplay={{ delay: 3500 }}
          breakpoints={{ 600: { slidesPerView: 3 } }}
          navigation
          pagination={{ clickable: true }}
          style={{ paddingBottom: 24 }}
        >
          {(images || []).slice(0, 12).map((img) => (
            <SwiperSlide key={img.id}>
              <div className="card glass-surface" style={{ overflow: "hidden" }}>
                <div className="arch-top" style={{ height: 160 }}>
                  <img
                    src={img.picture_url || "https://via.placeholder.com/300?text=YCS+Photo"}
                    alt={img.caption || "YCS"}
                    className="academia-photo"
                  />
                </div>
                {img.caption && (
                  <div className="card-body">
                    <p
                      className="card-text"
                      style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {img.caption}
                    </p>
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
        >
          <div style={{ marginTop: "2rem", marginBottom: "0.75rem" }}>
            <div className="academia-label">Volume IV</div>
            <h3 style={{ marginBottom: "0.25rem" }}>Upcoming Events</h3>
            <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>Don't miss what's next</p>
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
          {upcoming.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", opacity: 0.7 }}>
              No upcoming events at the moment.
            </div>
          ) : (
            upcoming.map((event) => (
              <div key={event.id} className="card glass-surface" style={{ overflow: "hidden" }}>
                <div className="arch-top" style={{ height: 180 }}>
                  <img
                    src={event.picture_url || "https://via.placeholder.com/400x200?text=YCS+Event"}
                    alt={event.title}
                    className="academia-photo"
                  />
                </div>
                <div className="card-body">
                  <h5
                    className="card-title"
                    style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {event.title || "YCS Event"}
                  </h5>
                  <small className="text-muted" style={{ display: "block", marginBottom: "0.5rem" }}>
                    {event.date ? new Date(event.date).toLocaleDateString() : ""}
                  </small>
                  <RouterLink to="/events" className="btn btn-primary btn-sm">
                    View all events
                  </RouterLink>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
