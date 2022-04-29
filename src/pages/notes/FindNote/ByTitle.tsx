import { useFormik } from "formik";
import { useState } from "react";
import { Button, Collapse, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
// import PassphraseInputGroup from "../../../components/passphrase/PassphraseInputGroup";
import * as yup from "yup";
import { PATHS } from "../../../utils/constants";
import TitleSuggestions from "./TitleSuggestions";
import { SearchOptions } from "./utils";

const schema = yup.object().shape({
  title: yup.string(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

type Props = {
  setToggleSearch: React.Dispatch<React.SetStateAction<SearchOptions | null>>,
}

const FindByTitle = ({ setToggleSearch }: Props) => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      title: "",
      passphrase: null,
    },
    onSubmit: async (val) => {
      navigate(PATHS.notes + "?q=" + formik.values.title);
    },
  });

  return (
    <>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <Form.Group controlId="formBasicTitle" className="position-sticky mb-4">
          <Form.Label>Title</Form.Label>
          <Form.Control
            list="title"
            type="text"
            name="title"
            placeholder="Enter note's title here"
            aria-controls="collapse-suggestions"
            aria-expanded={show}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={e => {
              setShow(false);
              formik.handleBlur(e);
            }}
            onFocus={_ => setShow(true)}
            isInvalid={formik.touched.title && !!formik.errors.title}
          />

          <Collapse in={show}>
            <div
              id="collapse-suggestions"
              className="position-absolute w-100"
              tabIndex={-1}
              onFocus={() => {
                // this is needed when the user interacts inside here
                setShow(true);
              }}
            >
              <TitleSuggestions
                id="collapse-suggestions"
                className="overflow-auto"
                query={formik.values.title}
              />
            </div>
          </Collapse>

          <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <Button variant="outline-warning" className="ms-auto" size="lg"
            onClick={() => setToggleSearch(SearchOptions.ID)}>By ID
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </>
  );
};

export default FindByTitle;
