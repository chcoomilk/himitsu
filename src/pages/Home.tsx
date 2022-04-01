import { useContext, useEffect } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { DefaultValue, PATHS } from "../utils/constants";
import { StoreContext } from "../utils/contexts";

const Home = () => {
  const { setPopups: setAlerts } = useContext(StoreContext);
  useEffect(() => {
    setAlerts(DefaultValue.Popups);
  }, [setAlerts]);

  return (
    <Row className="text-center align-items-center">
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
                  onClick={(_) => {
                    window.localStorage.removeItem(DefaultValue.Pages.NewNote.RESULT_STATE_NAME);
                  }}
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
