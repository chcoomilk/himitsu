import React, { useContext, useEffect, useState } from "react";
import { Toast, Button, Form, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import * as yup from "yup";
import { Formik } from "formik";
import axios from "axios";
import { StoreContext } from "../utils/contexts";

interface DoShowModal {
  show: boolean
}

interface LoginData {
  username: string,
  password: string
}

const schema = yup.object().shape({
  username: yup.string().required().min(3).max(15),
  password: yup.string().min(6).max(50)
});

const LoginRegisterModal: React.FC<DoShowModal> = ({ show }) => {
  const { login: { showLoginModal } } = useContext(StoreContext);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const history = useHistory();

  return (
    <Modal
      show={show}
      onHide={() => showLoginModal(false)}
      centered
    >
      <Toast
        show={false}
      >
        <Toast.Header>
          {toastMsg}
        </Toast.Header>
      </Toast>
      <Modal.Header>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          validationSchema={schema}
          onSubmit={val => {
            console.log(val);
          }}
          initialValues={{
            username: "",
            password: ""
          }}
        >
          {({ handleSubmit, handleChange, values, errors }) => (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid">
                  <small>
                    {errors.username}
                  </small>
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mt-2">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
              </Form.Group>
            </Form>
          )}
        </Formik>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={(() => showLoginModal(false))}>
          Nah
        </Button>
        <Button variant="primary">Login</Button>
        <Button variant="success">Register</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRegisterModal;
