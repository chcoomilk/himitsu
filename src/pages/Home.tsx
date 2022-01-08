import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PATHS } from "../utils/constants";

const Home = () => {
  return (
    <Container fluid className="text-center align-items-center">
      <Row>
        <Col xl={{ span: 10, offset: 1 }} xs={{ span: 10, offset: 1 }}>
          <h1 className="fs-0">himitsu</h1>
          <p className="fs-4">Onii-chan's simple, secure, and private <span className="text-nowrap">( ͡° ͜ʖ ͡°)</span> note sharing web app</p>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xl={{ span: 8, offset: 2 }} xs={{ span: 10, offset: 1 }}>
          <Link to={PATHS.new_note}>
            <Button
              size="lg"
              variant="success"
              className="mx-2"
            >Add</Button>
          </Link>
          <Link to={PATHS.find_note}>
            <Button
              size="lg"
              variant="primary"
              className="mx-2"
            >Find</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
