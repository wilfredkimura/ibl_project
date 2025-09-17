import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4">YCS Reflections</Typography>
          <Typography variant="body1" color="text.secondary">
            Explore reflections, testimonies, and insights from our Youth Serving Christ (YCS) community at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, as we grow in faith together.
          </Typography>
        </Stack>
      </motion.div>
      <Grid container spacing={2}>
        {blogs.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No blog posts yet. Discover our latest reflections!</Typography>
          </Grid>
        ) : (
          blogs.map((blog, index) => (
            <Grid item md={6} xs={12} key={blog.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardActionArea onClick={() => openBlog(blog, index)}>
                    <CardMedia
                      component="img"
                      sx={{ height: { xs: 140, sm: 180 } }}
                      image={blog.picture_url || "https://via.placeholder.com/600x300?text=YCS+Blog"}
                      alt={blog.title}
                    />
                    <CardContent>
                      <Typography variant="h6">{blog.title || "Untitled Post"}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {new Date(blog.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {truncateWords(stripHtml(blog.content || "Discover our latest reflections!"), 100)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardContent sx={{ pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                    <Typography variant="caption" color="text.secondary">Read more →</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
      <Dialog open={!!selectedBlog} onClose={closeBlog} fullScreen>
        <DialogTitle>
          {selectedBlog?.title || "Untitled Post"}
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {selectedBlog?.date && new Date(selectedBlog.date).toLocaleString()}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          {selectedBlog?.picture_url && (
            <img src={selectedBlog.picture_url} alt={selectedBlog.title} style={{ width: '100%', maxHeight: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
          )}
          <div style={{ lineHeight: 1.7, fontSize: '1.05rem' }} dangerouslySetInnerHTML={{ __html: selectedBlog?.content || '' }} />
        </DialogContent>
        <DialogActions sx={{ flexWrap: isSmall ? 'wrap' : 'nowrap', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => {
              const url = window.location.origin + `/blog/${selectedBlog?.id}`;
              navigator.clipboard.writeText(url);
            }}
          >
            Copy link
          </Button>
          <Button fullWidth={isSmall} onClick={closeBlog}>Close</Button>
          <Button fullWidth={isSmall} onClick={goPrev}>← Prev</Button>
          <Button fullWidth={isSmall} variant="contained" onClick={goNext}>Next →</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Blog;
