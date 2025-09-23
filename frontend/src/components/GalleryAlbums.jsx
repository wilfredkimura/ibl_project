import { useEffect, useState } from "react";
import { Container, Grid, Card, CardActionArea, CardContent, CardMedia, Typography, Stack, CircularProgress } from "@mui/material";
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
    <Container maxWidth="md">
      <Stack spacing={1} sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h4">YCS Gallery</Typography>
        <Typography variant="body1" color="text.secondary">
          Select an album to view photos. You can also view ungrouped photos.
        </Typography>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item md={4} sm={6} xs={12}>
          <Card>
            <CardActionArea onClick={() => navigate('/gallery/ungrouped')}>
              <CardContent>
                <Typography variant="h6">Ungrouped Photos</Typography>
                <Typography variant="body2" color="text.secondary">Photos without an album</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <Stack alignItems="center" sx={{ my: 4 }}>
              <CircularProgress />
            </Stack>
          </Grid>
        )}

        {(albums || []).map((album) => (
          <Grid item md={4} sm={6} xs={12} key={album.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/gallery/album/${album.id}`)}>
                <CardMedia
                  component="img"
                  sx={{ height: { xs: 140, sm: 180 } }}
                  image={album.cover_url || "https://via.placeholder.com/600x300?text=Album+Cover"}
                  alt={album.title}
                />
                <CardContent>
                  <Typography variant="h6">{album.title}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {album.date && new Date(album.date).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
