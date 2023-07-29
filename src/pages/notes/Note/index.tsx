import { useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row, Stack } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link, Location, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import "highlight.js/styles/tokyo-night-dark.css";

import PassphraseModal from "../../../components/modal/PassphraseModal";
import { DefaultValues, PATHS } from "../../../utils/constants";
import { NoteInfo, EncryptionMethod, Note as NoteT, note_id } from "../../../utils/types";
import { get_note, get_note_info, delete_note } from "../../../queries";
import { generate_face, into_readable_datetime, local_storage, truncate_string, unwrap } from "../../../utils/functions";
import { useAlert, useDescribe, useTitle } from "../../../custom-hooks";
import SimpleConfirmationModal from "../../../components/modal/SimpleConfirmationModal";
import { is_note_id } from "../../../utils/is";
import useDecrypt from "./custom-hooks/useDecrypt";
import ContentTextarea from "./ContentField";
import NoteInfoField from "./InfoField";

interface PasswordModalState {
  showModal: boolean,
  passphrase: string | null,
}

type State = {
  readonly id: note_id,
  readonly passphrase: string | null,
}

interface LocationState {
  passphrase: string | null
}

interface ModifiedLocation extends Location {
  state: LocationState | unknown
}

const is_state_valid = (state: LocationState | unknown): state is LocationState => {
  return (state !== null && (state as LocationState).passphrase !== undefined);
}

