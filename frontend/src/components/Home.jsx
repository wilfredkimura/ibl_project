import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const Home = () => {
  return (
    <Container className="py-5">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-5"
      >
        <h1>Welcome to YCS St. Dominic</h1>
        <p className="lead">
          Join our vibrant Youth Serving Christ community at St. Dominic
          Catholic Church, St. Theresa Kalimoni Parish.
        </p>
      </motion.div>
      <Row>
        <Col md={4} className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LazyLoadImage
              src="/images/ycs-prayer.png"
              alt="Prayer"
              effect="blur"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              placeholderSrc="/images/placeholder.png"
            />
            <h3>Prayer</h3>
            <p>Deepen your faith through our prayer sessions.</p>
          </motion.div>
        </Col>
        <Col md={4} className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LazyLoadImage
              src="/images/ycs-service.png"
              alt="Service"
              effect="blur"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              placeholderSrc="/images/placeholder.png"
            />
            <h3>Service</h3>
            <p>Serve the community with love and compassion.</p>
          </motion.div>
        </Col>
        <Col md={4} className="mb-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LazyLoadImage
              src="/images/ycs-fellowship.png"
              alt="Fellowship"
              effect="blur"
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              placeholderSrc="/images/placeholder.png"
            />
            <h3>Fellowship</h3>
            <p>Build lifelong bonds in our YCS community.</p>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
