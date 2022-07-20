import { useFormik } from "formik";
import { Button, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PassphraseInputGroup from "../../../components/passphrase/PassphraseInputGroup";
import { PATHS } from "../../../utils/constants";
import * as yup from "yup";
import { Props } from "./utils";
import { useEffect, useState } from "react";

const schema = yup.object().shape({
  id: yup.string().required(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

const FindByID = ({ params: { query }, setParams }: Props) => {
  const navigate = useNavigate();
  // what
  const [_query] = useState(query);
  // whhhyy

  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      // possibly because here query change every param set, but shouldn't cause infinite loop
      // as ByTitle implemented the same way and didn't break
      id: /* what in tarnation does this mean */ _query, /* query, */
      passphrase: null
    },
    onSubmit: async (val) => {
      navigate(PATHS.note_detail + "/" + val.id, { state: { passphrase: val.passphrase } });
    },
    validateOnMount: true,
    enableReinitialize: false,
  });

  // this creates infinite loop for some reason
  useEffect(() => {
    if (formik.values.id) {
      setParams(prev => {
        return {
          ...prev, query: formik.values.id,
        };
      });
    } else {
      setParams(prev => {
        return {
          ...prev, query: null,
        };
      });
    }
  }, [formik.values.id, setParams]);

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group controlId="formBasicId" className="position-relative mb-4">
        <Form.Label>ID</Form.Label>
        <Form.Control
          type="text"
          name="id"
          placeholder="Enter note's ID here"
          value={formik.values.id || ""}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.initialValues.id === null ? (formik.touched.id && !!formik.errors.id) : !!formik.errors.id}
          autoFocus
        />
        <Form.Control.Feedback type="invalid" tooltip>{formik.errors.id}</Form.Control.Feedback>
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
        <Button
          variant="outline-warning"
          className="ms-auto"
          size="lg"
          onClick={() => setParams({ query: null, findBy: "title" })}
        >
          <i className="bi bi-search"></i>
          {" "}
          Title
        </Button>
        <Button type="submit" variant="primary" size="lg">Find</Button>
      </Stack>
    </Form>
  );
};

export default FindByID;
