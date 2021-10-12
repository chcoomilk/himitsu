import { useContext, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FindNotePath, NewNotePath } from "../utils/constants";
import { StoreContext } from "../utils/context";

const Home = () => {
  const { setShowHomeLogo } = useContext(StoreContext);

  useEffect(() => {
    setShowHomeLogo(false);
    return () => {
      setShowHomeLogo(true);
    }
  }, [setShowHomeLogo]);

  return (
    <Container fluid className="text-center align-items-center">
      <Row>
        <Col xl={{ span: 10, offset: 1 }} xs={{ span: 10, offset: 1 }}>
          <h1>himitsu</h1>
          <p>Onii-chan's simple, secure, and private <span className="text-nowrap">( ͡° ͜ʖ ͡°)</span> note sharing web app</p>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col xl={{ span: 8, offset: 2 }} xs={{ span: 10, offset: 1 }}>
          <Link to={NewNotePath}>
            <Button
              size="lg"
              variant="success"
              className="mx-2"
            >Add</Button>
          </Link>
          <Link to={FindNotePath}>
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
