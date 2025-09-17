import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Grid, Typography, Box, Stack, Button, Card, CardMedia, CardContent } from "@mui/material";
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
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: { xs: 280, sm: 380 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          textAlign: "center",
          backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(/images/ycs-hero.jpeg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 1 }}>Welcome to YCS St. Dominic</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Youth Serving Christ at St. Dominic Catholic Church, St. Theresa Kalimoni Parish. Grow in faith, serve in love.
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Button component={RouterLink} to="/events" variant="contained" color="secondary">See Events</Button>
            <Button component={RouterLink} to="/register" variant="outlined" color="inherit">Join Us</Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Blog Carousel */}
        <Stack spacing={1} sx={{ mb: 2 }}>
          <Typography variant="h5">Latest Reflections</Typography>
          <Typography variant="body2" color="text.secondary">From our blog</Typography>
        </Stack>
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
              <Card component={RouterLink} to={`/blog/${b.id}`} sx={{ textDecoration: 'none' }}>
                <CardMedia component="img" sx={{ height: { xs: 140, sm: 180 } }} image={b.picture_url || "https://via.placeholder.com/600x300?text=YCS+Blog"} alt={b.title} />
                <CardContent>
                  <Typography variant="h6" noWrap>{b.title || "Untitled"}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {b.date ? new Date(b.date).toLocaleDateString() : ''}
                  </Typography>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Gallery Carousel */}
        <Stack spacing={1} sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h5">Moments from Our Gallery</Typography>
          <Typography variant="body2" color="text.secondary">Recent photos</Typography>
        </Stack>
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
              <Card>
                <CardMedia component="img" sx={{ height: { xs: 120, sm: 160 } }} image={img.picture_url || "https://via.placeholder.com/300?text=YCS+Photo"} alt={img.caption || "YCS"} />
                {img.caption && (
                  <CardContent>
                    <Typography variant="body2" noWrap>{img.caption}</Typography>
                  </CardContent>
                )}
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Upcoming Events */}
        <Stack spacing={1} sx={{ mt: 4, mb: 2 }}>
          <Typography variant="h5">Upcoming Events</Typography>
          <Typography variant="body2" color="text.secondary">Don’t miss what’s next</Typography>
        </Stack>
        <Grid container spacing={2}>
          {upcoming.length === 0 ? (
            <Grid item xs={12}><Typography color="text.secondary">No upcoming events at the moment.</Typography></Grid>
          ) : (
            upcoming.map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event.id}>
                <Card>
                  <CardMedia component="img" sx={{ height: { xs: 140, sm: 180 } }} image={event.picture_url || "https://via.placeholder.com/400x200?text=YCS+Event"} alt={event.title} />
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>{event.title || "YCS Event"}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {event.date ? new Date(event.date).toLocaleDateString() : ''}
                    </Typography>
                    <Button component={RouterLink} to="/events" size="small">View all events</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
