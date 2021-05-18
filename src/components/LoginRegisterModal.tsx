import React, { useState } from "react";
import { Toast, Button, Form, Modal } from "react-bootstrap";
import { useHistory } from "react-router";
import { HomePath } from "../utils/constants";
import * as yup from "yup";
import { Formik } from "formik";
import { useMutation } from "react-query";

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
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string>("");
  const {  } = useMutation((login_data: LoginData) => fetch({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login_data)
  }));
  const history = useHistory();

  return (
    <Modal
      show={show}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Toast

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
        <Button variant="danger" onClick={(() => { history.push(HomePath) })}>
          Nah
        </Button>
        <Button variant="primary">Login</Button>
        <Button variant="success">Register</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginRegisterModal;
