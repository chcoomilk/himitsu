import { Controller, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Row, Col, DropdownButton, Dropdown, InputGroup, FormControl, Stack, Spinner, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { capitalCase } from "change-case"

import NewNoteModal from "../../components/note/NewNoteModal";
import AppContext from "../../utils/app_state_context";
import { createEncryptionMethodKeys, EncryptionMethod, NoteInfo } from "../../utils/types";
import { post_note } from "../../queries";
import { useTitle } from "../../custom-hooks";
import { local_storage } from "../../utils/functions";
import PassphraseInputGroup from "../../components/input/PassphraseInputGroup";
import SimpleConfirmationModal from "../../components/modal/SimpleConfirmationModal";
import unwrap_default from "../../utils/functions/unwrap";

type Fields = {
  title: string,
  passphrase: string,
  content: string,
  custom_id: string,
  duration: {
    day: number,
    hour: number,
    minute: number,
    second: number,
  }
  extra: {
    encryption: EncryptionMethod,
    double_encryption: {
      enable: boolean,
      passphrase: string,
    },
    discoverable: boolean,
  }
}

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

const NewNote = () => {
  const { appSettings } = useContext(AppContext);
  const [noteResult, setNoteResult] = useState<UNoteInfo>();
  const [modal, setModal] = useState({
    delete: false,
    extra_settings: false,
  });
  useTitle("New Note");
  const { mutateAsync } = useMutation(post_note);

  const form = useForm<Fields>({
    mode: "all",
    defaultValues: {
      extra: {
        encryption: appSettings.encryption,
        discoverable: false,
        double_encryption: {
          enable: false,
        }
      }
    },
  });

  const watchOut = form.watch();

  useEffect(() => {
    form.trigger("duration.second");
  }, [form, watchOut.duration?.day, watchOut.duration?.hour, watchOut.duration?.minute]);

  const resetForm = (skipExtra?: boolean) => {
    skipExtra ? (() => {
      let prev_values = form.getValues();
      form.reset(undefined, { keepDefaultValues: true });
      form.setValue("extra", {
        discoverable: prev_values.extra.discoverable,
        double_encryption: {
          enable: prev_values.extra.double_encryption.enable,
          passphrase: form.getValues("extra.double_encryption.passphrase"),
        },
        encryption: prev_values.extra.encryption,
      })
    })() : form.reset(undefined, { keepDefaultValues: true });
  };

  const submit = async (form_data: Fields) => {
    console.log(form_data);

    let duration_in_secs: number = form_data.duration.second || 0;
    if (form_data.duration.day) {
      duration_in_secs += form_data.duration.day * 86400;
    }
    if (form_data.duration.hour) {
      duration_in_secs += form_data.duration.hour * 3600;
    }
    if (form_data.duration.minute) {
      duration_in_secs += form_data.duration.minute * 60;
    }

    await mutateAsync({
      discoverable: form_data.extra.encryption === EncryptionMethod.NoEncryption ? form_data.extra.discoverable : undefined,
      custom_id: form_data.custom_id === null || form_data.custom_id === "" ? undefined : form_data.custom_id,
      double_encrypt: form_data.extra.double_encryption.enable && form_data.extra.encryption === EncryptionMethod.BackendEncryption ? form_data.extra.double_encryption.passphrase : undefined,
      encryption: form_data.extra.encryption,
      title: form_data.title === "" || form_data.title === null ? undefined : form_data.title,
      content: form_data.content,
      lifetime_in_secs: duration_in_secs === 0 ? undefined : duration_in_secs,
      passphrase: form_data.passphrase || "",
    })
      .then(result => {
        const { data, error } = result;
        if (!error) {
          setNoteResult({
            ...data,
            passphrase: form_data.passphrase,
          });
          local_storage.set("last_saved_note", data);
          if (appSettings.history) {
            let notes = local_storage.get("notes");
            if (notes) {
              notes.push(data);

              local_storage.set("notes", notes);
            } else {
              local_storage.set("notes", [data]);
            }

            let qk: [string | undefined] = [undefined];
            if (data.title) {
              let t: string = "";
              for (let char of data.title) {
                t += char;
                qk.push(char);
                if (t.length > 1) qk.push(t);
              }
            }
          }

          resetForm(true);
        } else {
          unwrap_default(error);
        }
      })
      .catch((e) => {
        console.error("error occurred: ", e);
      });
  };

  let extra_settings_group = (
    <>
      <Form.Group controlId="formBasicEncryption" className="mb-4">
        <Form.Label>Encryption</Form.Label>
        <InputGroup>
          <Controller
            control={form.control}
            name="extra.encryption"
            render={({ field }) => (
              <DropdownButton
                variant="outline-light"
                menuVariant="dark"
                title={`${EncryptionMethod[watchOut.extra.encryption].replace(/([a-z0-9])([A-Z])/g, '$1 $2')}`}
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
      {
        (() => {
          switch (watchOut.extra.encryption) {
            case EncryptionMethod.BackendEncryption:
              return (
                <>
                  <Form.Group controlId="formBasicExtraDoubleEncrypt" className="mb-4">
                    <Form.Label>EXTRA POWAH!!</Form.Label>
                    <InputGroup>
                      <Form.Switch
                        inline
                        id="fe-switch"
                        {...form.register("extra.double_encryption.enable", {
                          onChange: () => {
                            // onChange={e => { formik.setTouched({ ...formik.touched, double_encrypt: { passphrase: false } }); formik.handleChange(e); }}
                          }
                        })}
                        label={"Frontend Encryption"}
                        disabled={form.formState.isSubmitting}
                      />
                      <PassphraseInputGroup
                        hide={!watchOut.extra.double_encryption.enable}
                        inputGroupClassName="mt-2"
                        aria-label="Passphrase"
                        disabled={form.formState.isSubmitting}
                        {...form.register(
                          "extra.double_encryption.passphrase", {
                          required: form.getValues("extra.encryption") === EncryptionMethod.BackendEncryption && form.getValues("extra.double_encryption.enable")
                            ? "passphrase is required to encrypt before going to the server"
                            : undefined,
                          minLength: {
                            value: 4,
                            message: "passphrase is too short",
                          },
                          maxLength: {
                            value: 1024,
                            message: "passphrase is too long (max length: 1024 chars)"
                          },
                        })}
                        placeholder="Secondary passphrase"
                        errorMessage={form.formState.errors.extra?.double_encryption?.passphrase?.message}
                        isInvalid={
                          form.formState.touchedFields.extra?.double_encryption?.passphrase &&
                          !!form.formState.errors.extra?.double_encryption?.passphrase
                        }
                      />
                    </InputGroup>
                  </Form.Group>
                </>
              );

            case EncryptionMethod.FrontendEncryption:
              break;

            case EncryptionMethod.NoEncryption:
              return (
                <Form.Group controlId="formBasicDiscoverable" className="mb-4">
                  <Form.Label>Discoverability</Form.Label>
                  <InputGroup>
                    <Form.Switch
                      inline
                      id="public-switch"
                      {...form.register("extra.discoverable")}
                      label={"Note can" + (watchOut.extra.discoverable ? "" : "'t") + " be found publicly"}
                      disabled={form.formState.isSubmitting}
                    />
                  </InputGroup>
                </Form.Group>
              );
          }
        })()
      }
      <Form.Group>
        <Form.Text muted>
          <ul style={{ paddingLeft: "1rem" }}>
            <li>
              Title can always be seen upon request
            </li>
            <li>
              Passphrase for data encryption is not stored in database, as text nor hash
            </li>
            <li>
              Disabling discoverability will prevent any means of finding through its metadata such as title, creation time, etc.
            </li>
          </ul>
        </Form.Text>
      </Form.Group>
    </>
  );
  return (
    <>
      {
        noteResult && (
          <NewNoteModal data={{ ...noteResult }} onHide={() => {
            setNoteResult(undefined);
            local_storage.remove("last_saved_note");
          }} />
        )
      }
      <SimpleConfirmationModal
        title="Reset form"
        text="This will reset the form, continue?"
        show={modal.delete}
        onHide={() => setModal(p => ({ ...p, delete: false }))}
        doDecide={c => {
          if (c) resetForm();
          setModal(p => ({ ...p, delete: false }))
        }}
        centered
      />
      <Modal centered show={modal.extra_settings} onHide={() => setModal(p => ({ ...p, extra_settings: false }))}>
        <Modal.Header closeButton closeVariant="white">
          Options
        </Modal.Header>
        <Modal.Body>
          {extra_settings_group}
        </Modal.Body>
      </Modal>
      <Form className="mb-3 mt-3" noValidate onSubmit={form.handleSubmit(submit)}>
        <Row>
          <Col md="8" xs="12">
            <Form.Group controlId="formBasicTitle" className="position-relative mb-4">
              <Form.Label>Title</Form.Label>
              <Form.Text muted>
                {" "}(unencrypted)
              </Form.Text>
              <Form.Control
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
                {` (${!watchOut.extra.encryption ? "unencrypted" : "encrypted"})`}
              </Form.Text>
              <Form.Control
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
                disabled={watchOut.extra.encryption === EncryptionMethod.NoEncryption}
                isInvalid={watchOut.extra.encryption !== EncryptionMethod.NoEncryption
                  ? (form.formState.touchedFields.passphrase && !!form.formState.errors.passphrase)
                  : undefined
                }
              />
            </Form.Group>

            <Form.Group controlId="formBasicId" className="position-relative mb-4">
              <Form.Label>Custom ID</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  aria-label="Custom ID"
                  type="text"
                  placeholder="Enter note's custom ID here"
                  {...form.register("custom_id", {
                    max: { value: 32, message: "custom id is too long" },
                    min: { value: 1, message: "custom id is invalid" },
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

            <Form.Group controlId="formBasicDuration" className="mb-4">
              <Form.Label>
                Duration
              </Form.Label>
              <InputGroup hasValidation>
                <FormControl
                  aria-label="Day"
                  type="text"
                  placeholder="Days"
                  {...form.register("duration.day", {
                    validate: {
                      type: v => isNaN(+v) ? "second should represent a number" : undefined,
                      gte: v => +v >= 0 || "day should be greater than 0",
                    }
                  })}
                  isInvalid={form.formState.touchedFields.duration?.day && !!form.formState.errors.duration?.day}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{form.formState.errors.duration?.day?.message}</FormControl.Feedback>
                <FormControl
                  aria-label="Hour"
                  type="text"
                  placeholder="Hrs"
                  {...form.register("duration.hour", {
                    validate: {
                      type: v => isNaN(+v) ? "second should represent a number" : undefined,
                      gte: v => +v >= 0 || "hour should be greater than 0",
                    }
                  })}
                  isInvalid={form.formState.touchedFields.duration?.hour && !!form.formState.errors.duration?.hour}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{form.formState.errors.duration?.hour?.message}</FormControl.Feedback>
                <FormControl
                  aria-label="Minute"
                  type="text"
                  placeholder="Mins"
                  {...form.register("duration.minute", {
                    validate: {
                      type: v => isNaN(+v) ? "second should represent a number" : undefined,
                      gte: v => +v >= 0 || "minute should be greater than 0",
                    },
                  })}
                  isInvalid={form.formState.touchedFields.duration?.minute && !!form.formState.errors.duration?.minute}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{form.formState.errors.duration?.minute?.message}</FormControl.Feedback>
                <FormControl
                  aria-label="Second"
                  type="text"
                  placeholder="Secs"
                  {...form.register("duration.second", {
                    validate: {
                      type: v => isNaN(+v) ? "second should represent a number" : undefined,
                    },
                    min: {
                      value: !!(form.getValues("duration.day")
                        + form.getValues("duration.hour")
                        + form.getValues("duration.minute")
                      ) ? 0 : 30,
                      message: "second should be greater or equal 30"
                    },
                  })}
                  isInvalid={form.formState.touchedFields.duration?.second && !!form.formState.errors.duration?.second}
                  autoComplete="off"
                />
                <FormControl.Feedback type="invalid" tooltip>{form.formState.errors.duration?.second?.message}</FormControl.Feedback>
              </InputGroup>
              <Form.Text muted>
                * Omit these fields to set it permanent
              </Form.Text>
            </Form.Group>
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
    </>
  );
};

export default NewNote;
