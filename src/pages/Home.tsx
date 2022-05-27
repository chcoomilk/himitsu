import { Button, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PATHS } from "../utils/constants";

const Home = () => {
  return (
    <Row>
      <Col>
        <Row className="align-items-center text-center">
          <Col>
            <h1 className="fs-0">himitsu</h1>
            <p className="fs-4">Onii-chan's simple, secure, and private note sharing web app</p>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Stack direction="horizontal" gap={3}>
              <Link to={PATHS.new_note} className="ms-auto">
                <Button
                  size="lg"
                  variant="success"
                >Add</Button>
              </Link>
              <Link to={PATHS.find_note} className="me-auto">
                <Button
                  size="lg"
                  variant="primary"
                >Find</Button>
              </Link>
            </Stack>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Home;
