import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Leaders = () => {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    axios.get("/api/leaders").then((res) => setLeaders(res.data));
  }, []);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2>Meet Our YCS Leaders</h2>
        <p className="lead">
          Our dedicated Youth Serving Christ (YCS) leaders at St. Dominic
          Catholic Church, St. Theresa Kalimoni Parish, guide our youth in
          faith, service, and community, inspiring all to live for Christ.
        </p>
      </motion.div>
      <Row>
        {leaders.length === 0 ? (
          <Col>
            <p>No leaders to display yet. Check back soon to meet our YCS leaders.</p>
          </Col>
        ) : (
          leaders.map((leader, index) => (
            <Col md={4} key={leader.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="fade-in"
              >
              <Card>
                {leader.picture_url ? (
                  <Card.Img
                    variant="top"
                    src={leader.picture_url}
                    alt={leader.name}
                  />
                ) : (
                  <Card.Img
                    variant="top"
                    src="https://via.placeholder.com/200?text=YCS+Leader"
                    alt="Placeholder"
                  />
                )}
                <Card.Body>
                  <Card.Title>{leader.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {leader.position || "YCS Leader"}
                  </Card.Subtitle>
                  <Card.Text>
                    {leader.bio || "Guiding our youth in faith and service."}
                  </Card.Text>
                </Card.Body>
              </Card>
              </motion.div>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default Leaders;
