import { useEffect, useState } from "react";
import { Row, Col, Form, FormControl, InputGroup, Modal, Button } from "react-bootstrap";

interface Props {
  show: boolean,
  setShow: (value: boolean) => void,
  setPassword(password: string): void
}

const PasswordModal = ({ show, setShow, setPassword }: Props) => {
  const [form, setForm] = useState({
    password: ""
  });

  useEffect(() => {
    setForm({
      password: ""
    });
  }, []);

  return (
    <Modal show={show} onHide={() => setShow(false)} centered className="fs-4">
      <Form onSubmit={(e) => {
        e.preventDefault();
        setPassword(form.password);
        setShow(false);
      }}>
        <Modal.Header closeButton closeVariant="white">
          <Modal.Title>Input Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group as={Row} className="mb-3 fs-4" controlId="formPassword">
            <Form.Label as={Col} sm="3">
              Password
            </Form.Label>
            <Col sm="9">
              <InputGroup>
                <FormControl
                  type="password"
                  autoComplete="current-password"
                  onChange={e => setForm((prev) => {
                    return {
                      ...prev,
                      password: e.target.value
                    }
                  })}
                  value={form.password}
                  aria-describedby="basic-addon2"
                />
              </InputGroup>
            </Col>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" type="submit">
            OK!
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
