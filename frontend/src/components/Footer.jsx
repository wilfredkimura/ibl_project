import { Link } from "react-router-dom";
import { Nav, Container } from "react-bootstrap";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container className="py-4">
        <div className="row">
          <div className="col-md-4 mb-3">
            <h5>YCS St. Dominic</h5>
            <p>
              Youth Serving Christ (YCS) at St. Dominic Catholic Church, St.
              Theresa Kalimoni Parish, is dedicated to fostering faith, service,
              and fellowship among the youth.
            </p>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Quick Links</h5>
            <Nav className="flex-column">
              <Nav.Link as={Link} to="/">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/leaders">
                Leaders
              </Nav.Link>
              <Nav.Link as={Link} to="/blog">
                Blog
              </Nav.Link>
              <Nav.Link as={Link} to="/events">
                Events
              </Nav.Link>
              <Nav.Link as={Link} to="/gallery">
                Gallery
              </Nav.Link>
            </Nav>
          </div>
          <div className="col-md-4 mb-3">
            <h5>Contact Us</h5>
            <p>
              St. Theresa Kalimoni Parish
              <br />
              Email: ycs.stdominic@example.com
              <br />
              Phone: +254 123 456 789
            </p>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <p>
            &copy; {new Date().getFullYear()} YCS St. Dominic Catholic Church.
            All rights reserved.
          </p>
        </div>
      </Container>
    </motion.footer>
  );
};

export default Footer;
