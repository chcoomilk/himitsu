import { useFormik } from "formik";
import { Button, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PassphraseInputGroup from "../../../components/passphrase/PassphraseInputGroup";
import { PATHS } from "../../../utils/constants";
import * as yup from "yup";
import { SearchOptions } from "./utils";
import { useEffect } from "react";

const schema = yup.object().shape({
  id: yup.number().required(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

type Props = {
  setToggleSearch: React.Dispatch<React.SetStateAction<SearchOptions | null>>,
  initialState?: {
    id: string,
  },
}

const FindByID = ({ setToggleSearch, initialState }: Props) => {
  const navigate = useNavigate();
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      id: "",
      passphrase: null
    },
    onSubmit: async (val) => {
      navigate(PATHS.note_detail + "/" + val.id, { state: { passphrase: val.passphrase } });
    },
  });

  useEffect(() => {
    if (initialState) {
      formik.setValues(prev => {
        return {
          ...prev,
          id: initialState.id,
        };
      });
    }
  }, [initialState, formik]);

  return (
    <Form noValidate onSubmit={formik.handleSubmit}>
      <Form.Group controlId="formBasicId" className="position-relative mb-4">
        <Form.Label>ID</Form.Label>
        <Form.Control
          type="text"
          name="id"
          placeholder="Enter note's ID here"
          value={formik.values.id}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          isInvalid={formik.touched.id && !!formik.errors.id}
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
        <Button variant="outline-warning" className="ms-auto" size="lg"
          onClick={() => setToggleSearch(SearchOptions.Title)}>By Title
        </Button>
        <Button type="submit" variant="primary" size="lg">Find</Button>
      </Stack>
    </Form>
  );
};

export default FindByID;
