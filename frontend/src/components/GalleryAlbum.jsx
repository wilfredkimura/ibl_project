import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GalleryAlbum({ ungrouped = false }) {
  const { id } = useParams();
  const [title, setTitle] = useState(ungrouped ? "Ungrouped Photos" : "Album");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Viewer state
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  // Zoom/pan state
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragRef = useRef({ dragging: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 });

  const current = items[index];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        if (ungrouped) {
          const g = await axios.get("/api/gallery");
          const imgs = (g.data || []).filter((i) => !i.album_id);
          setItems(imgs);
          setTitle("Ungrouped Photos");
        } else if (id) {
          try {
            const res = await axios.get(`/api/albums/${id}`);
            if (res.data?.title) setTitle(res.data.title);
          } catch {}
          try {
            const r2 = await axios.get(`/api/albums/${id}/images`);
            setItems(r2.data || []);
          } catch {
            const g = await axios.get(`/api/gallery?album_id=${id}`);
            setItems(g.data || []);
          }
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, ungrouped]);

  // Preload neighbors when viewer open or index changes
  useEffect(() => {
    if (!open || !items.length) return;
    const neighbors = [index - 1, index + 1].filter((i) => i >= 0 && i < items.length);
    neighbors.forEach((i) => {
      const src = items[i]?.picture_url;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [open, index, items]);

  // Keyboard navigation: Left/Right/Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight') {
        setIndex((i) => Math.min(items.length - 1, i + 1));
      } else if (e.key === 'Escape') {
        closeViewer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, items.length]);

  const openViewer = (i) => {
    setIndex(i);
    setOpen(true);
    resetZoom();
  };
  const closeViewer = () => {
    setOpen(false);
    resetZoom();
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(items.length - 1, i + 1));

  const resetZoom = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
    dragRef.current = { dragging: false, startX: 0, startY: 0, startOffsetX: 0, startOffsetY: 0 };
  };

  const onWheel = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = delta > 0 ? 1.1 : 0.9;
    setScale((s) => Math.min(5, Math.max(1, s * factor)));
  };

  const onMouseDown = (e) => {
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startOffsetX: offset.x,
      startOffsetY: offset.y,
    };
  };
  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (!d.dragging || scale <= 1) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    setOffset({ x: d.startOffsetX + dx, y: d.startOffsetY + dy });
  };
  const onMouseUp = () => { dragRef.current.dragging = false; };
  const onMouseLeave = () => { dragRef.current.dragging = false; };

  // touch handlers
  const touchStartRef = useRef({ x: 0, y: 0, ox: 0, oy: 0 });
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, ox: offset.x, oy: offset.y };
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 1 && scale > 1) {
      const dx = e.touches[0].clientX - touchStartRef.current.x;
      const dy = e.touches[0].clientY - touchStartRef.current.y;
      setOffset({ x: touchStartRef.current.ox + dx, y: touchStartRef.current.oy + dy });
    }
  };

  return (
    <Container maxWidth="lg">
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">{title}</Typography>
        <Button variant="outlined" href="/gallery">Back to Albums</Button>
      </Stack>

      {loading ? (
        <Stack alignItems="center" sx={{ my: 4 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <Grid container spacing={2}>
          {(items || []).map((img, i) => (
            <Grid item md={3} sm={4} xs={6} key={img.id}>
              <Card>
                <CardActionArea onClick={() => openViewer(i)}>
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

      <Dialog open={open} onClose={closeViewer} maxWidth="lg" fullWidth>
        <DialogActions sx={{ justifyContent: "space-between" }}>
          <Button onClick={() => { setIndex((i) => Math.max(0, i - 1)); resetZoom(); }} disabled={index <= items.length ? index <= 0 : true}>
            Previous
          </Button>
          <Stack sx={{ flex: 1, textAlign: 'center', px: 2 }}>
            <Typography variant="caption" color="text.secondary">{items.length ? `${index + 1} of ${items.length}` : ''}</Typography>
            <Typography variant="body2">{current?.caption || ""}</Typography>
          </Stack>
          <Button onClick={() => { setIndex((i) => Math.min(items.length - 1, i + 1)); resetZoom(); }} disabled={index >= items.length - 1}>
            Next
          </Button>
          <IconButton onClick={closeViewer} aria-label="close"><CloseIcon /></IconButton>
        </DialogActions>
        <DialogContent sx={{ p: 0, bgcolor: "black" }}>
          <div
            onWheel={onWheel}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            style={{ width: "100%", height: "80vh", overflow: "hidden", cursor: scale > 1 ? "grab" : "default" }}
          >
            {current && (
              <img
                src={current.picture_url || "https://via.placeholder.com/1200x800?text=YCS+Activity"}
                alt={current.caption || "YCS Activity"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: scale > 1 ? "cover" : "contain",
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
                  transition: dragRef.current.dragging ? "none" : "transform 0.1s ease-out",
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
