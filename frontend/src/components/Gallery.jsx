import { useState, useEffect } from "react";
import axios from "axios";
import { Row, Col, Image, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Gallery = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios.get("/api/gallery").then((res) => setImages(res.data));
  }, []);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2>YCS Gallery</h2>
        <p className="lead">
          Explore moments from Youth Serving Christ (YCS) activities at St.
          Dominic Catholic Church, St. Theresa Kalimoni Parish, including
          Masses, retreats, and community service.
        </p>
      </motion.div>
      <Row className="g-3">
        {images.map((img, index) => (
          <Col md={3} key={img.id} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="fade-in"
            >
              <Image
                src={
                  img.picture_url ||
                  "https://via.placeholder.com/300?text=YCS+Activity"
                }
                thumbnail
                alt={img.caption || "YCS Activity"}
                className="w-100"
              />
              <p className="text-center mt-2">
                {img.caption || "A moment from YCS at St. Dominic"}
              </p>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Gallery;
