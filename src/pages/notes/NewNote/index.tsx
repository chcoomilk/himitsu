import { FormProvider, useForm } from "react-hook-form";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Container } from "react-bootstrap";
import { useMutation } from "react-query";

import { post_note } from "../../../queries";
import NewNoteModal from "../../../components/note/NewNoteModal";
import AppSettingContext, { AppAction } from "../../../utils/AppSettingContext";
import { EncryptionMethod, NoteInfo } from "../../../utils/types";
import { useTitle } from "../../../custom-hooks";
import { local_storage } from "../../../utils/functions";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import { Fields } from "./formtypes";
import NewNoteForm from "./Form";
import unwrap_default from "../../../utils/functions/unwrap";
import NewNoteContext, { NewNoteAction, NewNoteState, reducer } from "./context";

// ~5000-8000K memory footprint on chrome
const OptionModal = React.lazy(() => import("./OptionModal"));

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

type Props = {
  setAppSettings: React.Dispatch<AppAction>
}

const NewNote = ({ setAppSettings }: Props) => {
  useTitle("New Note");
  const appSettings = useContext(AppSettingContext);

  const newNoteReducer = useReducer<React.Reducer<NewNoteState, NewNoteAction>>(
    reducer,
    {
      modals: {
        reset: false,
        extra_settings: false,
      },
      defaultEncryption: appSettings.encryption,
      history: appSettings.history,
    }
  );

  const [pageState, dispatch] = newNoteReducer;

  useEffect(
    () => setAppSettings({ type: "toggleHistory" }),
    [setAppSettings, pageState.history]
  );
  useEffect(
    () => setAppSettings({ type: "switchEncryption", payload: pageState.defaultEncryption }),
    [setAppSettings, pageState.defaultEncryption]
  );

  const [noteModal, setNoteModal] = useState<UNoteInfo>();

  const form = useForm<Fields>({
    mode: "onChange",
    defaultValues: {
      encryption: appSettings.encryption,
      extra: {
        discoverable: false,
        double_encryption: {
          enable: false,
        }
      }
    },
  });

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
        allow_delete_with_passphrase: prev_values.extra.allow_delete_with_passphrase,
        delete_after_read: prev_values.extra.delete_after_read,
        save_locally: appSettings.history,
      });
      form.setValue("encryption", prev_values.encryption);
    })() : form.reset(undefined, { keepDefaultValues: true });
  };

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
      encryption: form_data.encryption,
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
            passphrase: form_data.encryption !== EncryptionMethod.NoEncryption ? form_data.passphrase : undefined,
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
    <FormProvider {...form}>
      <NewNoteContext.Provider value={newNoteReducer}>
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
          show={pageState.modals.reset}
          onHide={() => dispatch({ type: "toggleModalReset" })}
          doDecide={c => {
            if (c) resetForm();
            dispatch({ type: "toggleModalReset" });
          }}
          centered
        />
        <OptionModal show={pageState.modals.extra_settings} onHide={() => dispatch({ type: "toggleModalExtraSettings" })} />
        <Container className="d-flex flex-fill justify-content-center">
          <Container fluid className="m-0">
            <NewNoteForm onSubmit={submit} />
          </Container>
        </Container>
      </NewNoteContext.Provider>
    </FormProvider>
  );
};

export default NewNote;
