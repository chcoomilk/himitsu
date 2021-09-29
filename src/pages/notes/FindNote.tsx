import { Formik } from "formik";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useHistory } from "react-router";
import * as yup from "yup";
// import { BaseUrl } from "../../utils/constants";
// import { NoteProps } from "./Note";

const schema = yup.object().shape({
  ID: yup.number().required(),
  password: yup.string().required().min(1).max(50)
});

const FindNote = () => {
  const history = useHistory();

  return (
    <Container fluid>
      <Row>
        <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={schema}
            onSubmit={async (val) => {
              localStorage.setItem("pswd", val.password);
              history.push("/n/" + val.ID, val);
            }}
            initialValues={{
              ID: "",
              password: ""
            }}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched
            }) => (
              <Form noValidate onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicId" className="mb-3 pb-2">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="number"
                    name="ID"
                    placeholder="Enter note's ID here"
                    className="text-center"
                    value={values.ID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.ID && !!errors.ID}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="mb-2">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter super secret password"
                    className="text-center"
                    autoComplete="current-password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                  />
                </Form.Group>
                <Button type="submit" className="mt-3">Submit</Button>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default FindNote;
