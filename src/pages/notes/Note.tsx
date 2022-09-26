import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link, Location, useLocation, useNavigate, useParams } from "react-router-dom";
import cryptojs from "crypto-js";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import toast from "react-hot-toast";

import PassphraseModal from "../../components/passphrase/PassphraseModal";
import { DefaultValues, PATHS } from "../../utils/constants";
import { NoteInfo, EncryptionMethod, Note as NoteT, note_id } from "../../utils/types";
import { get_note, get_note_info, delete_note } from "../../queries";
import { generate_face, into_readable_datetime, local_storage, truncate_string, unwrap } from "../../utils/functions";
import { useTitle } from "../../custom-hooks";
import SimpleConfirmationModal from "../../components/SimpleConfirmationModal";
import { is_note_id } from "../../utils/functions/is";

interface PasswordModalState {
  showModal: boolean,
  passphrase: string | null,
}

type URLParamState = {
  readonly id: note_id,
  readonly passphrase: string | null,
}

interface State {
  passphrase: string | null
}

interface ModifiedLocation extends Location {
  state: State | unknown
}

const is_state_valid = (state: State | unknown): state is State => {
  return (state !== null && (state as State).passphrase !== undefined);
}

const Note = () => {
  const { id: unchecked_id } = useParams();
  const { state: unchecked_state }: ModifiedLocation = useLocation();
  const navigate = useNavigate();

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

  const [state] = useState<URLParamState>({
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
  const [note, setNote] = useState<NoteT | null>(null);
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
          decrypted: !data.frontend_encryption,
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

  // only possible case is server was not setup properly
  useEffect(() => {
    if (is_info_error) {
      unwrap.default("serverError");
      console.error("h_error: ", info_error);
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
          content: generate_face(),
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
          toast.custom(t => (
            <Alert show={t.visible} variant="warning" dismissible onClose={() => toast.dismiss(t.id)}>
              <Alert.Heading>
                <i className="bi bi-question-circle"></i> {" "}
                Note #{((): JSX.Element => {
                  let id_str = state.id.toString();
                  if (id_str.length > 12) id_str = truncate_string(state.id.toString(), 12);
                  return <span title={state.id.toString()} onClick={() => toast(state.id.toString())}>{id_str}</span>;
                })()} was not found
              </Alert.Heading>
              <p>
                Note doesn't exist, or perhaps it's past its expiration date, {" "}
                <Link className="alert-link" to="/find" onClick={() => toast.dismiss(t.id)}>
                  Try Again
                </Link>?
              </p>
            </Alert>
          ), { ...unwrap.toast_alert_opts, id: "notFound", duration: Infinity });
        } else {
          unwrap.default(note_info.error);
        }
      }
    }
  }, [state.id, note_info, is_info_called, is_info_error, state.passphrase, mutate_get_note, setTitle]);

  // function to decrypt the note if frontend encryption is true
  const try_decrypt = useCallback((note: NoteT, passphrase: string): void => {
    try {
      let content = cryptojs.AES.decrypt(note.content, passphrase).toString(cryptojs.enc.Utf8);
      if (content) {
        setModalDecrypt({
          passphrase: null,
          showModal: false,
        });
        setNote({
          ...note,
          passphrase,
          decrypted: true,
          content
        });
      } else {
        toast.custom(t => (
          <Alert show={t.visible} variant="danger" dismissible onClose={() => toast.dismiss(t.id)}>
            <Alert.Heading>
              <i className="bi bi-x"></i> {" "}
              Wrong passphrase?
            </Alert.Heading>
            <p>
              Content was empty when decrypted with current passphrase.
            </p>
          </Alert>
        ), { duration: 6000, ...unwrap.toast_alert_opts });
        setModalDecrypt({
          passphrase: null,
          showModal: true,
        });
      }
    } catch (error) {
      toast.custom(t => (
        <Alert show={t.visible} variant="secondary" dismissible onClose={() => toast.dismiss(t.id)}>
          <Alert.Heading>
            <i className="bi bi-x"></i> {" "}
            Decryption failed
          </Alert.Heading>
          <p>
            This should not had happened, check log for details
          </p>
        </Alert>
      ), { duration: Infinity, ...unwrap.toast_alert_opts });
      console.error("h_error: ", error);
    }
  }, []);

  // try to decrypt note on backend
  useEffect(() => {
    if (modalMutate.passphrase !== null) {
      mutate_get_note({ id: state.id, passphrase: modalMutate.passphrase });
    }
  }, [state.id, modalMutate.passphrase, mutate_get_note]);

  // try to decrypt note on frontend
  useEffect(() => {
    if (modalDecrypt.passphrase !== null && note && !note.decrypted) {
      try_decrypt(note, modalDecrypt.passphrase);
    }
  }, [note, modalDecrypt.passphrase, try_decrypt]);

  // check if frontend decryption succeed or not
  useEffect(() => {
    if (isSuccess && note && note.encryption === EncryptionMethod.FrontendEncryption && !note.decrypted) {
      if (state.passphrase) {
        try_decrypt(note, state.passphrase);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    }
  }, [isSuccess, note, state.passphrase, try_decrypt, setModalDecrypt]);

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
          toast("This note had already been saved before", {
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
    <Row className="mb-3">
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
        text={`You are about to delete ${note?.title}`}
        doDecide={val => {
          if (val) {
            del_note({ id: state.id, passphrase: null })
          }

          setModalConfirmDelete(false);
        }}
      />

      <Row>
        <Col xl={{ span: 6, offset: 3 }} xs={{ span: 10, offset: 1 }}>
          <Form noValidate>
            <SkeletonTheme duration={1.5} baseColor="#24282e" highlightColor="#a8a8a8">

              <Form.Group controlId="formBasicTitle" className="mb-4">
                <Form.Label>Title</Form.Label>
                {
                  is_info_loading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note ? (note.title || undefined) : DefaultValues.note.title}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicDescription" className="mb-4">
                <Form.Label>Description</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={100} />
                    : <Form.Control
                      as="textarea"
                      type="text"
                      name="expires"
                      value={note ? note.content : DefaultValues.note.content}
                      rows={(() => {
                        // const len = note?.content.length;
                        // const max_until_break = 4;
                        return 4;
                      })()}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicCreatedAt" className="mb-4">
                <Form.Label>Created at</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note ? note.creationTime : DefaultValues.note.creationTime}
                      readOnly
                    />
                }
              </Form.Group>

              <Form.Group controlId="formBasicExpiresAt" className="mb-4">
                <Form.Label>Expires at</Form.Label>
                {
                  is_info_loading || isLoading
                    ? <Skeleton height={35} />
                    : <Form.Control
                      type="text"
                      name="expires"
                      value={note ? note.expiryTime : DefaultValues.note.expiryTime}
                      readOnly
                    />
                }
              </Form.Group>
            </SkeletonTheme>
            <Stack direction="horizontal" gap={3}>
              <Button
                size="lg"
                className="ms-auto"
                variant="danger"
                disabled={
                  (isLoading) ||
                  (note === null ? true : !note.decrypted) ||
                  (is_deleting || is_deleted)
                }
                onClick={handleDelete}>
                <i className="bi bi-trash"></i>
              </Button>
              <Button
                size="lg"
                variant="primary"
                disabled={
                  (isLoading) ||
                  (note === null ? true : !note.decrypted) ||
                  (is_deleting || is_deleted)
                }
                onClick={handleDownload}>
                <i className="bi bi-download"></i>
              </Button>
              <Button
                size="lg"
                variant="outline-warning"
                disabled={
                  (isLoading) ||
                  (note === null ? true : note.decrypted)
                }
                onClick={handleRetry}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </Stack>
          </Form>
        </Col>
      </Row>
    </Row>
  );
};

export default Note;
