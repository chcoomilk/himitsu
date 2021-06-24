import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { HomePath } from "../utils/constants";

interface DoShowModal {
  show: boolean
}

const LoginRegisterModal: React.FC<DoShowModal> = ({ show }) => {
  const history = useHistory();

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header>
        <Modal.Title>You got to login first</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" />
          </Form.Group>

          <Form.Group controlId="formBasicPassword" className="mt-2">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter Password" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={(() => { history.push(HomePath) })}>
          Nah
        </Button>
        <Button variant="primary">Login/Register</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRegisterModal;
