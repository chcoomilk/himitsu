import { FormProvider, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Form, InputGroup, Modal, Container } from "react-bootstrap";
import { useMutation } from "react-query";

import { post_note } from "../../../queries";
import NewNoteModal from "../../../components/note/NewNoteModal";
import AppContext from "../../../utils/app_state_context";
import { EncryptionMethod, NoteInfo } from "../../../utils/types";
import { useTitle } from "../../../custom-hooks";
import { local_storage } from "../../../utils/functions";
import PassphraseInputGroup from "../../../components/input/PassphraseInputGroup";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import { Fields } from "./formtypes";
import NewNoteForm from "./Form";
import unwrap_default from "../../../utils/functions/unwrap";

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

const NewNote = () => {
  useTitle("New Note");
  const { appSettings } = useContext(AppContext);
  const [noteModal, setNoteModal] = useState<UNoteInfo>();
  const [eventModal, setEventModal] = useState({
    delete: false,
    extra_settings: false,
  });

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
          enable: false,
          passphrase: form.getValues("extra.double_encryption.passphrase"),
        },
        encryption: prev_values.extra.encryption,
        allow_delete_with_passphrase: prev_values.extra.allow_delete_with_passphrase,
        delete_after_read: prev_values.extra.delete_after_read,
      })
    })() : form.reset(undefined, { keepDefaultValues: true });
  };

  const shouldExtraEncryptionEnable = () => form.getValues("extra.encryption") === EncryptionMethod.BackendEncryption && form.getValues("extra.double_encryption.enable");

  const { mutateAsync } = useMutation(post_note);
  const submit = async (form_data: Fields) => new Promise<void>((resolve) => {
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

    mutateAsync({
      discoverable: form_data.extra.discoverable,
      custom_id: form_data.custom_id,
      double_encrypt: form_data.extra.double_encryption.passphrase,
      encryption: form_data.extra.encryption,
      title: form_data.title,
      content: form_data.content,
      lifetime_in_secs: duration_in_secs,
      passphrase: form_data.passphrase,
      allow_delete_with_passphrase: form_data.extra.allow_delete_with_passphrase,
      delete_after_read: form_data.extra.delete_after_read,
    })
      .then(result => {
        const { data, error } = result;
        if (!error) {
          setNoteModal({
            ...data,
            passphrase: form_data.extra.encryption !== EncryptionMethod.NoEncryption ? form_data.passphrase : undefined,
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
      })
      .finally(() => {
        resolve();
      });
  });

  return (
    <>
      {
        noteModal && (
          <NewNoteModal data={{ ...noteModal }} onHide={() => {
            setNoteModal(undefined);
            local_storage.remove("last_saved_note");
          }} />
        )
      }
      <SimpleConfirmationModal
        title="Reset form"
        text="This will reset the form, continue?"
        show={eventModal.delete}
        onHide={() => setEventModal(p => ({ ...p, delete: false }))}
        doDecide={c => {
          if (c) resetForm();
          setEventModal(p => ({ ...p, delete: false }))
        }}
        centered
      />
      <Modal centered show={eventModal.extra_settings} onHide={
        async () => {
          let okay = await form.trigger("extra.double_encryption");
          okay = await form.trigger("extra.double_encryption.passphrase");
          okay
            ? setEventModal(p => ({ ...p, extra_settings: false }))
            : form.trigger("extra.double_encryption.passphrase")
        }
      }>
        <Modal.Header closeButton closeVariant="white">
          Options
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formBasicSeeOnce" className="mb-2">
            <InputGroup>
              <Form.Switch
                inline
                id="seeOnce-switch"
                // {...form.register("extra.discoverable")}
                label={"Delete after read"}
                disabled={form.formState.isSubmitting}
              />
            </InputGroup>
          </Form.Group>
          <Form.Group
            hidden={watchOut.extra.encryption === EncryptionMethod.NoEncryption}
            controlId="delete-w-password-switch"
            className="mb-2"
          >
            <InputGroup>
              <Form.Switch
                inline
                id="delete-w-password-switch"
                // {...form.register("extra.discoverable")}
                label={"Allow to delete with passphrase"}
                disabled={form.formState.isSubmitting}
              />
            </InputGroup>
          </Form.Group>
          {(() => {
            switch (watchOut.extra.encryption) {
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
                        label={"Frontend Encryption"}
                        disabled={form.formState.isSubmitting}
                      />
                    </InputGroup>
                    <PassphraseInputGroup
                      disabled={form.formState.isSubmitting || !watchOut.extra.double_encryption.enable}
                      aria-label="Passphrase"
                      // disabled={form.formState.isSubmitting}
                      {...form.register(
                        "extra.double_encryption.passphrase", {
                        required: shouldExtraEncryptionEnable() ? "passphrase is required to encrypt before going to the server" : undefined,
                        minLength: {
                          value: shouldExtraEncryptionEnable() ? 4 : 0,
                          message: "passphrase is too short",
                        },
                        maxLength: {
                          value: shouldExtraEncryptionEnable() ? 1024 : Infinity,
                          message: "passphrase is too long (max length: 1024 chars)"
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
          })()}
        </Modal.Body>
      </Modal>
      <FormProvider {...form}>
        <Container className="d-flex flex-fill justify-content-center">
          <Container fluid className="m-0">
            <NewNoteForm onSubmit={submit} setModal={setEventModal} />
          </Container>
        </Container>
      </FormProvider>
    </>
  );
};

export default NewNote;
