import { capitalCase, noCase } from "change-case";
import { useContext } from "react";
import { Form, Col, Row, DropdownButton, Dropdown } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import AppContext from "../../../utils/AppSettingContext";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../utils/types";
import NewNoteContext from "./context";
import { Fields } from "./formtypes";
import FormButtons from "./components/FormButtons";

type Props = {
  onSubmit: (form_data: Fields) => void,
}

const NewNoteForm = ({ onSubmit: submit }: Props) => {
  const appSettings = useContext(AppContext);
  const [pageState] = useContext(NewNoteContext);
  const form = useFormContext<Fields>();
  const watch = form.watch();

  return (
    <Form className="my-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <Row>
        <Form.Group as={Col} md={6} controlId="formBasicEncryption" className="mb-4">
          <PassphraseInputGroup
            aria-label="Passphrase"
            placeholder="Enter super secret passphrase"
            {...form.register(
              "passphrase",
              {
                required: form.getValues("encryption") === EncryptionMethod.NoEncryption
                  ? undefined
                  : "passphrase is required to encrypt your secret",
                minLength: {
                  value: 4,
                  message: "passphrase is too short (length >= 4)",
                },
                maxLength: {
                  value: 1024,
                  message: "passphrase is too long (length <= 1024)"
                },
              }
            )}
            errorMessage={form.formState.errors.passphrase?.message}
            disabled={form.formState.isSubmitting || watch.encryption === EncryptionMethod.NoEncryption}
            isInvalid={watch.encryption !== EncryptionMethod.NoEncryption
              ? (!!form.formState.errors.passphrase)
              : undefined
            }
            elementsBeforeControl={
              <DropdownButton
                as="select"
                variant="outline-light"
                menuVariant="dark"
                title=""
                id="input-group-dropdown-1"
                className="text-truncate"
                onSelect={(method) => form.setValue(
                  "encryption", +(method as string) as EncryptionMethod,
                  { shouldTouch: true }
                )}
                disabled={form.formState.isSubmitting}
              >
                {
                  createEncryptionMethodKeys("NoEncryption", "BackendEncryption", "FrontendEncryption").map(
                    method => (
                      <Dropdown.Item
                        key={method}
                        value={method}
                        active={form.getValues("encryption") === EncryptionMethod[method]}
                        eventKey={EncryptionMethod[method]}
                      >{capitalCase(method)}</Dropdown.Item>
                    )
                  )
                }
              </DropdownButton>
            }
          />
        </Form.Group>
        <Col md={6} className="d-none d-md-inline">
          <FormButtons direction="horizontal" gap={2} />
        </Col>
      </Row>

      <Form.Group controlId="formBasicDescription" className="position-relative mb-4">
        <Form.Label>Secret</Form.Label>
        <Form.Text muted>
          {` (with ${noCase(EncryptionMethod[watch.encryption])}${watch.extra.double_encryption ? "+" : ""})`}
        </Form.Text>
        <Form.Control
          disabled={form.formState.isSubmitting}
          as="textarea"
          placeholder="Enter note here"
          rows={pageState.textAreaRow}
          {...form.register("content", {
            required: { value: true, message: "a note can't be empty" },
          })}
          isInvalid={!!form.formState.errors.content}
          autoFocus={appSettings.autofocus}
        />
        <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.content?.message}</Form.Control.Feedback>
      </Form.Group>
      <FormButtons gap={3} direction="vertical" buttonSize="lg" className="mb-2 d-md-none" />
    </Form >
  );
};

export default NewNoteForm;