// lo' and behold! spaghetti codes, o' spaghetti codes
const Note = () => {
  const { id: unchecked_id } = useParams();
  const { state: unchecked_state }: ModifiedLocation = useLocation();
  const navigate = useNavigate();
  const launch = useAlert();

  useEffect(() => {
    if (!is_note_id(unchecked_id)) {
      toast("id is not valid", {
        icon: <i className="bi bi-exclamation-circle-fill" />,
        id: "invalid_id",
        duration: 4000,
      });
      navigate(PATHS.find_note, { replace: true });
    }
  }, [unchecked_id, navigate]);

  const [state] = useState<State>({
    id: (() => {
      let _id = "";
      if (is_note_id(unchecked_id)) {
        _id = unchecked_id;
      }

      return _id;
    })(),
    passphrase: (() => {
      let _passphrase = null;
      if (is_state_valid(unchecked_state) && unchecked_state.passphrase !== null) {
        _passphrase = unchecked_state.passphrase;
      }

      return _passphrase;
    })(),
  });
  const describe = useDescribe(`
    Showing note #${state.id}. Woah lookie here, you've found us in your favorite search engine!
    Content might be encrypted and has to be decrypted in
    order to see what's inside.
  `);

  const [note, setNote] = useState<NoteT>();
  const [modalDecrypt, setModalDecrypt] = useState<PasswordModalState>({
    showModal: false,
    passphrase: null,
  });
  const [modalMutate, setModalMutate] = useState<PasswordModalState>({
    showModal: false,
    passphrase: null
  });
  const [modalDelete, setModalDelete] = useState<PasswordModalState>({
    showModal: false,
    passphrase: null
  });
  const [modalConfirmDelete, setModalConfirmDelete] = useState(false);

  const setTitle = useTitle("Loading...");

  // getting the info
  const {
    data: note_info,
    isError: is_info_error,
    error: info_error,
    isPreviousData: is_info_called,
    isFetching: is_info_loading,
  } = useQuery(
    ["note_info", state.id],
    () => get_note_info({ id: state.id }),
    {
      enabled: is_note_id(unchecked_id),
      onSuccess: (res) => {
        let text = "Showing \"" + res.data.title + "\" ";
        if (res.data.title) {
          if (res.data.backend_encryption || res.data.frontend_encryption) {
            describe(text + "Note is encrypted, click here to try and decrypt it!");
          } else {
            describe(text + "Click here to see the rest of it");
          }
        }
      }
    }
  );

  // should execute when delete button is clicked
  const { mutate: del_note, isLoading: is_deleting, isSuccess: is_deleted } = useMutation(delete_note, {
    onSuccess: ({ error }) => {
      if (!error) {
        unwrap.default("genericDelete");
      } else {
        unwrap.default(error);
      }
    }
  });

  // gets note with password if present, should retry if password is not valid and back-end protected
  const { mutate: mutate_get_note, isLoading, isSuccess } = useMutation(get_note, {
    onSuccess: result => {
      if (!result.error) {
        let data = result.data;

        let readableExpiryTime = data.expires_at
          ? into_readable_datetime(data.expires_at.secs_since_epoch)
          : "Never";

        let readableCreationTime = into_readable_datetime(data.created_at.secs_since_epoch);

        let encryption: EncryptionMethod;
        if (result.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (result.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        let passphrase = state.passphrase || modalMutate.passphrase;
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          frontend_decrypted: !data.frontend_encryption,
          backend_decrypted: true,
          encryption,
          passphrase,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime,
          raw: data,
        });

        setTitle(data.title ? data.title.trim() : "Note");
      } else {
        setTitle(generate_face());
        unwrap.default(result.error);

        if (result.error === "wrongPassphrase") {
          setModalMutate(prev => {
            return {
              ...prev,
              showModal: true
            };
          });
        }
      }
    },
    onError: () => {
      setTitle(generate_face());
      unwrap.default("serverError");
    },
  });

  const decrypt = useDecrypt({
    onFail() {
      launch({
        title: "Decryption failed",
        content: "This is because the decryption function used with your passphrase returned an empty string",
        icon: "x",
        variant: "danger",
      });
      setModalDecrypt({
        passphrase: null,
        showModal: true,
      });
    },
    onSuccess(content) {
      setModalDecrypt({
        passphrase: null,
        showModal: false,
      });
      setNote(p => ({
        ...p,
        frontend_decrypted: true,
        content
      } as NoteT));
    },
  });

  // only possible case is server was not setup properly
  useEffect(() => {
    if (is_info_error) {
      unwrap.default("serverError");
      console.error("server_error: ", info_error);
      setTitle(generate_face());
    }
  }, [is_info_error, setTitle, info_error]);

  // determines whether note requested is real/valid
  useEffect(() => {
    if (note_info) {
      if (!note_info.error) {
        let encryption: EncryptionMethod;
        if (note_info.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (note_info.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        setNote({
          ...DefaultValues.note,
          encryption,
          title: note_info.data.title,
        });

        if (note_info.data.backend_encryption) {
          if (state.passphrase) {
            mutate_get_note({ id: note_info.data.id, passphrase: state.passphrase });
          } else {
            setTitle("🔒 Locked " + generate_face());

            setModalMutate(prev => {
              return {
                ...prev,
                showModal: true
              };
            });
          }
        } else {
          if (!note_info.data.frontend_encryption && state.passphrase) {
            toast("Passphrase was not needed", {
              icon: <i className="bi bi-asterisk" />
            });
          }

          mutate_get_note({ id: note_info.data.id, passphrase: null });
        }
      } else {
        if (note_info.error === "notFound") {
          setTitle(generate_face());
          launch({
            title: <>Note #
              <span
                className="d-inline-block align-bottom text-truncate"
                style={{ maxWidth: "15vw" }}
                onClick={() => toast(state.id.toString())}
              >
                {state.id}
              </span> was not found</>,
            content: (t) =>
              <>Note's already been deleted, {" "}
                <Link className="alert-link" to="/find" onClick={() => toast.dismiss(t.id)}>
                  Try Again
                </Link>?
              </>,
            duration: Infinity,
            variant: "warning"
          });
        } else {
          unwrap.default(note_info.error);
        }
      }
    }
  }, [state.id, note_info, is_info_called, is_info_error, state.passphrase, mutate_get_note, setTitle, launch]);

  // try to decrypt note on backend from modal
  useEffect(() => {
    if (modalMutate.passphrase) {
      mutate_get_note({ id: state.id, passphrase: modalMutate.passphrase });
    }
  }, [state.id, modalMutate.passphrase, mutate_get_note]);

  // try to decrypt note on frontend from modal
  useEffect(() => {
    if (modalDecrypt.passphrase !== null && note && note.content && !note.frontend_decrypted) {
      decrypt(note.content, modalDecrypt.passphrase);
    }
  }, [note, modalDecrypt.passphrase, decrypt]);

  // try to decrypt note on frontend
  useEffect(() => {
    if (isSuccess && note && note.content && !note.frontend_decrypted) {
      if (state.passphrase) {
        decrypt(note.content, state.passphrase);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    }
  }, [isSuccess, note, note?.frontend_decrypted, state.passphrase, decrypt, setModalDecrypt]);

  // delete confirmation 
  useEffect(() => {
    if (modalDelete.passphrase && note) {
      if (modalDelete.passphrase === note.passphrase) {
        del_note({ id: state.id, passphrase: note.passphrase });
      } else {
        setModalDelete({
          showModal: false,
          passphrase: null,
        });
        unwrap.default("wrongPassphrase");
      }
    }
  }, [modalDelete.passphrase, note, del_note, state.id]);

  const handleRetry = () => {
    if (note?.encryption === EncryptionMethod.BackendEncryption) {
      // check if backend + EXTRA POWAH, otherwise mutate
      if (note.raw?.frontend_encryption) {
        setModalDecrypt(p => ({
          ...p,
          showModal: true,
        }));
      } else {
        setModalMutate(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    } else {
      setModalDecrypt(prev => {
        return {
          ...prev,
          showModal: true,
        };
      });
    }
  };

  const handleDelete = () => {
    (isSuccess && note) && note.encryption === EncryptionMethod.NoEncryption
      ? setModalConfirmDelete(true)
      : setModalDelete(prev => {
        return {
          ...prev,
          showModal: true
        };
      });
  };

  const handleDownload = () => {
    if (note && note.raw) {
      const { created_at, expires_at, backend_encryption, frontend_encryption } = note.raw;
      let note_to_save: NoteInfo = {
        id: note.id,
        title: note.title,
        backend_encryption,
        created_at,
        expires_at,
        frontend_encryption,
      }
      let prev_notes = local_storage.get("notes");

      if (prev_notes) {
        if (prev_notes.find((note) => note.id === note_to_save.id)) {
          toast("This note is already in your saved notes", {
            icon: <i className="bi bi-chevron-bar-contract"></i>
          });

          return;
        } else {
          local_storage.set("notes", [...prev_notes, note_to_save]);
        }
      } else {
        local_storage.set("notes", [note_to_save]);
      }

      toast.custom(t => (
        <Alert show={t.visible} variant="primary" dismissible onClose={() => toast.dismiss(t.id)}>
          <Alert.Heading>
            <i className="bi bi-check"></i> {" "}
            {`Note "${truncate_string(note.title || note.id, 18)}" has been saved locally`}
          </Alert.Heading>
          <p>
            Ah yes that note, I remember it clearly.
            It was something about [REDACTED],<br />
            ahaha such memory to behold...
          </p>
        </Alert>
      ), { duration: 6000, ...unwrap.toast_alert_opts });
    } else {
      toast.error("Unable to download, note is malformed or not ready");
    }
  };

  return (
    <>
      <PassphraseModal
        show={modalDecrypt.showModal}
        setShow={(show) => setModalDecrypt(prev => {
          return { ...prev, showModal: show };
        })}
        newPassphrase={(passphrase) => setModalDecrypt({
          passphrase,
          showModal: false,
        })} />

      <PassphraseModal
        show={modalMutate.showModal}
        setShow={(show) => setModalMutate(prev => {
          return { ...prev, showModal: show };
        })}
        newPassphrase={(passphrase) => {
          setModalMutate({
            passphrase,
            showModal: false,
          })
        }} />

      <PassphraseModal
        title={`Confirm to delete ${note?.title ? `"${note.title}"` : `note #${state.id}`}`}
        show={modalDelete.showModal}
        setShow={(show) => setModalDelete(prev => {
          return { ...prev, showModal: show };
        })}
        newPassphrase={(passphrase) => setModalDelete({
          passphrase,
          showModal: false,
        })} />

      <SimpleConfirmationModal
        centered
        show={modalConfirmDelete}
        onHide={() => setModalConfirmDelete(false)}
        text={`You are about to delete ${note?.title || note?.id}`}
        doDecide={val => {
          if (val) {
            del_note({ id: state.id, passphrase: null })
          }

          setModalConfirmDelete(false);
        }}
      />

      <Container fluid className="py-3">
        <Row>
          <Col xxl="2">
            <NoteInfoField note={note ?? note_info?.data} isLoading={is_info_loading} />
          </Col>
          <Col xxl="8" className="pb-3">
            <Container fluid className="p-0">
              <ContentTextarea
                content={note?.content}
                encrypted={
                  note
                    ? !(
                      note.backend_decrypted && note.frontend_decrypted
                    )
                    : false
                }
                isLoading={isLoading || is_info_loading}
              />
            </Container>
          </Col>
          <Col>
            <Stack gap={3}>
              <Button
                size="lg"
                className="w-100"
                variant="danger"
                disabled={
                  (isLoading) ||
                  (note ? !note.frontend_decrypted : true) ||
                  (is_deleting || is_deleted)
                }
                onClick={handleDelete}>
                <i className="bi bi-trash"></i> Delete
              </Button>
              <Button
                size="lg"
                className="w-100"
                variant="primary"
                disabled={
                  (isLoading) ||
                  !(note && note.backend_decrypted && note.frontend_decrypted) ||
                  (is_deleting || is_deleted)
                }
                onClick={handleDownload}>
                <i className="bi bi-download"></i> Save
              </Button>
              <Button
                size="lg"
                variant="outline-warning"
                className="w-100"
                disabled={
                  (!isLoading) &&
                  (!note || note.frontend_decrypted)
                }
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-counterclockwise" /> Retry
              </Button>
            </Stack>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Note;
