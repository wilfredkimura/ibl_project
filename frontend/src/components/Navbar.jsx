import { useContext } from "react";
import { Link } from "react-router-dom";
import { Navbar as BSNavbar, Nav, Button, Image } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <BSNavbar expand="lg" className="mb-4 navbar-brown navbar-dark">
      <BSNavbar.Brand as={Link} to="/">
        <Image
          src="/images/ycs-placeholder.png"
          roundedCircle
          className="me-2"
          alt="YCS St. Dominic Logo"
        />
        YCS St. Dominic
        {user?.is_admin && <span className="admin-badge ms-2">Admin</span>}
      </BSNavbar.Brand>
      <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
      <BSNavbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
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
          {user && (
            <Nav.Link as={Link} to="/members">
              Members
            </Nav.Link>
          )}
          {user && (
            <Nav.Link as={Link} to="/profile">
              Profile
            </Nav.Link>
          )}
          {user && user.is_admin && (
            <Nav.Link as={Link} to="/admin">
              Admin Dashboard
            </Nav.Link>
          )}
        </Nav>
        <Nav>
          {user ? (
            <Button variant="outline-light" onClick={logout}>
              Logout
            </Button>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </BSNavbar.Collapse>
    </BSNavbar>
  );
};

export default Navbar;
