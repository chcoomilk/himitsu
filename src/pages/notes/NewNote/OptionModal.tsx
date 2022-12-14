import { useState } from "react";
import { InputGroup, Modal, Form, Nav } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import InfoCircle from "../../../components/InfoCircle";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import { EncryptionMethod } from "../../../utils/types";
import { Fields } from "./formtypes";
import NewNoteDurationGroupForm from "./fragments/DurationGroupForm";

type Props = {
  show: boolean,
  onHide: () => void,
}

enum Tabs {
  Common = "Common",
  Defaults = "Defaults"
}

const OptionModal = ({ show, onHide }: Props) => {
  const form = useFormContext<Fields>();
  const watch = form.watch();
  const [tabs, setTabs] = useState<Tabs>(Tabs.Common);

  const shouldExtraEncryptionEnable = () =>
    form.getValues("encryption") === EncryptionMethod.BackendEncryption &&
    form.getValues("extra.double_encryption.enable");

  return (
    <Modal scrollable size="lg" centered show={show} onHide={
      async () => {
        // Modify this to prevent option or setting modal in this form to hide
        let is_okay = await form.trigger("extra.double_encryption"); // triggers double encryption first so it's able to check if double_encryption.passphrase should be validated or not          i think
        is_okay = await form.trigger([
          "extra.double_encryption.passphrase",
          "title",
          "custom_id",
          "duration",
          "extra.delete_after_read"
        ], {
          shouldFocus: true
        });

        is_okay && onHide();
      }
    }>
      <Modal.Header closeButton closeVariant="white">
        Options
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formBasicTitle" className="position-relative mb-2">
          <Form.Label>Title <InfoCircle>
            Title is unencrypted at request. It may help you to sorts your saved notes
            {watch.encryption === EncryptionMethod.NoEncryption && ". It can also make your note searchable, if you have discoverability enabled"}
          </InfoCircle></Form.Label>
          <Form.Control
            disabled={form.formState.isSubmitting}
            type="text"
            placeholder="Enter note's title here"
            {...form.register("title", {
              minLength: { value: 4, message: "title is too short (length >= 4)" },
            })}
            isInvalid={form.formState.touchedFields.title && !!form.formState.errors.title}
            autoComplete="off"
          />
          <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.title?.message}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formBasicId" className="position-relative mb-2">
          <Form.Label>Custom ID</Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="Custom ID"
              type="text"
              placeholder="Enter note's custom ID here"
              {...form.register("custom_id", {
                maxLength: { value: 32, message: "custom id is too long (length <= 32)" },
                minLength: { value: 1, message: "custom id is invalid (length >= 4)" },
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
        <NewNoteDurationGroupForm className="mb-2" />
        <Form.Group controlId="formBasicDeleteAfterRead" className="mb-2">
          <Form.Label>
            Max Read Counter <InfoCircle
              id="formBasicDeleteAfterRead"
            >
              The maximum amount of reads/requests before the note disintegrates itself
            </InfoCircle>
          </Form.Label>
          <InputGroup hasValidation>
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="delete_after_read"
              type="text"
              inputMode="numeric"
              placeholder="100"
              {...form.register("extra.delete_after_read", {
                validate: {
                  type: v => isNaN(+v) ? "counter should represent a number" : undefined,
                },
                min: {
                  value: 1,
                  message: "counter should be greater than or equal 1",
                },
                max: {
                  value: 1024,
                  message: "counter cannot be greater than 1024"
                }
              })}
              isInvalid={form.formState.touchedFields.extra?.delete_after_read && !!form.formState.errors.extra?.delete_after_read}
              autoComplete="off"
            />
            <InputGroup.Text id="basicCounterUnit">
              time(s)
            </InputGroup.Text>
            <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.extra?.delete_after_read?.message}</Form.Control.Feedback>
          </InputGroup>
          <Form.Text>
            * Omit this field to set no limit
          </Form.Text>
        </Form.Group>
        <Form.Group
          hidden={watch.encryption === EncryptionMethod.NoEncryption}
          controlId="delete-with-passphrase-switch"
          className="mb-2"
        >
          <InputGroup>
            <Form.Switch
              inline
              id="delete-with-passphrase-switch"
              {...form.register("extra.allow_delete_with_passphrase")}
              label={"Allow to delete with passphrase"}
              disabled={form.formState.isSubmitting}
            />
          </InputGroup>
          {watch.encryption === EncryptionMethod.FrontendEncryption && <Form.Text className="text-warning">
            * WARNING!! passphrase will only be used for confirmation <span className="text-nowrap"> instead <InfoCircle>
              The reason being is because the encryption is originated from the client. So the server cannot
              verify the passphrase used for the client encryption secrets.
            </InfoCircle></span>
          </Form.Text>}
        </Form.Group>
        {(() => {
          switch (watch.encryption) {
            case EncryptionMethod.BackendEncryption:
              return (
                <Form.Group controlId="formBasicExtraDoubleEncrypt" className="mb-2">
                  <InputGroup className="mb-2">
                    <Form.Switch
                      inline
                      id="fe-switch"
                      {...form.register("extra.double_encryption.enable", {
                        onChange: (e) => e.target.checked === false ? form.clearErrors("extra.double_encryption.passphrase") : e
                      })}
                      label={
                        <>
                          Frontend Encryption <InfoCircle id="fe-switch">
                            Encrypts the secret on this machine first before going into the server
                          </InfoCircle>
                        </>
                      }
                      disabled={form.formState.isSubmitting}
                    />
                  </InputGroup>
                  <PassphraseInputGroup
                    disabled={form.formState.isSubmitting || !watch.extra.double_encryption.enable}
                    aria-label="Passphrase"
                    {...form.register(
                      "extra.double_encryption.passphrase", {
                      required: shouldExtraEncryptionEnable() ? "passphrase is required for encryption before going to the server" : undefined,
                      minLength: {
                        value: shouldExtraEncryptionEnable() ? 4 : 0,
                        message: "passphrase is too short (length >= 4)",
                      },
                      maxLength: {
                        value: shouldExtraEncryptionEnable() ? 1024 : Infinity,
                        message: "passphrase is too long (length <= 1024)"
                      },
                    })}
                    placeholder="Secondary passphrase"
                    errorMessage={form.formState.errors.extra?.double_encryption?.passphrase?.message}
                    isInvalid={!!form.formState.errors.extra?.double_encryption?.passphrase}
                  />
                </Form.Group>
              );

            case EncryptionMethod.FrontendEncryption:
              break;

            case EncryptionMethod.NoEncryption:
              return (
                <Form.Group controlId="formBasicDiscoverable" className="mb-2">
                  <Form.Switch
                    inline
                    id="public-switch"
                    {...form.register("extra.discoverable")}
                    label={
                      <>
                        Discoverability <InfoCircle>
                          Your note can{(watch.extra.discoverable ? "" : "'t")} be found publicly
                          through the title search or any other methods
                        </InfoCircle>
                      </>
                    }
                    disabled={form.formState.isSubmitting}
                  />
                </Form.Group>
              );
          }
        })()}
      </Modal.Body>
      <Modal.Footer className="p-0">
        <Nav className="w-100 m-0" fill variant="pills" defaultActiveKey={Tabs.Common} onSelect={(v: any) => setTabs(v)}>
          <Nav.Item>
            <Nav.Link eventKey={Tabs.Common}>Common</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey={Tabs.Defaults}>Defaults</Nav.Link>
          </Nav.Item>
        </Nav>
      </Modal.Footer>
    </Modal>
  );
};

export default OptionModal;
