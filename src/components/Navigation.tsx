import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PATHS } from "../utils/constants";

const Navigation = () => {
  return (
    <Navbar variant="dark" sticky="top">
      <Container>
        <Navbar.Brand className="py-0 m-0">
          <Nav>
            <Nav.Link
              title="himitsu"
              aria-label="home"
              className="py-0 fs-3"
              as={NavLink}
              to={PATHS.home}
              active={false}
              end
            >
              <i className="bi bi-hash"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end text-white">
          <Nav className="me-auto" />
          <Nav>
            <Nav.Link
              title="Saved Notes"
              aria-label="saved notes"
              className="py-0 fs-3"
              as={NavLink}
              to={PATHS.notes}
            >
              <i className="bi bi-archive"></i>
            </Nav.Link>
          </Nav>
          <Nav className="ms-3">
            <Nav.Link
              title="Settings"
              aria-label="settings"
              className="py-0 fs-3"
              as={NavLink}
              to={PATHS.settings}
            >
              <i className="bi bi-gear"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
