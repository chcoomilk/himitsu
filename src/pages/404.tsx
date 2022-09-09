import { Col, Image, Row } from "react-bootstrap";
import aqua from "../assets/404/aqua.gif";
import heal from "../assets/404/cursed.gif";
import deku from "../assets/404/deku.gif";

const NotFound = () => {
  return (
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
          Oh uh welcome, seems like you're lost <a href="/">click here</a> to go back
        </p>
      </Col>
    </Row>
  );
};

export default NotFound;
