import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Alert } from "react-bootstrap";
import { motion } from "framer-motion";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please log in to view members");
          return;
        }
        const res = await axios.get("/api/users/public", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(res.data);
        setError("");
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load members";
        setError(errorMessage);
        console.error("Error fetching members:", err.response?.data || err);
      }
    };
    fetchMembers();
  }, []);

  if (error)
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  if (!members.length)
    return (
      <Container>
        <div>Loading...</div>
      </Container>
    );

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2>YCS Members</h2>
        <p className="lead">
          Meet our vibrant Youth Serving Christ community at St. Dominic
          Catholic Church!
        </p>
      </motion.div>
      <Row>
        {members.map((member) => (
          <Col md={4} key={member.id} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={member.picture_url || "/images/ycs-member-placeholder.png"}
                alt={member.name}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{member.name || "YCS Member"}</Card.Title>
                <Card.Text>{member.bio || "A dedicated YCS member."}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Members;
