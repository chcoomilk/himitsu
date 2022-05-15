import { useCallback, useContext, useEffect, useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router";
import { useNavigate, useLocation, Location } from "react-router-dom";
import cryptojs from "crypto-js";

import PassphraseModal from "../../components/passphrase/PassphraseModal";
import { DefaultValue, PATHS } from "../../utils/constants";
import { AppContext } from "../../utils/contexts";
import { NoteInfo, EncryptionMethod, Note } from "../../utils/types";
import { get_note, get_note_info, delete_note } from "../../queries";
import { generate_face, into_readable_datetime, local_storage } from "../../utils/functions";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { useTitle } from "../../custom-hooks";
import toast from "react-hot-toast";
import SimpleConfirmationModal from "../../components/SimpleConfirmationModal";

interface PasswordModalState {
  showModal: boolean,
  passphrase: string | null,
}

interface State {
  passphrase: string | null
}

interface ModifiedLocation extends Location {
  state: State | unknown
}

const NotePage = () => {
  let { _id } = useParams();
  const navigate = useNavigate();

  const { state }: ModifiedLocation = useLocation();
  const isPassphraseAvailable = (state: State | unknown): state is State => {
    return (state !== null && (state as State).passphrase !== undefined);
  }
  const { setAlerts } = useContext(AppContext);
  const [id] = useState<number>((() => {
    if (typeof _id === "undefined" || isNaN(+_id) || +_id === 0) {
      setAlerts(prev => {
        return {
          ...prev,
          invalidId: true
        };
      });
      navigate(PATHS.find_note);
      return 0;
    } else {
      return +_id;
    }
  })());

  const [note, setNote] = useState<Note | null>(null);
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
    onSuccess: ({ data, error }) => {
      if (!error) {
        setAlerts(prev => {
          return {
            ...prev,
            noteDelete: data.id.toString(),
          };
        });
      } else {
        setAlerts(prev => {
          prev[error] = data.id.toString();
          return { ...prev };
        });
      }
    }
  });

  const { mutate: mutate_get_note, isLoading, isSuccess } = useMutation(get_note, {
    onSuccess: result => {
      if (!result.error) {
        let data = result.data;

        let readableExpiryTime = data.expired_at
          ? into_readable_datetime(data.expired_at.secs_since_epoch)
          : "Never";

        let readableCreationTime = into_readable_datetime(data.created_at.secs_since_epoch);

        let readableUpdateTime = into_readable_datetime(data.updated_at.secs_since_epoch);

        let encryption: EncryptionMethod;
        if (result.data.backend_encryption) encryption = EncryptionMethod.BackendEncryption;
        else if (result.data.frontend_encryption) encryption = EncryptionMethod.FrontendEncryption;
        else encryption = EncryptionMethod.NoEncryption;

        let passphrase = isPassphraseAvailable(state) ? state.passphrase || modalMutate.passphrase : modalMutate.passphrase;
        setNote({
          id: data.id,
          title: data.title,
          content: data.content,
          decrypted: !data.frontend_encryption,
          encryption,
          passphrase,
          lastUpdateTime: readableUpdateTime,
          expiryTime: readableExpiryTime,
          creationTime: readableCreationTime,
          raw: data,
        });

        setTitle(data.title ? data.title.trim() : "Note");
      } else {
        setTitle(generate_face());
        let _ = result.error;
        setAlerts(prev => {
          prev[_] = id.toString();
          return { ...prev };
        });

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
      setAlerts(prev => {
        prev.serverError = id.toString();
        return { ...prev };
      })
    },
  });

  const {
    data: note_info,
    isError: info_error,
    isPreviousData: is_info_called,
    isFetching: is_info_loading,
  } = useQuery(
    ["note_info", id],
    () => get_note_info({ id }),
  );

  useEffect(() => {
    if (info_error) {
      setAlerts((prev) => {
        return {
          ...prev,
          serverError: id.toString(),
        };
      });
      setTitle(generate_face());
    }
  }, [id, info_error, setAlerts, setTitle]);

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
          if (isPassphraseAvailable(state) && state.passphrase !== null) {
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
          if (!note_info.data.frontend_encryption && isPassphraseAvailable(state) && state.passphrase !== null) {
            toast("Passphrase wasn't needed", {
              icon: <i className="bi bi-asterisk" />
            });
          }

          mutate_get_note({ id: note_info.data.id, passphrase: null });
        }
      } else {
        setAlerts(prev => {
          prev.serverError = id.toString();
          return { ...prev };
        });
      }
    }
  }, [id, note_info, is_info_called, info_error, mutate_get_note, state, setAlerts, setTitle]);

  const try_decrypt = useCallback((note: Note, passphrase: string): void => {
    let content = cryptojs.AES.decrypt(note.content, passphrase).toString(cryptojs.enc.Utf8);
    if (content) {
      setAlerts(prev => {
        prev.wrongPassphrase = id.toString();
        return { ...prev };
      });
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
      setAlerts(prev => {
        prev.wrongPassphrase = id.toString();
        return { ...prev };
      });
      setModalDecrypt({
        passphrase: null,
        showModal: true,
      });
    }
  }, [id, setAlerts]);

  // try to decrypt note on backend
  useEffect(() => {
    if (modalMutate.passphrase !== null && id) {
      mutate_get_note({ id: id, passphrase: modalMutate.passphrase });
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
      if (isPassphraseAvailable(state) && state.passphrase) {
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
  }, [isSuccess, note, state, try_decrypt, setModalDecrypt]);

  // delete confirmation 
  useEffect(() => {
    if (modalDelete.passphrase && note && id) {
      if (modalDelete.passphrase === note.passphrase) {
        del_note({ id: id, passphrase: note.passphrase });
      } else {
        setModalDelete({
          showModal: false,
          passphrase: null,
        });
        setAlerts(prev => {
          prev.wrongPassphrase = id.toString();
          return { ...prev };
        });
      }
    }
  }, [modalDelete.passphrase, note, del_note, id, setAlerts]);

  const handleRetry = () => {
    if (note?.encryption === EncryptionMethod.BackendEncryption) {
      setModalMutate(prev => {
        return {
          ...prev,
          showModal: true
        };
      });
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
    (isSuccess && note && id) && note.encryption === EncryptionMethod.NoEncryption
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
      const { created_at, expired_at, backend_encryption, frontend_encryption } = note.raw;
      let note_to_save: NoteInfo = {
        id: note.id,
        title: note.title,
        backend_encryption,
        created_at,
        expired_at,
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
          local_storage.set([...prev_notes, note_to_save]);
        }
      } else {
        local_storage.set([note_to_save]);
      }

      setAlerts(prev => {
        prev.noteDownload = note.title.toString();
        return { ...prev };
      });
    } else {
      toast.error("Unable to download, note is malformed");
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
        title={`Confirm to delete ${note?.title ? `"${note.title}"` : `note #${_id}`}`}
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
                      value={note ? note.title : DefaultValue.note.title}
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

export default NotePage;
