import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/events").then((res) => setEvents(res.data));
  }, []);

  const upcomingEvents = events.filter((event) => event.is_future);
  const pastEvents = events.filter((event) => !event.is_future);

  return (
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Typography variant="h4">YCS Events at St. Dominic</Typography>
          <Typography variant="body1" color="text.secondary">
            Join Youth Serving Christ (YCS) at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, for faith-filled events, including Masses, retreats, and community service, as we grow closer to Christ together.
          </Typography>
        </div>
      </motion.div>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Upcoming Events</Typography>
      <Grid container spacing={2}>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <Grid item md={4} xs={12} key={event.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardMedia component="img" sx={{ height: { xs: 140, sm: 180 } }} image={event.picture_url || "https://via.placeholder.com/200?text=YCS+Event"} alt={event.title} />
                  <CardContent>
                    <Typography variant="h6">{event.title || "Upcoming Event"}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{event.description || "Join us for a faith-filled event!"}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No upcoming events. Stay tuned for more YCS activities!</Typography>
          </Grid>
        )}
      </Grid>

      <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>Past Events</Typography>
      <Grid container spacing={2}>
        {pastEvents.length > 0 ? (
          pastEvents.map((event, index) => (
            <Grid item md={4} xs={12} key={event.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardMedia component="img" sx={{ height: { xs: 140, sm: 180 } }} image={event.picture_url || "https://via.placeholder.com/200?text=YCS+Event"} alt={event.title} />
                  <CardContent>
                    <Typography variant="h6">{event.title || "Past Event"}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {new Date(event.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">{event.description || "Relive our faith-filled moments!"}</Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography>No past events yet. Join us for future YCS events!</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default Events;
