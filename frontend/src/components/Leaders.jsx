import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Container, Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";

const Leaders = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("/api/leaders").then((res) => setLeaders(res.data));
  }, []);

  return (
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Typography variant="h4">Meet Our YCS Leaders</Typography>
          <Typography variant="body1" color="text.secondary">
            Our dedicated Youth Serving Christ (YCS) leaders at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, guide our youth in faith, service, and community, inspiring all to live for Christ.
          </Typography>
        </div>
      </motion.div>
      <Grid container spacing={2}>
        {leaders.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No leaders to display yet. Check back soon to meet our YCS leaders.</Typography>
          </Grid>
        ) : (
          leaders.map((leader, index) => (
            <Grid item md={4} xs={12} key={leader.id}>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <Card>
                  <CardMedia
                    component="img"
                    sx={{ height: { xs: 140, sm: 200 } }}
                    image={leader.picture_url || "https://via.placeholder.com/200?text=YCS+Leader"}
                    alt={leader.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{leader.name}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                      {leader.position || "YCS Leader"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {leader.bio || "Guiding our youth in faith and service."}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
};

export default Leaders;
