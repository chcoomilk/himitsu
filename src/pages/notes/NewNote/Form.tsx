import { Form, Col, Row, InputGroup, Stack, Button, Spinner } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import { EncryptionMethod } from "../../../utils/types";
import { Fields } from "./form";
import NewNoteDurationGroupForm from "./groups/duration";

type Props = {
  onSubmit: (form_data: Fields) => void,
  setModal: React.Dispatch<React.SetStateAction<{
    delete: boolean;
    extra_settings: boolean;
  }>>,
  extra_settings_group: JSX.Element,
};

const NewNoteForm = ({ onSubmit: submit, setModal, extra_settings_group }: Props) => {
  const form = useFormContext<Fields>();
  const watch = form.watch();

  return (
    <Form className="mb-3 mt-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <Row>
        <Col md="8" xs="12">
          <Form.Group controlId="formBasicTitle" className="position-relative mb-4">
            <Form.Label>Title</Form.Label>
            <Form.Text muted>
              {" "}(unencrypted)
            </Form.Text>
            <Form.Control
              disabled={form.formState.isSubmitting}
              type="text"
              placeholder="Enter note's title here"
              {...form.register("title", {
                minLength: { value: 4, message: "title is too short" },
              })}
              isInvalid={form.formState.touchedFields.title && !!form.formState.errors.title}
              autoComplete="off"
              autoFocus
            />
            <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.title?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicDescription" className="position-relative mb-4">
            <Form.Label>Secret</Form.Label>
            <Form.Text muted>
              {` (${!watch.extra.encryption ? "unencrypted" : "encrypted"})`}
            </Form.Text>
            <Form.Control
              disabled={form.formState.isSubmitting}
              as="textarea"
              placeholder="Enter note here"
              rows={3}
              {...form.register("content", {
                required: { value: true, message: "a note can't be empty" },
              })}
              isInvalid={form.formState.touchedFields.content && !!form.formState.errors.content}
            />
            <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.content?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassphrase" className="position-relative mb-4">
            <PassphraseInputGroup
              aria-label="Passphrase"
              placeholder="Enter super secret passphrase"
              {...form.register(
                "passphrase",
                {
                  required: form.getValues("extra.encryption") === EncryptionMethod.NoEncryption
                    ? undefined
                    : "passphrase is required to encrypt before going to the server",
                  minLength: {
                    value: 4,
                    message: "passphrase is too short",
                  },
                  maxLength: {
                    value: 1024,
                    message: "passphrase is too long (max length: 1024 chars)"
                  },
                }
              )}
              errorMessage={form.formState.errors.passphrase?.message}
              disabled={form.formState.isSubmitting || watch.extra.encryption === EncryptionMethod.NoEncryption}
              isInvalid={watch.extra.encryption !== EncryptionMethod.NoEncryption
                ? (form.formState.touchedFields.passphrase && !!form.formState.errors.passphrase)
                : undefined
              }
            />
          </Form.Group>

          <Form.Group controlId="formBasicId" className="position-relative mb-4">
            <Form.Label>Custom ID</Form.Label>
            <InputGroup hasValidation>
              <Form.Control
                disabled={form.formState.isSubmitting}
                aria-label="Custom ID"
                type="text"
                placeholder="Enter note's custom ID here"
                {...form.register("custom_id", {
                  maxLength: { value: 32, message: "custom id is too long" },
                  minLength: { value: 1, message: "custom id is invalid" },
                })}
                isInvalid={form.formState.touchedFields.custom_id && !!form.formState.errors.custom_id}
                autoComplete="off"
              />
              <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.custom_id?.message}</Form.Control.Feedback>
            </InputGroup>
            <Form.Text muted>
              * Omit this field to set a random ID
            </Form.Text>
          </Form.Group>

          <NewNoteDurationGroupForm />
        </Col>

        <Col md="4" xs="12">
          <div className="d-none d-md-block">
            {extra_settings_group}
          </div>
          <Row>
            <Col>
              <Stack className="mb-2" direction="vertical" gap={3}>
                <Button className="w-100 d-block d-md-none" size="lg" variant="outline-secondary" onClick={() => setModal(p => ({ ...p, extra_settings: true }))}>Options</Button>
                <Button className="w-100" size="lg" variant="outline-danger" onClick={() => setModal(p => ({ ...p, delete: true }))} disabled={form.formState.isSubmitting}>Reset</Button>
                <Button className="w-100" size="lg" variant="success" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting ? <Spinner size="sm" animation="border" /> : "Save"}</Button>
              </Stack>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default NewNoteForm;
