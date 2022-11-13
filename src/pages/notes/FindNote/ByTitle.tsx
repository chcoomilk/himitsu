import { useEffect, useState } from "react";
import { Button, Col, Collapse, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../utils/constants";
import TitleSuggestions from "./TitleSuggestions";
import { Props } from "./utils";
import { useForm } from "react-hook-form";

type FormData = {
  title: string,
}

const FindByTitle = ({ params: { query }, setParams }: Props) => {
  const navigate = useNavigate();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [afBlurCount, setAfBlurCount] = useState(0);
  const form = useForm<FormData>({
    mode: "all",
    defaultValues: {
      title: query,
    }
  });
  const { title } = form.watch();

  const submit = (data: FormData) => {
    if (data.title) {
      navigate(PATHS.notes + "?src=global&q=" + encodeURIComponent(data.title));
    } else {
      form.trigger(undefined, { shouldFocus: true });
    }
  };

  useEffect(() => {
    setParams(prev => {
      return {
        ...prev, query: title,
      };
    });
  }, [title, setParams]);

  return (
    <Col xxl={4} xl={4} md={6} sm={10} xs={12}>
      <Form noValidate onSubmit={form.handleSubmit(submit)}>
        <Form.Group controlId="formBasicTitle" className="position-sticky mb-4">
          <Form.Label>Title</Form.Label>
          <Form.Control
            list="title"
            placeholder="Enter note's title here"
            aria-controls="collapse-suggestions"
            aria-expanded={showSuggestions}
            {...form.register("title", {
              min: { value: 1, message: "title is too short" },
              required: { value: true, message: "title is required" },
              onBlur: () => {
                setAfBlurCount(p => p + 1);
                setShowSuggestions(false);
              },
            })}
            onFocus={() => setShowSuggestions(true)}
            autoFocus
            autoComplete="off"
            isInvalid={(afBlurCount > 1 || !!form.formState.submitCount) && !!form.formState.errors.title}
          />
          <Collapse in={showSuggestions}>
            <div
              id="collapse-suggestions"
              className="position-absolute w-100"
              tabIndex={-1}
              onFocus={() => {
                setShowSuggestions(true);
              }}
            >
              {
                form.formState.isValid &&
                <TitleSuggestions
                  id="collapse-suggestions"
                  className="overflow-auto"
                  query={title}
                />
              }
            </div>
          </Collapse>

          <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.title?.message}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" gap={3}>
          <Button
            variant="outline-warning"
            className="ms-auto"
            size="lg"
            onClick={() => setParams({ findBy: "id" })}
          >
            <i className="bi bi-search"></i>
            {" "}
            ID
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </Col>
  );
};

export default FindByTitle;
