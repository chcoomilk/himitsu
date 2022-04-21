import { useFormik } from "formik";
import { useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap"
import { useNavigate } from "react-router";
import * as yup from "yup";
import PassphraseInputGroup from "../../components/passphrase/PassphraseInputGroup";
import { useTitle } from "../../custom-hooks";
import { PATHS } from "../../utils/constants";
import { StoreContext } from "../../utils/contexts";

const schema = yup.object().shape({
  title: yup.string(),
  ID: yup.number().required(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

const FindNote = () => {
  const navigate = useNavigate();
  const { setPassphrase } = useContext(StoreContext);
  useTitle("Find");
  const [toggleSearch, setToggleSearch] = useState(true);

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      title: "",
      ID: "",
      passphrase: null
    },
    onSubmit: async (val) => {
      setPassphrase(val.passphrase);
      navigate(PATHS.note_detail + "/" + val.ID);
    },
  });

  useEffect(() => {
    if (formik.values.title && formik.values.title.length > 4) {

    }
  }, [formik.values.title]);

  return (
    <Row>
      <Col xxl={{ span: 4, offset: 4 }} md={{ span: 6, offset: 3 }}>
        <Form noValidate onSubmit={formik.handleSubmit}>
          <Form.Group controlId="formBasicId" className="position-relative mb-4" hidden={toggleSearch}>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Enter note's title here"
              value={formik.values.ID}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              isInvalid={formik.touched.title && !!formik.errors.title}
            />
            <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicId" className="position-relative mb-4" hidden={!toggleSearch}>
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

          <Form.Group controlId="formBasicPassphrase" className="mb-4">
            <PassphraseInputGroup
              name="passphrase"
              value={formik.values.passphrase || ""}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              errorMessage={formik.errors.passphrase}
              isInvalid={formik.touched.passphrase && !!formik.errors.passphrase}
            />
          </Form.Group>
          <Stack direction="horizontal" gap={3}>
            <Button variant="outline-warning" className="ms-auto" size="lg"
              onClick={() => setToggleSearch(!toggleSearch)}>By {toggleSearch ? "Title" : "ID"}</Button>
            <Button type="submit" variant="primary" size="lg">Find</Button>
          </Stack>
        </Form>
      </Col>
    </Row>
  );
};

export default FindNote;
