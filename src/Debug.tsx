import { useState } from "react";
import { Alert, Button } from "react-bootstrap";
import toast from "react-hot-toast";

import { Alert as AlertT, NoteInfo } from "./utils/types";
import { unwrap } from "./utils/functions";
import SimpleConfirmationModal from "./components/SimpleConfirmationModal";
import NewNoteModal from "./components/note/NewNoteModal";

type AlertKeys = keyof AlertT;
const createAlertKeys = <T extends AlertKeys[]>(
  ...array: T & ([AlertKeys] extends [T[number]] ? unknown : "Missing a key")
) => array;

const new_note = {
  title: "Test Value Title",
  id: 0,
  backend_encryption: true,
  created_at: {
    nanos_since_epoch: 0,
    secs_since_epoch: 0,
  },
  expired_at: {
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
          toast((t) => (
            <Alert dismissible onClose={() => {
              toast.dismiss(t.id);
            }}>
              <Alert.Heading>
                Hello Hello Hello Hello Hello Hello Hello Hello Hello Hello
              </Alert.Heading>
              <p>
                World World World World World World World Why Stack
              </p>
            </Alert>
          ), { duration: Infinity, className: "toast-alert" });
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
