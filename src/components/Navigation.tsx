import { Container, Nav, Navbar, Image } from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";
import { PATHS } from "../utils/constants";
import HomeIcon from "../media/home.png";
import { match } from "react-router";

interface Props {
  showHome: boolean
}

const Navigation = (props: Props) => {
  return (
    <Navbar collapseOnSelect variant="dark" sticky="top">
      <Container
        className="px-5"
      >
        <Navbar.Brand>
          {
            props.showHome
              ?
              <Link to={PATHS.home}>
                <Image
                  src={HomeIcon}
                  fluid
                  className="home-button"
                  style={{
                    width: "calc(10px + 3vmin)",
                  }}
                  alt="Home"
                />
              </Link>
              : null
          }
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse className="justify-content-end text-white">
          <Nav className="me-auto"></Nav>
          <Nav>
            <Nav.Link
              as={NavLink}
              to={PATHS.about}
              activeStyle={{
                textDecorationLine: "underline"
              }}
              isActive={(match: match | null) => !match ? false : true}
            >About
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
