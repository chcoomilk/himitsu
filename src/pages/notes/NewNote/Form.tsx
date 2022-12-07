import { capitalCase } from "change-case";
import { useContext, useState } from "react";
import { Form, Col, Row, InputGroup, Stack, Button, Spinner, DropdownButton, Dropdown, Collapse } from "react-bootstrap";
import { Controller, useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import AppContext from "../../../utils/app_state_context";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../utils/types";
import { Fields } from "./formtypes";
import NewNoteDurationGroupForm from "./fragments/duration";

type Props = {
  onSubmit: (form_data: Fields) => void,
  setModal: React.Dispatch<React.SetStateAction<{
    delete: boolean;
    extra_settings: boolean;
  }>>,
};

const NewNoteForm = ({ onSubmit: submit, setModal }: Props) => {
  const { appSettings } = useContext(AppContext);
  const form = useFormContext<Fields>();
  const watch = form.watch();
  const [openOptionalFields, setOpenOptionalFields] = useState(false);

  const buttons = (orient: "horizontal" | "vertical", size?: "sm" | "lg", className?: string) => {
    return (
      <Stack className={className} direction={orient} gap={3}>
        <Button
          className="w-100"
          size={size}
          variant="outline-secondary"
          onClick={() => setModal(p => ({ ...p, extra_settings: true }))}
        >
          Options
        </Button>
        <Button
          className="w-100"
          size={size}
          variant="outline-danger"
          onClick={() => setModal(p => ({ ...p, delete: true }))} disabled={form.formState.isSubmitting}
        >
          Reset
        </Button>
        <Button
          className="w-100"
          size={size}
          variant="success"
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? <Spinner size="sm" animation="border" /> : "Save"}
        </Button>
      </Stack>
    );
  };

  return (
    <Form className="my-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <Row>
        <Form.Group as={Col} md={6} controlId="formBasicEncryption" className="mb-4">
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
        <Col md={6} className="d-none d-md-inline">
          {buttons("horizontal")}
        </Col>
      </Row>

      <Form.Group controlId="formBasicDescription" className="position-relative mb-4">
        <Form.Label>Secret</Form.Label>
        <Form.Text muted>
          {` (${!watch.extra.encryption ? "unencrypted" : "encrypted"})`}
        </Form.Text>
        <Form.Control
          disabled={form.formState.isSubmitting}
          as="textarea"
          placeholder="Enter note here"
          rows={20}
          {...form.register("content", {
            required: { value: true, message: "a note can't be empty" },
          })}
          isInvalid={!!form.formState.errors.content}
          autoFocus={appSettings.autofocus}
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

      <Row className="mb-4">
        <Col>
          <hr />
        </Col>
        <Col>
          <Button
            size="sm"
            className="w-100"
            variant={(openOptionalFields ? "" : "outline-") + "secondary"}
            onClick={() => setOpenOptionalFields(v => !v)}
          >
            {openOptionalFields ? "Hide " : "Show "} Optionals
          </Button>
        </Col>
        <Col>
          <hr />
        </Col>
      </Row>

      <Collapse in={openOptionalFields}>
        <div>
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
        </div>
      </Collapse>

      {buttons("vertical", "lg", "mb-2 d-md-none")}
    </Form>
  );
};

export default NewNoteForm;
