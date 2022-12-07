import { Button, Col, Form, Stack } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import { Props } from "./utils";
import { useContext, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { PATHS } from "../../../utils/constants";
import AppContext from "../../../utils/app_state_context";

type FormData = {
  id: string,
  passphrase: string,
}

const FindByID = ({ params: { query }, setParams }: Props) => {
  const { appSettings } = useContext(AppContext);
  const navigate = useNavigate();
  const [afBlurCount, setAfBlurCount] = useState(0);
  const form = useForm<FormData>({
    mode: "all",
    defaultValues: {
      id: query,
    }
  });
  const id = form.watch("id");

  const submit = (data: FormData) => {
    if (data.id) {
      navigate(PATHS.note_detail + "/" + encodeURIComponent(data.id), { state: { passphrase: data.passphrase } });
    } else {
      form.trigger(undefined, { shouldFocus: true });
    }
  };

  useEffect(() => {
    setParams(prev => {
      return {
        ...prev, query: id,
      };
    });
  }, [id, setParams]);

  return (
    <Col xxl={4} xl={4} md={6} sm={10} xs={12}>
      <Form noValidate onSubmit={form.handleSubmit(submit)}>
        <Form.Group controlId="formBasicId" className="position-relative mb-4">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter note's ID here"
            {...form.register("id", {
              maxLength: { value: 32, message: "id is too long" },
              required: { value: true, message: "id is required" },
              onBlur: () => {
                setAfBlurCount(p => p + 1);
              },
            })}
            autoComplete="off"
            isInvalid={(afBlurCount > 1 || !!form.formState.submitCount) && !!form.formState.errors.id}
            autoFocus={appSettings.autofocus}
          />
          <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.id?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicPassphrase" className="mb-4">
          <FormProvider {...form}>
            <PassphraseInputGroup
              {...form.register("passphrase", {
                minLength: {
                  value: 4,
                  message: "passphrase is too short",
                },
                maxLength: {
                  value: 1024,
                  message: "passphrase is too long (max length: 1024 chars)"
                },
              })}
              isInvalid={form.formState.touchedFields.passphrase && !!form.formState.errors.passphrase}
              errorMessage={form.formState.errors.passphrase?.message}
            />
          </FormProvider>
        </Form.Group>
        <Stack direction="horizontal" gap={3}>
          <Button
            variant="outline-warning"
            className="ms-auto"
            size="lg"
            onClick={() => setParams({ findBy: "title" })}
          >
            <i className="bi bi-search"></i>
            {" "}
            Title
          </Button>
          <Button type="submit" variant="primary" size="lg">Find</Button>
        </Stack>
      </Form>
    </Col>
  );
};

export default FindByID;
