import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Container,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";

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
    <Container maxWidth="md">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Stack spacing={1} sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4">YCS Gallery</Typography>
          <Typography variant="body1" color="text.secondary">
            Explore moments from Youth Serving Christ (YCS) activities at St. Dominic Catholic Church, St. Theresa Kalimoni Parish, including Masses, retreats, and community service.
          </Typography>
        </Stack>
      </motion.div>

      {/* Album grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {/* Ungrouped pseudo-album */}
        <Grid item md={4} sm={6} xs={12}>
          <Card>
            <CardActionArea onClick={openUngrouped}>
              <CardContent>
                <Typography variant="h6">Ungrouped Photos</Typography>
                <Typography variant="body2" color="text.secondary">Photos without an album</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        {albums.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No albums yet. Check back soon.</Typography>
          </Grid>
        ) : (
          albums.map((album, index) => (
            <Grid item md={4} sm={6} xs={12} key={album.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardActionArea onClick={() => openAlbum(album)}>
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
                      <Stack direction="row" justifyContent="space-between" mt={1}>
                        <Typography variant="caption" color="text.secondary">
                          {album.photo_count ?? 0} {Number(album.photo_count) === 1 ? "photo" : "photos"}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">View →</Typography>
                      </Stack>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))
        )}
      </Grid>

      {/* Expanded album view */}
      {selectedAlbum && (
        <Stack spacing={2}>
          <Typography variant="h5">
            {selectedAlbum === "ungrouped" ? "Ungrouped Photos" : selectedAlbum.title}
          </Typography>
          {loadingAlbumId === (selectedAlbum === "ungrouped" ? "ungrouped" : selectedAlbum.id) ? (
            <Stack alignItems="center" sx={{ my: 4 }}>
              <CircularProgress />
            </Stack>
          ) : (
            <Grid container spacing={2}>
              {(selectedAlbum === "ungrouped" ? ungroupedImages || [] : albumImages[selectedAlbum.id] || []).map((img, idx) => (
                <Grid item md={3} sm={4} xs={6} key={img.id}>
                  <Card>
                    <CardActionArea onClick={() => { setCurrentIndex(idx); setViewerOpen(true); }}>
                      <CardMedia
                        component="img"
                        sx={{ height: { xs: 140, sm: 180 } }}
                        image={img.picture_url || "https://via.placeholder.com/300?text=YCS+Activity"}
                        alt={img.caption || "YCS Activity"}
                      />
                      <CardContent>
                        <Typography variant="body2" textAlign="center">
                          {img.caption || "A moment from YCS at St. Dominic"}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={() => setSelectedAlbum(null)}>
              Close album
            </Button>
          </Stack>
        </Stack>
      )}

      {/* Fullscreen viewer */}
      <Dialog open={viewerOpen} onClose={() => setViewerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, bgcolor: "black" }}>
          {(() => {
            const list = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
            const item = list[currentIndex];
            if (!item) return null;
            return (
              <img
                src={item.picture_url || "https://via.placeholder.com/1200x800?text=YCS+Activity"}
                alt={item.caption || "YCS Activity"}
                style={{ width: "100%", height: "80vh", objectFit: "contain" }}
              />
            );
          })()}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex <= 0}
          >
            Previous
          </Button>
          <Typography variant="body2" sx={{ flex: 1, textAlign: "center", px: 2 }}>
            {(() => {
              const list = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
              const item = list[currentIndex];
              return item?.caption || "";
            })()}
          </Typography>
          <Button
            onClick={() => {
              const list = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
              setCurrentIndex((i) => Math.min(list.length - 1, i + 1));
            }}
            disabled={(() => {
              const list = selectedAlbum === "ungrouped" ? (ungroupedImages || []) : (albumImages[selectedAlbum?.id] || []);
              return currentIndex >= list.length - 1;
            })()}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Gallery;
