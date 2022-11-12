import { capitalCase } from "change-case";
import { Form, Col, Row, InputGroup, Stack, Button, Spinner, DropdownButton, Dropdown } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../utils/types";
import { Fields } from "./form";
import NewNoteDurationGroupForm from "./fragments/duration";

type Props = {
  onSubmit: (form_data: Fields) => void,
  setModal: React.Dispatch<React.SetStateAction<{
    delete: boolean;
    extra_settings: boolean;
  }>>,
};

const NewNoteForm = ({ onSubmit: submit, setModal }: Props) => {
  const form = useFormContext<Fields>();
  const watch = form.watch();

  return (
    <Form className="my-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <Row>
        <Col>
          <Form.Group controlId="formBasicEncryption" className="mb-4">
            <InputGroup>
              <Controller
                control={form.control}
                name="extra.encryption"
                render={({ field }) => (
                  <DropdownButton
                    variant="outline-light"
                    menuVariant="dark"
                    title={`${EncryptionMethod[watch.extra.encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
                    id="input-group-dropdown-1"
                    disabled={form.formState.isSubmitting}
                  >
                    {
                      createEncryptionMethodKeys("NoEncryption", "BackendEncryption", "FrontendEncryption").map(
                        method => (
                          <Dropdown.Item
                            key={method}
                            onClick={() => field.onChange(EncryptionMethod[method])}
                          >{capitalCase(method)}</Dropdown.Item>
                        )
                      )
                    }
                  </DropdownButton>
                )}
              />
            </InputGroup>
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
              rows={6}
              {...form.register("content", {
                required: { value: true, message: "a note can't be empty" },
              })}
              isInvalid={!!form.formState.errors.content}
            />
            <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.content?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlId="formBasicPassphrase" className="position-relative mb-4">
            <Form.Label>Passphrase</Form.Label>
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
                ? (!!form.formState.errors.passphrase)
                : undefined
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xl="9" md="12">
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
              isInvalid={!!form.formState.errors.title}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.title?.message}</Form.Control.Feedback>
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
                isInvalid={!!form.formState.errors.custom_id}
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

        <Col xl="3" md="12">
          <Stack className="mb-2" direction="vertical" gap={3}>
            <Button
              className="w-100"
              size="lg"
              variant="outline-secondary"
              onClick={() => setModal(p => ({ ...p, extra_settings: true }))}
              disabled={form.getValues("extra.encryption") === EncryptionMethod.FrontendEncryption}
            >
              Options
            </Button>
            <Button
              className="w-100"
              size="lg"
              variant="outline-danger"
              onClick={() => setModal(p => ({ ...p, delete: true }))} disabled={form.formState.isSubmitting}
            >
              Reset
            </Button>
            <Button
              className="w-100"
              size="lg"
              variant="success"
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? <Spinner size="sm" animation="border" /> : "Save"}
            </Button>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default NewNoteForm;
