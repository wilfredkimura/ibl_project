import { useState, useEffect } from "react";
import axios from "axios";
import { Card, Row, Col, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get("/api/events").then((res) => setEvents(res.data));
  }, []);

  const upcomingEvents = events.filter((event) => event.is_future);
  const pastEvents = events.filter((event) => !event.is_future);

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-4"
      >
        <h2>YCS Events at St. Dominic</h2>
        <p className="lead">
          Join Youth Serving Christ (YCS) at St. Dominic Catholic Church, St.
          Theresa Kalimoni Parish, for faith-filled events, including Masses,
          retreats, and community service, as we grow closer to Christ together.
        </p>
      </motion.div>

      <h3 className="mt-5 mb-3">Upcoming Events</h3>
      <Row>
        {upcomingEvents.length > 0 ? (
          upcomingEvents.map((event, index) => (
            <Col md={4} key={event.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="fade-in"
              >
                <Card>
                  {event.picture_url ? (
                    <Card.Img
                      variant="top"
                      src={event.picture_url}
                      alt={event.title}
                    />
                  ) : (
                    <Card.Img
                      variant="top"
                      src="https://via.placeholder.com/200?text=YCS+Event"
                      alt="Placeholder"
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{event.title || "Upcoming Event"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(event.date).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>
                      {event.description || "Join us for a faith-filled event!"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No upcoming events. Stay tuned for more YCS activities!</p>
          </Col>
        )}
      </Row>

      <h3 className="mt-5 mb-3">Past Events</h3>
      <Row>
        {pastEvents.length > 0 ? (
          pastEvents.map((event, index) => (
            <Col md={4} key={event.id} className="mb-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="fade-in"
              >
                <Card>
                  {event.picture_url ? (
                    <Card.Img
                      variant="top"
                      src={event.picture_url}
                      alt={event.title}
                    />
                  ) : (
                    <Card.Img
                      variant="top"
                      src="https://via.placeholder.com/200?text=YCS+Event"
                      alt="Placeholder"
                    />
                  )}
                  <Card.Body>
                    <Card.Title>{event.title || "Past Event"}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {new Date(event.date).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>
                      {event.description || "Relive our faith-filled moments!"}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          ))
        ) : (
          <Col>
            <p>No past events yet. Join us for future YCS events!</p>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Events;
