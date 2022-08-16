import { useState } from "react";
import { Button } from "react-bootstrap";
import toast from "react-hot-toast";

import { Alert as AlertT, NoteInfo } from "./utils/types";
import { unwrap } from "./utils/functions";
import SimpleConfirmationModal from "./components/SimpleConfirmationModal";
import NewNoteModal from "./components/note/NewNoteModal";

type AlertKeys = keyof AlertT;
const createAlertKeys = <T extends AlertKeys[]>(
  ...array: T & ([AlertKeys] extends [T[number]] ? unknown : "Missing a key")
) => array;

const new_note: UNoteInfo = {
  title: "Test Value Title",
  id: "debug_id",
  backend_encryption: true,
  created_at: {
    nanos_since_epoch: 0,
    secs_since_epoch: 0,
  },
  expires_at: {
    nanos_since_epoch: 0,
    secs_since_epoch: 0,
  },
  frontend_encryption: true,
  passphrase: "Test Value Passphrase"
};

const default_value = {
  modal: {
    confirmation: false,
    newNote: null,
  },
};

type UNoteInfo = NoteInfo & {
  passphrase?: string,
}

type ModalState = {
  confirmation: boolean,
  newNote: UNoteInfo | null,
}

type ShowState = {
  modal: ModalState,
}

const Debug = () => {
  const [show, setShow] = useState<ShowState>({
    modal: {
      ...default_value.modal,
    },
  });

  return (
    <>
      {
        createAlertKeys(
          "clientError",
          "notFound",
          "genericDelete",
          "genericSave",
          "serverError",
          "tooManyRequests",
          "wrongPassphrase",
          "handled",
          "accessDenied",
        ).map(key => {
          return (
            <Button
              className="mb-3"
              key={key}
              onClick={_ => {
                unwrap.default(key);
              }}
            >
              {key}
            </Button>
          );
        })
      }
      <Button
        className="mb-3"
        onClick={_ => {
          toast("toast");
        }}
      >
        Toast
      </Button>
      <Button
        className="mb-3"
        onClick={() => {
          setShow(prev => ({
            modal: {
              ...prev.modal,
              confirmation: true,
            }
          }));
        }}
      >
        Show confirmation modal
      </Button>
      <SimpleConfirmationModal centered show={show.modal.confirmation} doDecide={decision => {
        console.log(decision);
        setShow({
          modal: {
            ...default_value.modal,
          }
        });
      }} />
      <Button
        onClick={() => {
          setShow(prev => ({
            ...prev,
            modal: {
              ...prev.modal,
              newNote: new_note,
            },
          }));
        }}
      >
        Show new note modal
      </Button>
      {
        <NewNoteModal show={!!show.modal.newNote} data={show.modal.newNote || new_note} onHide={() => setShow({
          modal: {
            ...default_value.modal,
          }
        })} />
      }
    </>
  );
};

export default Debug;
