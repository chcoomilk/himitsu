import { useFormik } from "formik";
import { useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap"
import { useNavigate } from "react-router";
import * as yup from "yup";
import PassphraseInputGroup from "../../components/passphrase/PassphraseInputGroup";
import useTitle from "../../custom-hooks/useTitle";
import { PATHS } from "../../utils/constants";
import { StoreContext } from "../../utils/context";

const schema = yup.object().shape({
  ID: yup.number().required(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

const FindNote = () => {
  const navigate = useNavigate();
  const { setPassphrase } = useContext(StoreContext);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      ID: "",
      passphrase: undefined
    },
    onSubmit: async (val) => {
      setPassphrase(val.passphrase || null);
      navigate(PATHS.note_detail + "/" + val.ID);
    }
  });
  useTitle("Find");

  return (
    <Container fluid>
      <Row>
        <Col xxl={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
          <Form noValidate onSubmit={formik.handleSubmit}>
            <Form.Group controlId="formBasicId" className="position-relative mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                name="ID"
                placeholder="Enter note's ID here"
                value={formik.values.ID}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.ID && !!formik.errors.ID}
              />
              <Form.Control.Feedback type="invalid" tooltip>{formik.errors.ID}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formBasicPassphrase" className="position-relative mb-1">
              <PassphraseInputGroup
                name="passphrase"
                value={formik.values.passphrase || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onError={formik.errors.passphrase}
                isInvalid={formik.touched.passphrase && !!formik.errors.passphrase}
              />
              {/* <Form.Label>Passphrase</Form.Label>
              <Form.Control
                type="password"
                name="passphrase"
                placeholder="Enter super secret passphrase"
                autoComplete="on"
                value={formik.values.passphrase || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={formik.touched.passphrase && !!formik.errors.passphrase}
              />
              <Form.Control.Feedback type="invalid" tooltip>{formik.errors.passphrase}</Form.Control.Feedback> */}
            </Form.Group>
            <div className="text-center">
              <Button type="submit" variant="outline-primary" className="mt-3" size="lg">Find</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default FindNote;
