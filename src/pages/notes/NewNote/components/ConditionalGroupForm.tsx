import { Form } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import InfoCircle from "../../../../components/InfoCircle";
import PassphraseInputGroup from "../../../../components/input/PassphraseInputGroup";
import { EncryptionMethod } from "../../../../utils/types";
import { Fields } from "../formtypes";

const ConditionalGroupForm = (): JSX.Element => {
  const form = useFormContext<Fields>();
  const watch = form.watch();

  switch (watch.encryption) {
    case EncryptionMethod.BackendEncryption:
      return (
        <Form.Group controlId="formBasicExtraDoubleEncrypt" className="mb-2">
          <Form.Label>
            Secondary Passphrase <InfoCircle>
              Mixes the encryption, the first layer is obviously the frontend encryption, then the encrypted
              data will proceed as it would.
            </InfoCircle>
          </Form.Label>
          <PassphraseInputGroup
            disabled={form.formState.isSubmitting}
            aria-label="Passphrase"
            {...form.register(
              "extra.double_encryption", {
              minLength: {
                value: 4,
                message: "passphrase is too short (length >= 4)",
              },
              maxLength: {
                value: 1024,
                message: "passphrase is too long (length <= 1024)"
              },
            })}
            errorMessage={form.formState.errors.extra?.double_encryption?.message}
            isInvalid={!!form.formState.errors.extra?.double_encryption}
          />
        </Form.Group>
      );

    case EncryptionMethod.FrontendEncryption:
      return (
        <></>
      );

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
};

export default ConditionalGroupForm;
