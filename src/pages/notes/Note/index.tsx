import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { Link } from "react-router-dom";
import cryptojs from "crypto-js";

import PassphraseModal from "../../../components/passphrase/PassphraseModal";
import { DefaultValue } from "../../../utils/constants";
import { NoteInfo, EncryptionMethod, Note as NoteT } from "../../../utils/types";
import { get_note, get_note_info, delete_note } from "../../../queries";
import { generate_face, into_readable_datetime, local_storage, truncate_string, unwrap } from "../../../utils/functions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTitle } from "../../../custom-hooks";
import toast from "react-hot-toast";
import SimpleConfirmationModal from "../../../components/SimpleConfirmationModal";

interface PasswordModalState {
  showModal: boolean,
  passphrase: string | null,
}

type Props = {
  readonly checked_id: string,
  readonly state_passphrase: string | null,
}

const Note = ({ checked_id: id, state_passphrase }: Props) => {
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

  const { mutate: del_note, isLoading: is_deleting, isSuccess: is_deleted } = useMutation(delete_note, {
    onSuccess: ({ error }) => {
      if (!error) {
        unwrap.default("genericDelete");
      } else {
        unwrap.default(error);
      }
    }
  });

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

        let passphrase = state_passphrase || modalMutate.passphrase;
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

  const {
    data: note_info,
    isError: is_info_error,
    error: info_error,
    isPreviousData: is_info_called,
    isFetching: is_info_loading,
  } = useQuery(
    ["note_info", id],
    () => get_note_info({ id }),
  );

  useEffect(() => {
    if (is_info_error) {
      unwrap.default("serverError");
      console.error("h_error: ", info_error);
      setTitle(generate_face());
    }
  }, [is_info_error, setTitle, info_error]);

  useEffect(() => {
    if (note_info) {
      if (!note_info.error) {
        let encryption: EncryptionMethod;
        if (note_info.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (note_info.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        setNote({
          ...DefaultValue.note,
          encryption,
          title: note_info.data.title,
          content: generate_face(),
        });

        if (note_info.data.backend_encryption) {
          if (state_passphrase) {
            mutate_get_note({ id: note_info.data.id, passphrase: state_passphrase });
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
          if (!note_info.data.frontend_encryption && state_passphrase) {
            toast("Passphrase was not needed", {
              icon: <i className="bi bi-asterisk" />
            });
          }

          mutate_get_note({ id: note_info.data.id, passphrase: null });
        }
      } else {
        if (note_info.error === "notFound") {
          toast.custom(t => (
            <Alert show={t.visible} variant="warning" dismissible onClose={() => toast.dismiss(t.id)}>
              <Alert.Heading>
                <i className="bi bi-question-circle"></i> {" "}
                Note #{((): JSX.Element => {
                  let id_str = id.toString();
                  if (id_str.length > 12) id_str = truncate_string(id.toString(), 12);
                  return <span title={id.toString()} onClick={() => toast(id.toString())}>{id_str}</span>;
                })()} was not found
              </Alert.Heading>
              <p>
                Note doesn't exist, or perhaps it's past its expiration date, {" "}
                <Link id="special-alert-link" to="/find" onClick={() => toast.dismiss(t.id)}>
                  Try Again
                </Link>?
              </p>
            </Alert>
          ), { ...unwrap.toast_alert_opts, id: "notFound" });
        } else {
          unwrap.default(note_info.error);
        }
      }
    }
  }, [id, note_info, is_info_called, is_info_error, state_passphrase, mutate_get_note, setTitle]);

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
      mutate_get_note({ id, passphrase: modalMutate.passphrase });
    }
  }, [id, modalMutate.passphrase, mutate_get_note]);

  // try to decrypt note on frontend
  useEffect(() => {
    if (modalDecrypt.passphrase !== null && note) {
      try_decrypt(note, modalDecrypt.passphrase);
    }
  }, [note, modalDecrypt.passphrase, try_decrypt]);

  // check if frontend decryption succeed or not
  useEffect(() => {
    if (isSuccess && note && note.encryption === EncryptionMethod.FrontendEncryption && !note.decrypted) {
      if (state_passphrase) {
        try_decrypt(note, state_passphrase);
      } else {
        setModalDecrypt(prev => {
          return {
            ...prev,
            showModal: true
          };
        });
      }
    }
  }, [isSuccess, note, state_passphrase, try_decrypt, setModalDecrypt]);

  // delete confirmation 
  useEffect(() => {
    if (modalDelete.passphrase && note) {
      if (modalDelete.passphrase === note.passphrase) {
        del_note({ id, passphrase: note.passphrase });
      } else {
        setModalDelete({
          showModal: false,
          passphrase: null,
        });
        unwrap.default("wrongPassphrase");
      }
    }
  }, [modalDelete.passphrase, note, del_note, id]);

  const handleRetry = () => {
    if (note?.encryption === EncryptionMethod.BackendEncryption) {
      if (!note.decrypted) {
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
        title={`Confirm to delete ${note?.title ? `"${note.title}"` : `note #${id}`}`}
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
            del_note({ id: id, passphrase: null })
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
                      value={note ? (note.title || undefined) : DefaultValue.note.title}
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
                      value={note ? note.content : DefaultValue.note.content}
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
                      value={note ? note.creationTime : DefaultValue.note.creationTime}
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
                      value={note ? note.expiryTime : DefaultValue.note.expiryTime}
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
