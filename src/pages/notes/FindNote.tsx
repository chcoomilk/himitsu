import { Formik } from "formik";
import { useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useHistory } from "react-router";
import * as yup from "yup";
import useTitle from "../../custom-hooks/useTitle";
import { StoreContext } from "../../utils/context";

const schema = yup.object().shape({
  ID: yup.string().required(),
  password: yup.string().max(50)
});

const FindNote = () => {
  const history = useHistory();
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
              history.push("/n/" + val.ID);
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
                    type="text"
                    name="ID"
                    placeholder="Enter note's ID here"
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
                    autoComplete="on"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && !!errors.password}
                  />
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
