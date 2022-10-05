import { Controller, FormProvider, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Form, DropdownButton, Dropdown, InputGroup, Modal } from "react-bootstrap";
import { useMutation } from "react-query";
import { capitalCase } from "change-case"

import NewNoteModal from "../../../components/note/NewNoteModal";
import AppContext from "../../../utils/app_state_context";
import { createEncryptionMethodKeys, EncryptionMethod, NoteInfo } from "../../../utils/types";
import { post_note } from "../../../queries";
import { useTitle } from "../../../custom-hooks";
import { local_storage } from "../../../utils/functions";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import unwrap_default from "../../../utils/functions/unwrap";
import { Fields } from "./form";
import NewNoteForm from "./Form";

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
    let duration_in_secs: number | undefined = form_data.duration.second;
    if (form_data.duration.day) {
      duration_in_secs += form_data.duration.day * 86400;
    }
    if (form_data.duration.hour) {
      duration_in_secs += form_data.duration.hour * 3600;
    }
    if (form_data.duration.minute) {
      duration_in_secs += form_data.duration.minute * 60;
    }

    duration_in_secs = Number(duration_in_secs);

    if (!duration_in_secs || isNaN(duration_in_secs)) {
      duration_in_secs = undefined;
    }
    console.log(duration_in_secs);
    mutateAsync({
      discoverable: form_data.extra.discoverable,
      custom_id: form_data.custom_id,
      double_encrypt: form_data.extra.double_encryption.passphrase,
      encryption: form_data.extra.encryption,
      title: form_data.title,
      content: form_data.content,
      lifetime_in_secs: duration_in_secs,
      passphrase: form_data.passphrase,
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
      <FormProvider {...form}>
        <NewNoteForm extra_settings_group={extra_settings_group} onSubmit={submit} setModal={setModal} />
      </FormProvider>
    </>
  );
};

export default NewNote;
