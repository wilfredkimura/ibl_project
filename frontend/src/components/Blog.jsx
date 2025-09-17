import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios.get("/api/blog").then((res) => setBlogs(res.data));
  }, []);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2>YCS Reflections</h2>
        <p className="lead">
          Explore reflections, testimonies, and insights from our Youth Serving
          Christ (YCS) community at St. Dominic Catholic Church, St. Theresa
          Kalimoni Parish, as we grow in faith together.
        </p>
      </motion.div>
      <Row>
        {blogs.map((blog, index) => (
          <Col md={6} key={blog.id} className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="fade-in"
            >
              <Card>
                {blog.picture_url ? (
                  <Card.Img
                    variant="top"
                    src={blog.picture_url}
                    alt={blog.title}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/300?text=YCS+Blog"
                    alt="Placeholder"
                  />
                )}
                <Card.Body>
                  <Card.Title>{blog.title || "Untitled Post"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(blog.date).toLocaleDateString()}
                  </Card.Subtitle>
                  <Card.Text>
                    {blog.content || "Discover our latest reflections!"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blog;
