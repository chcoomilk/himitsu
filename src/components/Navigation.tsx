import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { PATHS } from "../utils/constants";

type NavLinkReturnArgs = {
  isActive: boolean,
  isPending: boolean,
}

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
              to={PATHS.about}
            >
              <i className="bi bi-hash"></i>
            </Nav.Link>
          </Nav>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="text-white">
          <Nav className="me-auto">
            <Nav.Link
              title="Tell a secret"
              aria-label="Go write a new secret"
              className="py-0 fs-3 d-flex align-items-center"
              as={NavLink}
              to={PATHS.new_note}
              tabIndex={-1}
              end
            >
              { /* @ts-ignore */
                ({ isActive }: NavLinkReturnArgs) => (
                  <Button className="px-3" variant={isActive ? "success" : "outline-success"} size="sm">
                    <i className="bi bi-plus-lg" />
                    {" "}
                    <span className="d-none d-md-inline text-uppercase">
                      Add
                    </span>
                  </Button>
                )
              }
            </Nav.Link>
            <Nav.Link
              title="Find some dude's secret"
              aria-label="Go to find page"
              className="py-0 fs-3 d-flex align-items-center"
              as={NavLink}
              to={PATHS.find_note}
              tabIndex={-1}
            >
              { /* @ts-ignore */
                ({ isActive }: NavLinkReturnArgs) => (
                  <Button className="px-3" variant={isActive ? "primary" : "outline-primary"} size="sm">
                    <i className="bi bi-search" />
                    {" "}
                    <span className="d-none d-md-inline text-uppercase">
                      Find
                    </span>
                  </Button>
                )
              }
            </Nav.Link>
          </Nav>
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
