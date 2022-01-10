import { Formik } from "formik";
import { useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router";
import * as yup from "yup";
import useTitle from "../../custom-hooks/useTitle";
import { PATHS } from "../../utils/constants";
import { StoreContext } from "../../utils/context";

const schema = yup.object().shape({
  ID: yup.number().required(),
  password: yup.string().min(4).max(1024).nullable()
});

const FindNote = () => {
  const navigate = useNavigate();
  const { setPassword } = useContext(StoreContext);
  useTitle("Find");

  return (
    <Container fluid>
      <Row>
        <Col xl={{ span: 4, offset: 4 }} xs={{ span: 10, offset: 1 }}>
          <Formik
            validationSchema={schema}
            onSubmit={async (val) => {
              setPassword(val.password);
              navigate(PATHS.note_detail + "/" + val.ID);
            }}
            initialValues={{
              ID: "",
              password: null
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
                <Form.Group controlId="formBasicId" className="position-relative mb-3">
                  <Form.Label>ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="ID"
                    placeholder="Enter note's ID here"
                    value={values.ID}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.ID && !!errors.ID}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{errors.ID}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formBasicPassword" className="position-relative mb-1">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter super secret password"
                    autoComplete="on"
                    value={values.password || undefined}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>{errors.password}</Form.Control.Feedback>
                </Form.Group>
                <div className="text-center">
                  <Button type="submit" variant="outline-primary" className="mt-3" size="lg">Find</Button>
                </div>
              </Form>
            )}
          </Formik>
        </Col>
      </Row>
    </Container>
  );
};

export default FindNote;
