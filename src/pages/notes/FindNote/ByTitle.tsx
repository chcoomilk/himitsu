import { useFormik } from "formik";
import { useState } from "react";
import { Button, Collapse, Form, Stack } from "react-bootstrap";
// import PassphraseInputGroup from "../../../components/passphrase/PassphraseInputGroup";
import * as yup from "yup";
import SearchResult from "./TitleSearchResult";

const schema = yup.object().shape({
  title: yup.string(),
  passphrase: yup.string().min(4).max(1024).nullable()
});

type Props = {
  setToggleSearch: React.Dispatch<React.SetStateAction<boolean>>,
}

const FindByTitle = ({ setToggleSearch }: Props) => {
  const [show, setShow] = useState(false);
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      title: "",
      passphrase: null,
    },
    onSubmit: async (val) => {
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
          {/* <Collapse in={show}>
            <div id="collapse-suggestions">
              {formik.values.title}
            </div>
          </Collapse> */}
          <Collapse in={show}>
            <div
              id="collapse-suggestions"
              className="position-absolute w-100"
            >
              <SearchResult
                id="collapse-suggestions"
                className="overflow-auto"
                query={formik.values.title}
              />
            </div>
          </Collapse>
          {/* {
            show
              ? (
                <Collapse in={show}>
                  <div id="collapse-suggestions">
                    <SearchResult
                      // you fucking donkey, 
                      // i spent minutes trying to figure out how to pass these attributes
                      className="position-absolute w-100"
                      query={formik.values.title}
                    />
                  </div>
                </Collapse>
              )
              : null
          } */}
          <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <Button variant="outline-warning" className="ms-auto" size="lg"
            onClick={() => setToggleSearch(prev => !prev)}>By ID
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </>
  );
};

export default FindByTitle;
