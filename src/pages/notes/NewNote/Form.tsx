import { capitalCase, noCase } from "change-case";
import { useContext, useEffect, useState } from "react";
import { Form, Col, Row, DropdownButton, Dropdown, Button, Stack } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import AppContext from "../../../utils/AppSettingContext";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../utils/types";
import NewNoteContext from "./context";
import { Fields } from "./formtypes";
import FormButtons from "./components/FormButtons";
import useLongPress from "../../../custom-hooks/useLongPress";
import { toast } from "react-hot-toast";

type Props = {
  onSubmit: (form_data: Fields) => void,
}

const NewNoteForm = ({ onSubmit: submit }: Props) => {
  const appSettings = useContext(AppContext);
  const [pageState] = useContext(NewNoteContext);
  const form = useFormContext<Fields>();
  const { watch: subscribe } = form;
  const watch = form.watch();
  const [totalDuration, setTotalDuration] = useState(0);

  useEffect(() => {
    const subscribtion = subscribe(({ duration }) => duration && setTotalDuration((
      (+(duration.day || 0) * 86400) +
      (+(duration.hour || 0) * 3600) +
      (+(duration.minute || 0) * 60) +
      (+(duration.second || 0))
    )));

    return () => subscribtion.unsubscribe();
  }, [subscribe]);

  const longPressEventHandler = useLongPress(
    (e) => toast("Note will set to expire in " + e.currentTarget.textContent),
    () => {}, // onclick
    { shouldPreventDefault: false, delay: 500 }
  );

  return (
    <Form className="my-3" noValidate onSubmit={form.handleSubmit(submit)}>
      <Row>
        <Form.Group as={Col} md={6} controlId="formBasicEncryption" className="mb-3">
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

      <Form.Group controlId="groupSuggestDuration" className="mb-2">
        <Stack direction="horizontal" className="overflow-auto w-100" gap={2}>
          {(() => {
            let duration_options = [
              [1800, "30 mins"],
              [3600, "1 hour"],
              [3600 * 6, "6 hours"],
              [86400, "1 day"],
              [86400 * 30, "1 month"],
            ];

            return duration_options.map((opt) => (
              <Button
                id={opt[1].toString()}
                variant="secondary"
                onClick={() => {
                  // so the other field if filled got reset
                  form.resetField("duration");
                  if (opt[0] === totalDuration) {
                    form.setValue("duration.second", undefined)
                  } else {
                    form.setValue("duration.second", +opt[0]);
                  }
                }}
                {...longPressEventHandler}
                style={{ width: "100px" }}
                className={"text-nowrap" + (opt[0] === totalDuration ? "" : " inactive")}
                title={"Note will set to expire in " + opt[1]}
                aria-label={"Note will set to expire in " + opt[1]}
              >
                {opt[1]}
              </Button>
            ));
          })()}
          {/* <div className="vr mx-1"></div>
          <Button className="me-auto"
            variant="outline-secondary"
            onClick={() => {
              dispatch({ type: "toggleModalExtraSettings" });
              // damn
              form.setFocus("duration.day");
              // no, i'm not going to make this possible
              // no thank you
            }}
          >
            <i className="bi bi-pencil-square" /> Custom
          </Button> */}
        </Stack>
      </Form.Group>

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
