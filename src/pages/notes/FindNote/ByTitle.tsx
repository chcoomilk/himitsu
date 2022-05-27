import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { Button, Collapse, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { PATHS } from "../../../utils/constants";
import TitleSuggestions from "./TitleSuggestions";
import { Props } from "./utils";

const schema = yup.object().shape({
  title: yup.string().min(3, "Put at least 3 characters in to search").nullable().required(),
});

const FindByTitle = ({ params: { query }, setParams }: Props) => {
  const navigate = useNavigate();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const formik = useFormik({
    validationSchema: schema,
    initialValues: {
      title: query,
    },
    onSubmit: async ({ title }) => {
      navigate(PATHS.notes + "?q=" + title);
    },
  });

  useEffect(() => {
    if (formik.values.title) {
      setParams(prev => {
        return {
          ...prev, query: formik.values.title,
        };
      });
    } else {
      setParams(prev => {
        return {
          ...prev, query: null,
        };
      });
    }
  }, [formik.values.title, setParams]);

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
            aria-expanded={showSuggestions}
            value={formik.values.title || ""}
            onChange={formik.handleChange}
            onBlur={e => {
              setShowSuggestions(false);
              formik.handleBlur(e);
            }}
            onFocus={_ => setShowSuggestions(true)}
            isInvalid={formik.touched.title && !!formik.errors.title}
          />

          <Collapse in={showSuggestions}>
            <div
              id="collapse-suggestions"
              className="position-absolute w-100"
              tabIndex={-1}
              onFocus={() => {
                // this is needed when the user interacts inside here (the suggestions box)
                setShowSuggestions(true);
              }}
            >
              {
                (
                  formik.isValid &&
                  formik.values.title /* only for passing typecheck */ &&
                  formik.values.title.length >= 3 /* what the heck formik.. or yup idk */
                ) ? (
                  <TitleSuggestions
                    id="collapse-suggestions"
                    className="overflow-auto"
                    query={formik.values.title}
                  />
                ) : null
              }
            </div>
          </Collapse>

          <Form.Control.Feedback type="invalid" tooltip>{formik.errors.title}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <Button
            variant="outline-warning"
            className="ms-auto"
            size="lg"
            onClick={() => setParams({ query: null, findBy: "id" })}
          >
            <i className="bi bi-search"></i>
            {" "}
            ID
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </>
  );
};

export default FindByTitle;
