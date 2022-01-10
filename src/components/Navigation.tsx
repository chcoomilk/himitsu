import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PATHS } from "../utils/constants";

const Navigation = () => {
  return (
    <Navbar collapseOnSelect variant="dark" sticky="top" className="fs-3">
      <Container>
        <Navbar.Brand className="fs-3">
          <Nav>
            <Nav.Link
              as={NavLink}
              to={PATHS.home}
            >
              <i className="bi bi-box-arrow-left"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end text-white">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link
              as={NavLink}
              to={PATHS.about}
            >
              <i className="bi bi-hash"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar >
  );
};

export default Navigation;
