import { useContext } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import InfoCircle from "../../../../components/InfoCircle";
import AppSettingContext from "../../../../utils/AppSettingContext";
import { EncryptionMethod } from "../../../../utils/types";
import { Fields } from "../formtypes";
import ConditionalGroupForm from "./ConditionalGroupForm";
import NewNoteDurationGroupForm from "./DurationGroupForm";


const NewNoteOptionalGroupForm = () => {
  const appSettings = useContext(AppSettingContext);
  const form = useFormContext<Fields>();
  const watch = form.watch();

  return (
    <>
      <Form.Group controlId="formBasicTitle" className="position-relative mb-2">
        <Form.Label>Title <InfoCircle>
          Title is unencrypted at request. It may help you to sort your saved notes
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
            aria-label="delete after read"
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
      </Form.Group>

      <ConditionalGroupForm />

      <Form.Group
        hidden={watch.encryption === EncryptionMethod.NoEncryption}
        controlId="deleteWithPassphraseSwitch"
        className="mb-2"
      >
        <Form.Switch
          id="deleteWithPassphraseSwitch"
          {...form.register("extra.allow_delete_with_passphrase")}
          label={"Allow to delete with passphrase"}
          disabled={form.formState.isSubmitting}
        />
        {watch.encryption === EncryptionMethod.FrontendEncryption && <Form.Text className="text-warning">
          * WARNING!! passphrase will only be used for confirmation <span className="text-nowrap"> instead <InfoCircle>
            The reason being is because the encryption is originated from the client. So the server cannot
            verify the passphrase used for the client encryption secrets.
          </InfoCircle></span>
        </Form.Text>}
      </Form.Group>
      <Form.Group
        controlId="others"
        className="mb-2"
      >
        <Form.Switch
          id="saveLocallyOnSubmit"
          {...form.register("extra.save_locally", {
            disabled: form.formState.isSubmitting || !appSettings.history,
          })}
          label={"Save locally after submit"}
        />
      </Form.Group>
    </>
  );
};

export default NewNoteOptionalGroupForm;
