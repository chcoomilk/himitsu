import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { NavLink } from "react-router-dom";
import useLongPress from "../custom-hooks/useLongPress";
import { PATHS } from "../utils/constants";

type NavLinkReturnArgs = {
  isActive: boolean,
  isPending: boolean,
}

const NavigationBar = () => {
  const longPressEventHandler = useLongPress(
    (e) => toast("Click to navigate to " + e.currentTarget.id + " page"),
    () => { },
    { shouldPreventDefault: false, delay: 500 }
  );

  return (
    <Navbar variant="dark" sticky="top">
      <Container>
        <Navbar.Brand className="py-0 m-0">
          <Nav>
            <Nav.Link
              id="about"
              title="himitsu"
              aria-label="about link"
              className="py-0 fs-3"
              {...longPressEventHandler}
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
              id="new note"
              title="Tell a secret"
              aria-label="new note link"
              className="p-0 mx-2 fs-3 d-flex align-items-center"
              {...longPressEventHandler}
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
              id="find note"
              title="Find some dude's secret"
              aria-label="find note link"
              className="p-0 mx-2 fs-3 d-flex align-items-center"
              {...longPressEventHandler}
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
              id="saved notes"
              title="Saved Notes"
              aria-label="saved notes link"
              className="py-0 fs-3"
              {...longPressEventHandler}
              as={NavLink}
              to={PATHS.notes}
            >
              <i className="bi bi-archive"></i>
            </Nav.Link>
          </Nav>
          <Nav className="ms-3">
            <Nav.Link
              id="about"
              title="Settings"
              aria-label="settings link"
              className="py-0 fs-3"
              {...longPressEventHandler}
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

export default NavigationBar;
