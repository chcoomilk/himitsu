import { useEffect } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import aqua from "../assets/404/aqua.gif";
import heal from "../assets/404/cursed.gif";
import deku from "../assets/404/deku.gif";

let timeout: NodeJS.Timeout;

const NotFound = () => {
  const navigate = useNavigate();
  useEffect(() => (() => clearTimeout(timeout)), []);

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <h1>
            My Gallery
          </h1>
        </Col>
        <Col xs={4} className="px-0">
          <Image fluid src={aqua} alt="watergod" />
        </Col>
        <Col xs={4} className="px-0">
          <Image fluid src={aqua} alt="watergod" />
        </Col>
        <Col xs={4} className="px-0">
          <Image fluid src={aqua} alt="watergod" />
        </Col>
        <Col xs={10} className="px-0">
          <Image fluid src={heal} alt="yes" />
          <Image fluid src={deku} alt="dekubanging" />
        </Col>
        <Col xs={2} className="my-auto">
          <p >
            Oh uh welcome, seems like you're lost <a href="/" onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}>click here</a> to go back
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
