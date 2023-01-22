import { capitalCase, noCase } from "change-case";
import { useContext, useEffect, useState } from "react";
import { Form, Col, Row, Dropdown, Button, Stack } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import AppContext from "../../../utils/AppSettingContext";
import { createEncryptionMethodKeys, EncryptionMethod } from "../../../utils/types";
import NewNoteContext from "./context";
import { Fields } from "./formtypes";
import FormButtons from "./components/FormButtons";
import useLongPress from "../../../custom-hooks/useLongPress";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const subscription = subscribe(({ duration }) => duration && setTotalDuration((
      (+(duration.day || 0) * 86400) +
      (+(duration.hour || 0) * 3600) +
      (+(duration.minute || 0) * 60) +
      (+(duration.second || 0))
    )));

    return () => subscription.unsubscribe();
  }, [subscribe]);

  const longPressEventHandler = useLongPress(
    (e) => toast("Note expires in " + e.currentTarget.textContent),
    () => { }, // onclick
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
                onBlur: () => form.trigger("passphrase"),
                required: form.getValues("encryption") === EncryptionMethod.NoEncryption
                  ? undefined
                  : !pageState.simpleMode && "passphrase is required to encrypt your secret",
                minLength: {
                  value: form.getValues("encryption") === EncryptionMethod.NoEncryption ? 0 : 4,
                  message: "passphrase is too short (length >= 4)",
                },
                maxLength: {
                  value: form.getValues("encryption") === EncryptionMethod.NoEncryption ? Infinity : 1024,
                  message: "passphrase is too long (length <= 1024)"
                },
              }
            )}
            errorMessage={form.formState.errors.passphrase?.message}
            disabled={form.formState.isSubmitting || (
              !pageState.simpleMode && watch.encryption === EncryptionMethod.NoEncryption
            )}
            isInvalid={!!form.formState.errors.passphrase}
            elementsBeforeControl={!pageState.simpleMode && (
              <Dropdown
                id="encryption-dropdown"
                onSelect={(method) => form.setValue(
                  "encryption", +(method as string) as EncryptionMethod,
                  { shouldTouch: true }
                )}
              >
                <Dropdown.Toggle
                  disabled={form.formState.isSubmitting}
                  variant="outline-light"
                  title="Select an encryption method"
                />
                <Dropdown.Menu variant="dark">
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
                </Dropdown.Menu>
              </Dropdown>
            )}
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
                key={opt[1]}
                id={opt[1].toString()}
                variant="secondary"
                onClick={() => {
                  // so the other field if filled got reset
                  !pageState.mustExpire && form.resetField("duration");
                  if (!pageState.mustExpire && opt[0] === totalDuration) {
                    form.setValue("duration.second", undefined);
                  } else {
                    form.setValue("duration.second", +opt[0]);
                  }
                }}
                {...longPressEventHandler}
                style={{ width: "100px" }}
                className={"text-nowrap" + (opt[0] === totalDuration ? "" : " inactive")}
                title={"Note expires in " + opt[1]}
                aria-label={"Note expires in " + opt[1]}
              >
                {opt[1]}
              </Button>
            ));
          })()}
          <Button
            name="Custom"
            title="Custom length of time"
            variant="outline-secondary text-nowrap"
            onClick={() => {
              navigate("#options", {
                relative: "path", state: JSON.stringify({
                  focusOnDuration: true,
                })
              });
            }}
          >
            <i className="bi bi-pencil-square" /> Custom Duration
          </Button>
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
