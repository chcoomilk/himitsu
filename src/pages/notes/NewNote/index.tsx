import { FormProvider, useForm } from "react-hook-form";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Container } from "react-bootstrap";
import { useMutation } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";

import { Fields } from "./formtypes";
import NewNoteForm from "./Form";
import NewNoteContext, { reducer } from "./context";
import OptionModal from "./OptionModal";
import { post_note } from "../../../queries";
import AppSettingContext from "../../../utils/AppSettingContext";
import { EncryptionMethod, NoteInfo } from "../../../utils/types";
import { useTitle } from "../../../custom-hooks";
import { local_storage } from "../../../utils/functions";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import unwrap_default from "../../../utils/functions/unwrap";
import { Is } from "../../../utils/functions/is";
import { useLocalStorage } from "usehooks-ts";

const NoteInfoModal = React.lazy(() => import("../../../components/note/NoteInfoModal"));

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

const NewNote = () => {
  useTitle("New Note");
  const appSettings = useContext(AppSettingContext);
  const [encryption, setEncryption] = useLocalStorage("encryption", EncryptionMethod.BackendEncryption);
  const [contentRow, setContentRow] = useLocalStorage("newNoteRow", 15);
  const [alwaysSaveOnSubmit, setAlwaysSaveOnSubmit] = useLocalStorage("alwaysSaveOnSubmit", false);
  const [simpleMode, setSimpleMode] = useLocalStorage("simpleForm", true);
  const [mustExpire, setMustExpire] = useLocalStorage("noteMustHaveExpiration", true);
  // const [formSession, setFormSession] = useSessionStorage<Fields | undefined>("noteForm", undefined);

  const newNoteReducer = useReducer(
    reducer,
    {
      modals: {
        reset: false,
        extra_settings: false,
        extra_settings_static_height: false,
      },
      defaultEncryption: Is.existValueInEnum(EncryptionMethod, encryption)
        ? (encryption as EncryptionMethod)
        : EncryptionMethod.BackendEncryption,
      alwaysSaveOnSubmit: alwaysSaveOnSubmit,
      textAreaRow: !isNaN(contentRow) ? contentRow : 15,
      mustExpire,
      simpleMode,
    }
  );

  const [pageState, dispatch] = newNoteReducer;
  const [noteModal, setNoteModal] = useState<UNoteInfo>();

  const form = useForm<Fields>({
    mode: "onChange",
    defaultValues: {
      encryption: pageState.defaultEncryption,
      extra: {
        discoverable: false,
        save_locally: pageState.alwaysSaveOnSubmit,
      }
    },
  });

  const {
    setValue: formSetValue,
    trigger: formTrigger,
    formState: { touchedFields },
    getValues: formGetValues,
  } = form;
  const [
    passphraseValue,
    encryptionValue,
    extraFrontendPassphrase,
  ] = form.watch([
    "passphrase",
    "encryption",
    "extra.double_encryption",
  ]);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    touchedFields.passphrase && formTrigger("passphrase");
  }, [encryptionValue, formTrigger, touchedFields.passphrase])

  useEffect(() => {
    if (pageState.simpleMode) {
      if (passphraseValue) formSetValue("encryption", EncryptionMethod.BackendEncryption);
      else formSetValue("encryption", EncryptionMethod.NoEncryption);
    } else {
      formSetValue("encryption", pageState.defaultEncryption);
    }
  }, [pageState.defaultEncryption, pageState.simpleMode, passphraseValue, formSetValue]);

  useEffect(() => {
    setAlwaysSaveOnSubmit(pageState.alwaysSaveOnSubmit);
    // if the input field is touched, or manually changed, not following default anymore
    if (!form.formState.touchedFields.extra?.save_locally) formSetValue("extra.save_locally", pageState.alwaysSaveOnSubmit);
  }, [form.formState.touchedFields.extra?.save_locally, formSetValue, pageState.alwaysSaveOnSubmit, setAlwaysSaveOnSubmit]);

  useEffect(() => {
    setEncryption(pageState.defaultEncryption);
    if (!form.formState.touchedFields.encryption) formSetValue("encryption", pageState.defaultEncryption);
  }, [form.formState.touchedFields.encryption, formSetValue, pageState.defaultEncryption, setEncryption]);

  useEffect(() => setContentRow(pageState.textAreaRow), [pageState.textAreaRow, setContentRow]);
  useEffect(() => setSimpleMode(pageState.simpleMode), [pageState.simpleMode, setSimpleMode]);
  useEffect(() => {
    setMustExpire(pageState.mustExpire);
    if (
      pageState.mustExpire &&
      !(
        formGetValues("duration.day") ||
        formGetValues("duration.hour") ||
        formGetValues("duration.minute") ||
        formGetValues("duration.second")
      )
    ) {
      formSetValue("duration.second", 30 * 60);
    }
  }, [pageState.mustExpire, setMustExpire, formGetValues, formSetValue]);
  useEffect(() => {
    if (encryptionValue !== EncryptionMethod.BackendEncryption) {
      if (extraFrontendPassphrase) {
        formSetValue("extra.double_encryption", "");
      }
    }
  }, [encryptionValue, extraFrontendPassphrase, formSetValue]);

  const { mutateAsync } = useMutation(post_note);
  const submit = async (form_data: Fields) => new Promise<void>((resolve) => {
    let duration_in_secs: number | undefined = form_data.duration?.second;
    if (form_data.duration?.day) {// @ts-expect-error
      duration_in_secs += form_data.duration?.day * 86400;
    }
    if (form_data.duration?.hour) {// @ts-expect-error
      duration_in_secs += form_data.duration?.hour * 3600;
    }
    if (form_data.duration?.minute) {// @ts-expect-error
      duration_in_secs += form_data.duration?.minute * 60;
    }

    duration_in_secs = Number(duration_in_secs);

    if (!duration_in_secs || isNaN(duration_in_secs)) {
      duration_in_secs = undefined;
    }

    mutateAsync({
      discoverable: form_data.extra.discoverable,
      custom_id: form_data.custom_id,
      double_encrypt: form_data.extra.double_encryption,
      encryption: form_data.encryption,
      title: form_data.title,
      content: form_data.content,
      lifetime_in_secs: duration_in_secs,
      passphrase: form_data.passphrase,
      allow_delete_with_passphrase: form_data.extra.allow_delete_with_passphrase,
      delete_after_read: +form_data.extra.delete_after_read,
    })
      .then(result => {
        const { data, error } = result;
        if (!error) {
          setNoteModal({
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

          form.reset();
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
    <FormProvider {...form}>
      <NewNoteContext.Provider value={newNoteReducer}>
        {
          noteModal && (
            <NoteInfoModal data={{ ...noteModal }} onHide={() => {
              setNoteModal(undefined);
              local_storage.remove("last_saved_note");
            }} />
          )
        }
        <SimpleConfirmationModal
          title="Reset form"
          text="This will reset the form, continue?"
          show={pageState.modals.reset}
          onHide={() => dispatch({ type: "toggleModalReset" })}
          doDecide={c => {
            if (c) form.reset();
            dispatch({ type: "toggleModalReset" });
          }}
          centered
        />
        <OptionModal show={location.hash === "#options"} onHide={() => navigate(-1)} />
        <Container className="d-flex flex-fill justify-content-center">
          <Container fluid className="p-0">
            <NewNoteForm onSubmit={submit} />
          </Container>
        </Container>
      </NewNoteContext.Provider>
    </FormProvider>
  );
};

export default NewNote;
